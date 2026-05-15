import express from 'express';
import compression from 'compression';
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
app.set('trust proxy', true);
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

  console.log('[geo] xff=%j reqIp=%j clientIp=%j', xff, req.ip, clientIp);

  if (!clientIp || clientIp === '::1' || clientIp.startsWith('127.')) {
    console.log('[geo] local IP, skipping lookup');
    return res.json({ city: null, state: null });
  }

  for (const fn of [lookupIpapi, lookupIpwhois]) {
    try {
      const out = await fn(clientIp);
      console.log('[geo] %s ok: country=%s city=%s state=%s', out.provider, out.country, out.city, out.state);
      if (out.country !== 'BR') {
        return res.json({ city: null, state: null });
      }
      return res.json({ city: out.city, state: out.state });
    } catch (err) {
      console.warn('[geo] provider failed:', err.message);
    }
  }

  console.error('[geo] all providers failed for ip=%s', clientIp);
  res.json({ city: null, state: null });
});

app.post('/api/leads', async (req, res) => {
  try {
    const { objetivo, tipoImovel, tipoVeiculo, valor, renda, idade, nome, email, telefone, cidade, estado } = req.body;

    // Clean currency string to decimal (e.g., "200.000" -> 200000.00)
    const parseCurrency = (val) => {
      if (!val) return null;
      const num = String(val).replace(/\./g, '').replace(',', '.');
      return parseFloat(num) || 0;
    };

    const bem = objetivo === 'imovel' ? tipoImovel : tipoVeiculo;
    const cleanValor = parseCurrency(valor);
    const cleanRenda = parseCurrency(renda);
    const cleanCidade = cidade ? String(cidade).trim().slice(0, 120) || null : null;
    const cleanEstado = estado ? String(estado).trim().toUpperCase().slice(0, 2) || null : null;

    const checkRes = await pool.query(
      `INSERT INTO quiz_leads (
        objetivo, tipo_bem_desejado, valor_desejado, renda_familiar, faixa_idade, nome, email, telefone_whatsapp, cidade, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [objetivo, bem, cleanValor, cleanRenda, idade, nome, email, telefone, cleanCidade, cleanEstado]
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
