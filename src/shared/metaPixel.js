const PIXEL_ID = '3065919830274786';

function normalize(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('55') && digits.length >= 12) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

function splitName(full) {
  const parts = normalize(full).replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { fn: null, ln: null };
  if (parts.length === 1) return { fn: parts[0], ln: null };
  return { fn: parts[0], ln: parts.slice(1).join(' ') };
}

function extractCity(cidadeRaw, estadoRaw) {
  const raw = String(cidadeRaw || '');
  const noUf = raw.includes(' - ') ? raw.split(' - ')[0] : raw;
  const ct = normalize(noUf).replace(/\s+/g, '');
  return ct || null;
}

function normalizeState(estadoRaw, cidadeRaw) {
  let uf = String(estadoRaw || '').trim();
  if (!uf && cidadeRaw && String(cidadeRaw).includes(' - ')) {
    uf = String(cidadeRaw).split(' - ')[1] || '';
  }
  uf = uf.trim().toLowerCase();
  return /^[a-z]{2}$/.test(uf) ? uf : null;
}

export function trackLead(data, leadId) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  const { fn, ln } = splitName(data.nome);
  const userData = {
    em: data.email ? normalize(data.email) : undefined,
    ph: normalizePhone(data.telefone) || undefined,
    fn: fn || undefined,
    ln: ln || undefined,
    ct: extractCity(data.cidade, data.estado) || undefined,
    st: normalizeState(data.estado, data.cidade) || undefined,
    country: 'br',
    external_id: leadId ? String(leadId) : undefined,
  };

  Object.keys(userData).forEach((k) => userData[k] === undefined && delete userData[k]);

  try {
    window.fbq('init', PIXEL_ID, userData);
    const opts = leadId ? { eventID: String(leadId) } : undefined;
    window.fbq('track', 'Lead', { content_name: 'Quiz consórcio' }, opts);
  } catch (err) {
    console.warn('Falha ao disparar Lead no Meta Pixel', err);
  }
}
