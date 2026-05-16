import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const distDir = path.join(__dirname, 'dist');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(compression());
app.use(express.json());

async function lookupIpapi(ip) {
  const r = await fetch(`https://ipapi.co/${ip}/json/`, {
    headers: { 'User-Agent': 'aa-corretora-landing/1.0' },
  });
  if (!r.ok) throw new Error(`ipapi.co ${r.status}`);
  const data = await r.json();
  if (data?.error) throw new Error(`ipapi.co error: ${data.reason || 'unknown'}`);
  return {
    country: data.country_code || null,
    city: data.city || null,
    state: data.region_code || null,
    raw: data,
    provider: 'ipapi.co',
  };
}

async function lookupIpwhois(ip) {
  const r = await fetch(`https://ipwho.is/${ip}`);
  if (!r.ok) throw new Error(`ipwho.is ${r.status}`);
  const data = await r.json();
  if (!data?.success) throw new Error(`ipwho.is error: ${data?.message || 'unknown'}`);
  return {
    country: data.country_code || null,
    city: data.city || null,
    state: data.region_code || null,
    raw: data,
    provider: 'ipwho.is',
  };
}

app.get('/api/geo', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const xff = req.headers['x-forwarded-for'];
  const rawIp = (xff && String(xff).split(',')[0].trim()) || req.ip || '';
  const clientIp = rawIp.replace(/^::ffff:/, '');

  if (!clientIp || clientIp === '::1' || clientIp.startsWith('127.')) {
    return res.json({ city: null, state: null });
  }

  for (const fn of [lookupIpapi, lookupIpwhois]) {
    try {
      const out = await fn(clientIp);
      if (out.country !== 'BR') {
        return res.json({ city: null, state: null });
      }
      return res.json({ city: out.city, state: out.state });
    } catch (err) {
      console.warn('[geo] provider failed:', err.message);
    }
  }

  res.json({ city: null, state: null });
});

const leadsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OBJETIVOS = new Set(['imovel', 'veiculo']);
const TIPOS_IMOVEL = new Set(['Casa / Apartamento', 'Terreno / Construção', 'Imóvel comercial', 'Investimento']);
const TIPOS_VEICULO = new Set(['Carro 0km', 'Carro seminovo', 'Moto', 'Pesado / Utilitário']);
const FAIXAS_IDADE = new Set(['18 – 25 anos', '26 – 35 anos', '36 – 45 anos', '46 – 55 anos', '56+ anos']);

function str(v, max) {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  return s.slice(0, max);
}

const META_PIXEL_ID = process.env.META_PIXEL_ID || '3065919830274786';
const META_ACCESS_TOKEN = process.env.META_PIXEL_ACCESS_TOKEN || '';
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || '';
const META_GRAPH_VERSION = 'v21.0';

function sha256(v) {
  return crypto.createHash('sha256').update(String(v)).digest('hex');
}

function fbNormalize(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function fbNormalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('55') && digits.length >= 12) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

function fbSplitName(full) {
  const parts = fbNormalize(full).replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { fn: null, ln: null };
  if (parts.length === 1) return { fn: parts[0], ln: null };
  return { fn: parts[0], ln: parts.slice(1).join(' ') };
}

function fbExtractCity(cidadeRaw) {
  const raw = String(cidadeRaw || '');
  const noUf = raw.includes(' - ') ? raw.split(' - ')[0] : raw;
  const ct = fbNormalize(noUf).replace(/\s+/g, '');
  return ct || null;
}

function fbNormalizeState(estadoRaw, cidadeRaw) {
  let uf = String(estadoRaw || '').trim();
  if (!uf && cidadeRaw && String(cidadeRaw).includes(' - ')) {
    uf = String(cidadeRaw).split(' - ')[1] || '';
  }
  uf = uf.trim().toLowerCase();
  return /^[a-z]{2}$/.test(uf) ? uf : null;
}

function buildUserData(lead, req) {
  const { fn, ln } = fbSplitName(lead.nome);
  const email = lead.email ? fbNormalize(lead.email) : null;
  const phone = fbNormalizePhone(lead.telefone);
  const city = fbExtractCity(lead.cidade);
  const state = fbNormalizeState(lead.estado, lead.cidade);

  const xff = req.headers['x-forwarded-for'];
  const rawIp = (xff && String(xff).split(',')[0].trim()) || req.ip || '';
  const clientIp = rawIp.replace(/^::ffff:/, '');
  const userAgent = req.headers['user-agent'] || '';

  const ud = {
    em: email ? [sha256(email)] : undefined,
    ph: phone ? [sha256(phone)] : undefined,
    fn: fn ? [sha256(fn)] : undefined,
    ln: ln ? [sha256(ln)] : undefined,
    ct: city ? [sha256(city)] : undefined,
    st: state ? [sha256(state)] : undefined,
    country: [sha256('br')],
    external_id: lead.id ? [sha256(String(lead.id))] : undefined,
    client_ip_address: clientIp || undefined,
    client_user_agent: userAgent || undefined,
  };

  Object.keys(ud).forEach((k) => ud[k] === undefined && delete ud[k]);
  return ud;
}

async function sendLeadToCapi(lead, req) {
  if (!META_ACCESS_TOKEN) return;

  const payload = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: String(lead.id),
        event_source_url: req.headers.referer || `https://${req.headers.host || ''}/`,
        action_source: 'website',
        user_data: buildUserData(lead, req),
        custom_data: { content_name: 'Quiz consórcio' },
      },
    ],
  };
  if (META_TEST_EVENT_CODE) payload.test_event_code = META_TEST_EVENT_CODE;

  try {
    const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const body = await r.text().catch(() => '');
      console.warn('[capi] non-ok response %s: %s', r.status, body.slice(0, 500));
      return;
    }
    const json = await r.json().catch(() => null);
    console.log('[capi] Lead sent eventId=%s received=%s', lead.id, json?.events_received ?? '?');
  } catch (err) {
    console.warn('[capi] failed:', err.message);
  }
}

app.post('/api/leads', leadsLimiter, async (req, res) => {
  try {
    const { objetivo, tipoImovel, tipoVeiculo, valor, renda, idade, nome, email, telefone, cidade, estado, hp_field } = req.body || {};

    if (hp_field) {
      return res.status(201).json({ success: true, id: null });
    }

    if (!OBJETIVOS.has(objetivo)) {
      return res.status(400).json({ error: 'objetivo inválido' });
    }
    const tipoBem = objetivo === 'imovel' ? tipoImovel : tipoVeiculo;
    const tiposPermitidos = objetivo === 'imovel' ? TIPOS_IMOVEL : TIPOS_VEICULO;
    if (!tiposPermitidos.has(tipoBem)) {
      return res.status(400).json({ error: 'tipo de bem inválido' });
    }
    if (idade != null && !FAIXAS_IDADE.has(idade)) {
      return res.status(400).json({ error: 'faixa de idade inválida' });
    }

    const cleanNome = str(nome, 120);
    const cleanEmail = str(email, 160);
    const cleanTelefone = str(telefone, 20);
    if (!cleanNome || cleanNome.length < 2) {
      return res.status(400).json({ error: 'nome inválido' });
    }
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
      return res.status(400).json({ error: 'email inválido' });
    }
    const telDigits = cleanTelefone ? cleanTelefone.replace(/\D/g, '') : '';
    if (telDigits.length < 10 || telDigits.length > 13) {
      return res.status(400).json({ error: 'telefone inválido' });
    }

    const parseCurrency = (val) => {
      if (!val) return null;
      const num = String(val).replace(/\./g, '').replace(',', '.');
      const n = parseFloat(num);
      if (!Number.isFinite(n) || n < 0 || n > 1e10) return null;
      return n;
    };

    const cleanValor = parseCurrency(valor);
    const cleanRenda = parseCurrency(renda);
    const cleanCidade = str(cidade, 120);
    const rawEstado = str(estado, 2);
    const cleanEstado = rawEstado && /^[A-Za-z]{2}$/.test(rawEstado) ? rawEstado.toUpperCase() : null;

    const checkRes = await pool.query(
      `INSERT INTO quiz_leads (
        objetivo, tipo_bem_desejado, valor_desejado, renda_familiar, faixa_idade, nome, email, telefone_whatsapp, cidade, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [objetivo, tipoBem, cleanValor, cleanRenda, idade, cleanNome, cleanEmail, telDigits, cleanCidade, cleanEstado]
    );

    const leadId = checkRes.rows[0].id;
    res.status(201).json({ success: true, id: leadId });

    sendLeadToCapi(
      { id: leadId, nome: cleanNome, email: cleanEmail, telefone: telDigits, cidade: cleanCidade, estado: cleanEstado },
      req
    );
  } catch (err) {
    console.error('Error saving lead:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(
  express.static(distDir, {
    maxAge: '1y',
    immutable: true,
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

app.get('/healthz', (_req, res) => res.status(200).send('ok'));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AA Corretora landing rodando em http://0.0.0.0:${PORT}`);
});
