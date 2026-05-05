export const WHATSAPP_NUMBER = '5551996583583';

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
  if (data.nome) lines.push(`Meu nome é ${data.nome}.`);
  lines.push('');
  lines.push('Podem me ajudar a montar o melhor plano?');
  return lines.join('\n');
}

export function openWhatsapp(data) {
  const text = encodeURIComponent(buildWhatsappText(data));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, '_blank', 'noopener');
}
