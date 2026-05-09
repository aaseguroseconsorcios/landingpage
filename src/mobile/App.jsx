import { useState, useEffect } from 'react';
import { openWhatsapp } from '../shared/whatsapp.js';
import './styles.css';

const Icon = {
  Home: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9.5a.5.5 0 0 0 .5.5H10v-6h4v6h4.5a.5.5 0 0 0 .5-.5V10" /></svg>
  ),
  Car: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 17h14M4 13l1.5-4.5A2 2 0 0 1 7.4 7h9.2a2 2 0 0 1 1.9 1.5L20 13" /><path d="M3 17v3M21 17v3M4 13h16v4H4z" /><circle cx="7.5" cy="17" r="1.5" /><circle cx="16.5" cy="17" r="1.5" /></svg>
  ),
  Truck: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 17V7h11v10" /><path d="M14 10h4l3 4v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>
  ),
  Arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
  ),
  ArrowDown: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></svg>
  ),
  Wpp: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M19.05 4.91A10 10 0 0 0 4.05 18.3L3 22l3.79-1A10 10 0 0 0 22 12a9.93 9.93 0 0 0-2.95-7.09zm-7.04 15.36a8.27 8.27 0 0 1-4.21-1.15l-.3-.18-2.43.65.65-2.36-.2-.31a8.3 8.3 0 1 1 6.49 3.35zm4.55-6.18c-.25-.13-1.47-.73-1.7-.81s-.39-.13-.56.12-.65.81-.79.97-.29.19-.54.06a6.78 6.78 0 0 1-2-1.23 7.5 7.5 0 0 1-1.38-1.72c-.14-.25 0-.39.11-.51s.25-.29.37-.43a1.7 1.7 0 0 0 .25-.41.45.45 0 0 0 0-.43c-.06-.13-.56-1.34-.76-1.83s-.4-.41-.56-.42h-.47a.91.91 0 0 0-.66.31 2.77 2.77 0 0 0-.86 2.06A4.79 4.79 0 0 0 8.1 13a11 11 0 0 0 4.22 3.74 14.43 14.43 0 0 0 1.41.52 3.39 3.39 0 0 0 1.55.1 2.55 2.55 0 0 0 1.67-1.18 2.07 2.07 0 0 0 .14-1.18c-.06-.11-.23-.18-.48-.31z" /></svg>
  ),
  Phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  ),
  Pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
  ),
  AALogo: (p) => (
    <svg viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
      <g fill="currentColor" fillRule="evenodd">
        <path d="M28 6 L18 6 L4 50 L11 50 L14.2 39 L26.5 39 L28.4 50 L35.5 50 L28 6 Z M16 33 L24.8 33 L21 12 Z" />
        <path d="M58 6 L48 6 L34 50 L41 50 L44.2 39 L56.5 39 L58.4 50 L65.5 50 L58 6 Z M46 33 L54.8 33 L51 12 Z" />
      </g>
    </svg>
  ),
};

function Dots({ count, active, onJump }) {
  return (
    <div className="dots" role="navigation" aria-label="Seções">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className={`dot ${i === active ? 'active' : ''}`}
          onClick={() => onJump(i)}
          aria-label={`Seção ${i + 1}`}
        />
      ))}
    </div>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <a className="logo" href="#">
        <span className="logo-mark"><Icon.AALogo width="22" height="16" /></span>
        <span>AA<span style={{ opacity: 0.55, marginLeft: 6, fontWeight: 500, letterSpacing: '0.06em' }}>CORRETORA</span></span>
      </a>
      <button className="menu-btn" aria-label="Menu">
        <span></span>
      </button>
    </header>
  );
}

function HeroSection({ onCta, onScroll }) {
  return (
    <section className="section s-hero" data-screen-label="01 Hero">
      <div className="hero-bg" />
      <div className="hero-grain" />
      <div className="section-inner">
        <div className="hero-logo">
          <img src="/assets/logo.png" alt="AA Corretora" />
        </div>
        <span className="hero-tag"><span className="pulse"></span>Atendimento personalizado</span>
        <h1 className="hero-title">
          Realize seus sonhos <em>sem juros.</em>
        </h1>
        <div className="hero-photo">
          <img src="/assets/hero.jpeg" alt="Especialista AA Corretora" />
          <div className="hero-photo-tag">
            <div className="av"><img src="/assets/logo.png" alt="" /></div>
            <div>
              <div className="nm">Atendimento dedicado</div>
              <div className="rl"></div>
            </div>
          </div>
        </div>
        <div className="hero-cta-row">
          <button className="btn btn-red btn-block" onClick={onCta}>
            Simular meu consórcio <Icon.Arrow width="18" height="18" />
          </button>
          <div className="hero-meta">
            <span>★ 9.5/10 Reclame Aqui</span>
            <span className="hero-meta-divider"></span>
            <span>+12 anos de mercado</span>
          </div>
        </div>
      </div>
      <div className="hero-scroll-cue" onClick={onScroll}>
        <span>arraste</span>
        <span className="line"></span>
      </div>
    </section>
  );
}

function ProductsSection({ onPick }) {
  const items = [
    { id: 'imovel', num: '01', title: 'Imóveis', meta: 'Casa, apartamento, terreno ou construção.', icon: <Icon.Home width="20" height="20" />, cls: 'product-imovel' },
    { id: 'veiculo', num: '02', title: 'Veículos', meta: 'Carros 0km ou seminovos. Sem entrada.', icon: <Icon.Car width="20" height="20" />, cls: 'product-veiculo' },
    { id: 'pesados', num: '03', title: 'Pesados & Serviços', meta: 'Caminhões, máquinas, motos e reformas.', icon: <Icon.Truck width="20" height="20" />, cls: 'product-pesados' },
  ];

  return (
    <section className="section s-products" data-screen-label="02 Produtos">
      <div className="hero-bg" />
      <div className="section-inner">
        <span className="eyebrow">O que você quer conquistar</span>
        <h2 className="h-title">Escolha sua <em>carta de crédito.</em></h2>
        <div className="product-stack">
          {items.map((it) => (
            <div key={it.id} className={`product-card ${it.cls}`} onClick={() => onPick(it.id)}>
              <div className="product-row">
                <span className="product-num">{it.num}</span>
                <div className="product-icon">{it.icon}</div>
              </div>
              <div>
                <div className="product-title">{it.title}</div>
                <div className="product-meta">{it.meta}</div>
                <div className="product-cta">Ver planos <Icon.Arrow width="14" height="14" /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuizForm({ compact = false }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    objetivo: '', tipoImovel: '', tipoVeiculo: '',
    valor: '', renda: '', idade: '',
    nome: '', email: '', telefone: '',
  });

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const stepLabel = step === 1 ? 'Seu objetivo' : step === 2 ? 'Seus planos' : 'Seus dados';

  const canNext1 = data.objetivo && (data.objetivo === 'imovel' ? data.tipoImovel : data.tipoVeiculo);
  const canNext2 = data.valor && data.renda && data.idade;
  const canNext3 = data.nome && data.email && data.telefone;

  const next = async () => {
    if (step === 3) {
      setIsSubmitting(true);
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
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
    if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  };

  if (done) {
    return (
      <div className="quiz-success">
        <div className="quiz-success-icon">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
        </div>
        <h3>Pronto, {data.nome.split(' ')[0] || 'você'}!</h3>
        <p>Te encaminhamos pro WhatsApp com sua simulação. Caso a janela não tenha aberto, toque no botão abaixo.</p>
        <button className="quiz-next" style={{ flex: 'none', width: 'auto', alignSelf: 'center', padding: '13px 22px' }} onClick={() => openWhatsapp(data)}>
          <Icon.Wpp width="16" height="16" /> Abrir WhatsApp
        </button>
        <button
          className="quiz-back"
          style={{ alignSelf: 'center', marginTop: 8 }}
          onClick={() => { setDone(false); setStep(1); setData({ objetivo: '', tipoImovel: '', tipoVeiculo: '', valor: '', renda: '', idade: '', nome: '', email: '', telefone: '' }); }}
        >
          Refazer simulação
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="quiz-head">
        <div className="quiz-title">O primeiro passo para sua conquista começa aqui</div>
        {!compact && <div className="quiz-sub">Vamos montar juntos a melhor estratégia</div>}
        <div className="quiz-steps">
          <div className={`qs-dot ${step > 1 ? 'done' : step === 1 ? 'active' : ''}`}>{step > 1 ? '✓' : '1'}</div>
          <div className={`qs-bar ${step > 1 ? 'done' : ''}`}></div>
          <div className={`qs-dot ${step > 2 ? 'done' : step === 2 ? 'active' : ''}`}>{step > 2 ? '✓' : '2'}</div>
          <div className={`qs-bar ${step > 2 ? 'done' : ''}`}></div>
          <div className={`qs-dot ${step === 3 ? 'active' : ''}`}>3</div>
        </div>
        <div className="quiz-step-label">Passo {step} de 3 — <b>{stepLabel}</b></div>
      </div>

      <div className="quiz-body">
        {step === 1 && (
          <>
            <div className="quiz-q">O que você deseja conquistar?<span className="req">*</span></div>
            <div className="quiz-opts">
              <button className={`quiz-opt ${data.objetivo === 'imovel' ? 'selected' : ''}`} onClick={() => set('objetivo', 'imovel')}>
                <Icon.Home width="18" height="18" /> IMÓVEL
              </button>
              <button className={`quiz-opt ${data.objetivo === 'veiculo' ? 'selected' : ''}`} onClick={() => set('objetivo', 'veiculo')}>
                <Icon.Car width="18" height="18" /> VEÍCULO
              </button>
            </div>
            {data.objetivo === 'imovel' && (
              <>
                <div className="quiz-q">Que tipo de imóvel?<span className="req">*</span></div>
                <select className="quiz-select" value={data.tipoImovel} onChange={(e) => set('tipoImovel', e.target.value)}>
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
                <select className="quiz-select" value={data.tipoVeiculo} onChange={(e) => set('tipoVeiculo', e.target.value)}>
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
                value={data.valor} onChange={(e) => set('valor', formatMoney(e.target.value))} />
            </div>

            <div className="quiz-q">Qual a sua renda familiar aproximada?<span className="req">*</span></div>
            <div className="quiz-input-wrap">
              <span className="quiz-input-prefix">R$</span>
              <input className="quiz-input with-prefix" inputMode="numeric" placeholder="10.000"
                value={data.renda} onChange={(e) => set('renda', formatMoney(e.target.value))} />
            </div>

            <div className="quiz-q">Qual a sua faixa de idade?<span className="req">*</span></div>
            <select className="quiz-select" value={data.idade} onChange={(e) => set('idade', e.target.value)}>
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
              value={data.nome} onChange={(e) => set('nome', e.target.value)} />

            <div className="quiz-q">Qual o seu melhor e-mail?<span className="req">*</span></div>
            <input className="quiz-input" type="email" placeholder="seu@email.com"
              value={data.email} onChange={(e) => set('email', e.target.value)} />

            <div className="quiz-q">Qual o melhor WhatsApp?<span className="req">*</span></div>
            <div className="quiz-pair">
              <select className="quiz-select"><option>🇧🇷 +55</option></select>
              <input className="quiz-input" inputMode="tel" placeholder="(11) 99999-9999"
                value={data.telefone} onChange={(e) => set('telefone', formatPhone(e.target.value))} />
            </div>
            <div className="quiz-help">Só pelo WhatsApp — sem ligações surpresa.</div>
          </>
        )}
      </div>

      <div className="quiz-foot">
        {step > 1 && <button className="quiz-back" onClick={back}>Voltar</button>}
        <button
          className="quiz-next"
          disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2) || (step === 3 && !canNext3) || isSubmitting}
          onClick={next}
        >
          {step === 3 ? (isSubmitting ? 'Enviando...' : 'Quero simular agora') : 'Continuar'} <Icon.Arrow width="16" height="16" />
        </button>
      </div>
    </>
  );
}

function QuizSection() {
  return (
    <section className="section s-sim" data-screen-label="03 Quiz">
      <div className="section-inner">
        <span className="eyebrow">Comece agora</span>
        <h2 className="h-title">Seu plano em <em>3 passos.</em></h2>
        <div className="quiz-card">
          <QuizForm />
        </div>
      </div>
    </section>
  );
}

function QuizModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="quiz-modal-backdrop" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quiz-modal-close" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div className="quiz-modal-card">
          <QuizForm compact />
        </div>
      </div>
    </div>
  );
}

function VantagensSection() {
  const items = [
    { num: '02', title: 'Sem entrada', desc: 'Comece pagando só a primeira parcela.' },
    { num: '03', title: 'Use o FGTS', desc: 'Para lance, complemento ou abater parcelas.' },
    { num: '04', title: 'Carta na mão', desc: 'Negocie como pagamento à vista.' },
    { num: '05', title: 'Parcela flexível', desc: 'Ajuste prazos e valores ao seu plano.' },
  ];

  return (
    <section className="section s-vant" data-screen-label="04 Vantagens">
      <div className="hero-bg" />
      <div className="section-inner">
        <span className="eyebrow">Por que AA Corretora</span>
        <h2 className="h-title">Vantagens que <em>fazem a diferença.</em></h2>
        <div className="vant-grid">
          <div className="vant feature">
            <span className="vant-num">— 01</span>
            <div>
              <div className="vant-title">Sem juros<br />de verdade.</div>
              <div className="vant-desc">A diferença entre consórcio e financiamento pode chegar a 60% no valor final pago.</div>
            </div>
          </div>
          {items.map((it) => (
            <div className="vant" key={it.num}>
              <span className="vant-num">— {it.num}</span>
              <div>
                <div className="vant-title">{it.title}</div>
                <div className="vant-desc">{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompareSection() {
  return (
    <section className="section s-compare" data-screen-label="05 Comparativo">
      <div className="section-inner">
        <span className="eyebrow">Quem faz conta, faz consórcio</span>
        <h2 className="h-title">Veja a <em>diferença.</em></h2>

        <div className="compare-amount">
          <div>
            <div className="compare-amount-label">Valor do imóvel</div>
            <div className="compare-amount-val">R$ 500 mil</div>
          </div>
          <div className="compare-house"><Icon.Home width="18" height="18" /></div>
        </div>

        <div className="compare-stack">
          <div className="cmp-card cmp-fin">
            <div className="cmp-head">Financiamento<br />com juros</div>
            <div className="cmp-row"><span className="cmp-k">Prazo</span><span className="cmp-v">420×</span></div>
            <div className="cmp-row"><span className="cmp-k">Entrada</span><span className="cmp-v">R$ 100mil</span></div>
            <div className="cmp-row"><span className="cmp-k">Parcela</span><span className="cmp-v">R$ 4.594</span></div>
            <div className="cmp-row"><span className="cmp-k">Juros</span><span className="cmp-v">420%</span></div>
            <div className="cmp-final">
              <span>CUSTO FINAL</span>
              <span className="cmp-final-val">R$ 1.256.171</span>
            </div>
          </div>

          <div className="cmp-card cmp-cons">
            <div className="cmp-head">Consórcio<br />sem juros</div>
            <div className="cmp-row"><span className="cmp-k">Prazo</span><span className="cmp-v">200×</span></div>
            <div className="cmp-row"><span className="cmp-k">Entrada</span><span className="cmp-v">Sem entrada</span></div>
            <div className="cmp-row"><span className="cmp-k">Parcela</span><span className="cmp-v">R$ 1.691</span></div>
            <div className="cmp-row"><span className="cmp-k">Juros</span><span className="cmp-v">0%</span></div>
            <div className="cmp-final">
              <span>CUSTO FINAL</span>
              <span className="cmp-final-val">R$ 615.000</span>
            </div>
          </div>
        </div>

        <div className="compare-savings">
          <span className="compare-savings-label">Com consórcio você economiza</span>
          <span className="compare-savings-val">R$ 641 mil</span>
        </div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  const steps = [
    { n: '01', t: 'Simule seu plano', d: 'Defina o valor da carta e o prazo ideal.' },
    { n: '02', t: 'Adesão ao grupo', d: 'Você entra em um grupo e começa a pagar parcelas mensais sem juros.' },
    { n: '03', t: 'Contemplação', d: 'Por sorteio mensal ou lance, você é contemplado e recebe a carta.' },
    { n: '04', t: 'Realize seu sonho', d: 'Use a carta como pagamento à vista e negocie descontos.' },
  ];

  return (
    <section className="section s-how" data-screen-label="06 Como Funciona">
      <div className="hero-bg" />
      <div className="section-inner">
        <span className="eyebrow">Como funciona</span>
        <h2 className="h-title"><em>4 passos</em><br />até a chave na mão.</h2>
        <div className="step-list">
          {steps.map((s) => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-body">
                <div className="step-title">{s.t}</div>
                <div className="step-desc">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DepoimentosSection() {
  const items = [
    { photo: '/assets/historia-2.jpeg', tag: '🏆 Campanha de Agosto', title: 'Primeira cliente premiada', q: '"Decidir com planejamento muda o jogo. Essa cliente iniciou o consórcio com a gente para trocar de moto — de forma organizada e sem juros. É sobre dar o próximo passo com segurança."' },
    { photo: '/assets/historia-1.jpeg', tag: '🚀 Mais um sonho', title: 'Parabéns pelo planejamento!', q: '"Começar cedo faz toda a diferença. Esse cliente confiou na nossa corretora e iniciou o consórcio para planejar a construção da casa dele. É sobre visão de futuro e decisões bem feitas hoje."' },
    { photo: '/assets/historia-3.jpeg', tag: '🎁 Carta contemplada', title: 'Entrega da carta de crédito', q: '"Quando a pessoa decide se planejar de verdade, as coisas acontecem. Esse cliente entrou no consórcio para comprar o veículo com estratégia — e foi contemplado na primeira parcela. Consórcio é planejamento. E, às vezes, também surpreende."' },
  ];

  const [i, setI] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const dist = touchStart - touchEnd;
    if (dist > 50) setI((prev) => (prev + 1) % items.length);
    if (dist < -50) setI((prev) => (prev - 1 + items.length) % items.length);
  };

  const cur = items[i];
  return (
    <section className="section s-test" data-screen-label="07 Depoimentos">
      <div className="section-inner">
        <span className="eyebrow">Quem já realizou</span>
        <h2 className="h-title">Histórias que <em>inspiram.</em></h2>
        <div className="test-photo-card" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <img src={cur.photo} alt={cur.title} className="test-photo" loading="lazy" width="80" height="80" />
          <div className="test-photo-overlay">
            <span className="test-photo-tag">{cur.tag}</span>
            <div className="test-photo-title">{cur.title}</div>
            <div className="test-photo-quote">{cur.q}</div>
          </div>
        </div>
        <div className="test-nav">
          <div className="test-pips">
            {items.map((_, j) => (
              <button key={j} className={`test-pip ${i === j ? 'active' : ''}`} onClick={() => setI(j)} aria-label={`História ${j + 1}`} />
            ))}
          </div>
          <button className="test-arrow" onClick={() => setI((i + 1) % items.length)} aria-label="Próximo">
            <Icon.Arrow width="16" height="16" />
          </button>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState(0);
  const items = [
    { q: 'Consórcio cobra juros?', a: 'Não. Você paga apenas pelo crédito + uma taxa de administração diluída ao longo do plano. Nada de juros.' },
    { q: 'Posso usar o FGTS?', a: 'Sim. Você pode usar até 100% do FGTS para dar lance, complementar a carta ou abater parcelas, conforme as regras da Caixa.' },
    { q: 'Como funciona a contemplação?', a: 'Acontece nas assembleias mensais por sorteio (via Loteria Federal) ou lance — quem oferta o maior percentual leva.' },
    { q: 'Posso transferir minha cota?', a: 'Sim. A Lei do Consórcio (11.795/2008) permite a transferência da cota antes ou após a contemplação.' },
    { q: 'Preciso dar entrada?', a: 'Não. Você começa pagando a primeira parcela — sem qualquer entrada.' },
  ];

  return (
    <section className="section s-faq" data-screen-label="08 FAQ">
      <div className="hero-bg" />
      <div className="section-inner">
        <span className="eyebrow">Perguntas frequentes</span>
        <h2 className="h-title">Tire suas <em>dúvidas.</em></h2>
        <div className="faq-list">
          {items.map((it, idx) => (
            <div key={idx} className={`faq-item ${open === idx ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === idx ? -1 : idx)}>{it.q}</button>
              <div className="faq-a">{it.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ onQuiz }) {
  return (
    <section className="section s-cta" data-screen-label="09 Contato">
      <div className="cta-photo">
        <img src="/assets/conversa.jpeg" alt="Atendimento AA Corretora" loading="lazy" width="400" height="400" style={{objectFit: 'cover'}} />
      </div>
      <div className="section-inner">
        <div className="cta-top-spacer">
          <span className="eyebrow">Pronto pra começar?</span>
          <h2 className="h-title">Vamos conversar<br /><em>sobre seu sonho.</em></h2>
        </div>
        <div className="cta-video">
          <iframe
            src="https://www.youtube-nocookie.com/embed/2uV2NAtldq8?rel=0&modestbranding=1&playsinline=1"
            title="AA Corretora — Conheça"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy">
          </iframe>
        </div>
        <div className="cta-content">
          <p className="cta-sub">Atendimento humano, sem robôs. Resposta no mesmo dia útil.</p>

          <div className="cta-actions">
            <button className="btn btn-red btn-block" onClick={onQuiz}>
              <Icon.Wpp width="18" height="18" /> Falar no WhatsApp
            </button>
            <button className="btn btn-ghost btn-block" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              <Icon.Phone width="16" height="16" /> Receber uma ligação
            </button>
          </div>

          <div className="cta-foot">
            <div className="cta-foot-row">
              <span className="cta-foot-label">Telefone</span>
              <span className="cta-foot-val">(51) 99658-3583 </span>
            </div>
            <div className="cta-foot-row">
              <span className="cta-foot-label">Endereço</span>
              <span className="cta-foot-val" style={{ textAlign: 'right' }}>Santo Antônio da Patrulha, RS</span>
            </div>
            <div className="cta-foot-row">
              <span className="cta-foot-label">Horário</span>
              <span className="cta-foot-val">Seg–Sex · 9h às 18h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const TWEAKS = { accent: 'crimson', heroVariant: 'default', showFab: true, showDots: false };

const ACCENTS = {
  red: { red: '#E10600', deep: '#B30500', glow: '#FF2A1F' },
  crimson: { red: '#C8102E', deep: '#8C0B20', glow: '#E62541' },
  ferrari: { red: '#FF2800', deep: '#CC2000', glow: '#FF4D2B' },
};

export default function MobileApp() {
  const [active, setActive] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const sectionsCount = 9;

  useEffect(() => {
    const root = document.documentElement;
    const a = ACCENTS[TWEAKS.accent] || ACCENTS.red;
    root.style.setProperty('--red', a.red);
    root.style.setProperty('--red-deep', a.deep);
    root.style.setProperty('--red-glow', a.glow);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const idx = Math.round(window.scrollY / window.innerHeight);
      setActive(Math.max(0, Math.min(sectionsCount - 1, idx)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jumpTo = (i) => {
    window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' });
  };

  return (
    <>
      {TWEAKS.showDots && <Dots count={sectionsCount} active={active} onJump={jumpTo} />}
      <HeroSection onCta={() => jumpTo(2)} onScroll={() => jumpTo(1)} />
      <ProductsSection onPick={() => jumpTo(2)} />
      <QuizSection />
      <VantagensSection />
      <CompareSection />
      <ComoFunciona />
      <DepoimentosSection />
      <FaqSection />
      <CtaSection onQuiz={() => setQuizOpen(true)} />
      {TWEAKS.showFab && (
        <button className="fab" aria-label="Iniciar simulação" onClick={() => setQuizOpen(true)}>
          <Icon.Wpp width="26" height="26" />
        </button>
      )}
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />
    </>
  );
}
