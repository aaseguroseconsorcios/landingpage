import { useState, useEffect } from 'react';
import { Icon } from './Icons.jsx';
import { openWhatsapp } from '../shared/whatsapp.js';
import { CityAutocomplete, loadCities, loadGeo } from '../shared/CityAutocomplete.jsx';

export function QuizForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoSuggestion, setGeoSuggestion] = useState(null);
  const [data, setData] = useState({
    objetivo: '', tipoImovel: '', tipoVeiculo: '',
    valor: '', renda: '', idade: '',
    nome: '', email: '', telefone: '',
    cidade: '', estado: '',
  });
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const stepLabel = step === 1 ? 'Seu objetivo' : step === 2 ? 'Seus planos' : 'Seus dados';
  const canNext1 = data.objetivo && (data.objetivo === 'imovel' ? data.tipoImovel : data.tipoVeiculo);
  const canNext2 = data.valor && data.renda && data.idade;
  const canNext3 = data.nome && data.email && data.telefone && data.cidade;

  useEffect(() => {
    let alive = true;
    loadGeo().then((g) => { if (alive && g) setGeoSuggestion(g); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (step === 2) loadCities();
  }, [step]);

  const next = async () => {
    if (step === 3) {
      setIsSubmitting(true);
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', { content_name: 'Quiz consórcio' });
        }
      } catch (err) {
        console.error('Falha ao salvar lead', err);
      } finally {
        setIsSubmitting(false);
      }
      openWhatsapp(data);
      setDone(true);
      return;
    }
    setStep(step + 1);
  };
  const back = () => setStep(Math.max(1, step - 1));

  const formatMoney = (v) => {
    const n = String(v).replace(/\D/g, '');
    if (!n) return '';
    return Number(n).toLocaleString('pt-BR');
  };
  const formatPhone = (v) => {
    const n = String(v).replace(/\D/g, '').slice(0, 11);
    if (n.length <= 2) return n;
    if (n.length <= 7) return `(${n.slice(0,2)}) ${n.slice(2)}`;
    return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
  };

  if (done) {
    return (
      <div className="quiz-success">
        <div className="quiz-success-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
        </div>
        <h3>Pronto, {data.nome.split(' ')[0] || 'você'}!</h3>
        <p>Te encaminhamos pro WhatsApp com sua simulação. Caso a aba não tenha aberto, clique no botão abaixo.</p>
        <button className="quiz-next" style={{flex: 'none', width: 'auto', alignSelf: 'center', padding: '13px 26px'}}
          onClick={() => openWhatsapp(data)}>
          <Icon.Wpp width="16" height="16" /> Abrir WhatsApp
        </button>
        <button className="quiz-back" style={{alignSelf: 'center', marginTop: 8}}
          onClick={() => { setDone(false); setStep(1); setData({objetivo:'',tipoImovel:'',tipoVeiculo:'',valor:'',renda:'',idade:'',nome:'',email:'',telefone:'',cidade:'',estado:''}); }}>
          Refazer simulação
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="quiz-head">
        <div className="quiz-title">O primeiro passo para sua conquista começa aqui</div>
        <div className="quiz-sub">Vamos montar juntos a melhor estratégia</div>
        <div className="quiz-steps">
          <div className={`qs-dot ${step>1?'done':step===1?'active':''}`}>{step>1?'✓':'1'}</div>
          <div className={`qs-bar ${step>1?'done':''}`}></div>
          <div className={`qs-dot ${step>2?'done':step===2?'active':''}`}>{step>2?'✓':'2'}</div>
          <div className={`qs-bar ${step>2?'done':''}`}></div>
          <div className={`qs-dot ${step===3?'active':''}`}>3</div>
        </div>
        <div className="quiz-step-label">Passo {step} de 3 — <b>{stepLabel}</b></div>
      </div>

      <div className="quiz-body">
        {step === 1 && (
          <>
            <div className="quiz-q">O que você deseja conquistar?<span className="req">*</span></div>
            <div className="quiz-opts">
              <button className={`quiz-opt ${data.objetivo==='imovel'?'selected':''}`} onClick={()=>set('objetivo','imovel')}>
                <Icon.Home width="18" height="18"/> IMÓVEL
              </button>
              <button className={`quiz-opt ${data.objetivo==='veiculo'?'selected':''}`} onClick={()=>set('objetivo','veiculo')}>
                <Icon.Car width="18" height="18"/> VEÍCULO
              </button>
            </div>
            {data.objetivo === 'imovel' && (
              <>
                <div className="quiz-q">Que tipo de imóvel?<span className="req">*</span></div>
                <select className="quiz-select" value={data.tipoImovel} onChange={(e)=>set('tipoImovel', e.target.value)}>
                  <option value="">Selecione uma opção</option>
                  <option>Casa / Apartamento</option>
                  <option>Terreno / Construção</option>
                  <option>Imóvel comercial</option>
                  <option>Investimento</option>
                </select>
              </>
            )}
            {data.objetivo === 'veiculo' && (
              <>
                <div className="quiz-q">Que tipo de veículo?<span className="req">*</span></div>
                <select className="quiz-select" value={data.tipoVeiculo} onChange={(e)=>set('tipoVeiculo', e.target.value)}>
                  <option value="">Selecione uma opção</option>
                  <option>Carro 0km</option>
                  <option>Carro seminovo</option>
                  <option>Moto</option>
                  <option>Pesado / Utilitário</option>
                </select>
              </>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className="quiz-q">Qual valor você deseja para essa conquista?<span className="req">*</span></div>
            <div className="quiz-input-wrap">
              <span className="quiz-input-prefix">R$</span>
              <input className="quiz-input with-prefix" inputMode="numeric" placeholder="200.000"
                value={data.valor} onChange={(e)=>set('valor', formatMoney(e.target.value))}/>
            </div>

            <div className="quiz-q">Qual a sua renda familiar aproximada?<span className="req">*</span></div>
            <div className="quiz-input-wrap">
              <span className="quiz-input-prefix">R$</span>
              <input className="quiz-input with-prefix" inputMode="numeric" placeholder="10.000"
                value={data.renda} onChange={(e)=>set('renda', formatMoney(e.target.value))}/>
            </div>

            <div className="quiz-q">Qual a sua faixa de idade?<span className="req">*</span></div>
            <select className="quiz-select" value={data.idade} onChange={(e)=>set('idade', e.target.value)}>
              <option value="">Selecione sua faixa</option>
              <option>18 – 25 anos</option>
              <option>26 – 35 anos</option>
              <option>36 – 45 anos</option>
              <option>46 – 55 anos</option>
              <option>56+ anos</option>
            </select>
          </>
        )}

        {step === 3 && (
          <>
            <div className="quiz-q">Como posso te chamar?<span className="req">*</span></div>
            <input className="quiz-input" placeholder="Seu nome completo"
              value={data.nome} onChange={(e)=>set('nome', e.target.value)}/>

            <div className="quiz-q">Qual o seu melhor e-mail?<span className="req">*</span></div>
            <input className="quiz-input" type="email" placeholder="seu@email.com"
              value={data.email} onChange={(e)=>set('email', e.target.value)}/>

            <div className="quiz-q">Em qual cidade você mora?<span className="req">*</span></div>
            <CityAutocomplete
              id="quiz-cidade-desktop"
              value={data.cidade}
              suggestion={geoSuggestion}
              placeholder="Digite ou selecione sua cidade"
              onChange={(text) => setData((d) => ({ ...d, cidade: text, estado: '' }))}
              onPick={(c) => setData((d) => ({ ...d, cidade: c ? `${c.nome} - ${c.uf}` : d.cidade, estado: c?.uf || '' }))}
            />

            <div className="quiz-q">Qual o melhor WhatsApp?<span className="req">*</span></div>
            <div className="quiz-pair">
              <select className="quiz-select"><option>🇧🇷 +55</option></select>
              <input className="quiz-input" inputMode="tel" placeholder="(11) 99999-9999"
                value={data.telefone} onChange={(e)=>set('telefone', formatPhone(e.target.value))}/>
            </div>
            <div className="quiz-help">Só pelo WhatsApp — sem ligações surpresa.</div>
          </>
        )}
      </div>

      <div className="quiz-foot">
        {step > 1 && <button className="quiz-back" onClick={back}>Voltar</button>}
        <button
          className="quiz-next"
          disabled={(step===1 && !canNext1) || (step===2 && !canNext2) || (step===3 && !canNext3) || isSubmitting}
          onClick={next}
        >
          {step === 3 ? (isSubmitting ? 'Enviando...' : 'Quero simular agora') : 'Continuar'} <Icon.Arrow width="16" height="16"/>
        </button>
      </div>
    </>
  );
}
