export const WHATSAPP_NUMBER = '5551996583583';

function formatLocation(data) {
  const cidade = (data.cidade || '').trim();
  const estado = (data.estado || '').trim().toUpperCase();
  if (!cidade) return '';
  if (estado && !cidade.includes(' - ')) return `${cidade} - ${estado}`;
  return cidade;
}

export function buildWhatsappText(data) {
  const tipo = data.objetivo === 'imovel' ? data.tipoImovel : data.tipoVeiculo;
  const categoria = data.objetivo === 'imovel' ? 'Imóvel' : 'Veículo';
  const lines = [
    'Olá! Acabei de fazer uma simulação no site da AA Corretora.',
    '',
    `Quero conquistar: ${tipo} (${categoria})`,
    `Valor desejado: R$ ${data.valor}`,
  ];
  if (data.idade) lines.push(`Faixa etária: ${data.idade}`);

  const local = formatLocation(data);
  if (data.nome && local) {
    lines.push(`Meu nome é ${data.nome} e sou de ${local}.`);
  } else if (data.nome) {
    lines.push(`Meu nome é ${data.nome}.`);
  } else if (local) {
    lines.push(`Sou de ${local}.`);
  }

  lines.push('');
  lines.push('Podem me ajudar a montar o melhor plano?');
  return lines.join('\n');
}

export function openWhatsapp(data) {
  const text = encodeURIComponent(buildWhatsappText(data));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, '_blank', 'noopener');
}
