import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
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

    res.status(201).json({ success: true, id: checkRes.rows[0].id });
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
