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
app.use(compression());
app.use(express.json());

app.post('/api/leads', async (req, res) => {
  try {
    const { objetivo, tipoImovel, tipoVeiculo, valor, renda, idade, nome, email, telefone } = req.body;
    
    // Clean currency string to decimal (e.g., "200.000" -> 200000.00)
    const parseCurrency = (val) => {
      if (!val) return null;
      const num = String(val).replace(/\./g, '').replace(',', '.');
      return parseFloat(num) || 0;
    };

    const bem = objetivo === 'imovel' ? tipoImovel : tipoVeiculo;
    const cleanValor = parseCurrency(valor);
    const cleanRenda = parseCurrency(renda);

    const checkRes = await pool.query(
      `INSERT INTO quiz_leads (
        objetivo, tipo_bem_desejado, valor_desejado, renda_familiar, faixa_idade, nome, email, telefone_whatsapp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [objetivo, bem, cleanValor, cleanRenda, idade, nome, email, telefone]
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
