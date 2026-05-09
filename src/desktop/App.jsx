import { useState, useEffect } from 'react';
import { Icon } from './Icons.jsx';
import { QuizForm } from './Quiz.jsx';
import './styles.css';

function Nav({ onCta }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { href: '#produtos', label: 'Produtos' },
    { href: '#simulador', label: 'Simulador' },
    { href: '#vantagens', label: 'Vantagens' },
    { href: '#como-funciona', label: 'Como funciona' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <a className="nav-logo" href="#">
          <img className="nav-logo-img" src="/assets/logo.webp" alt="AA Corretora" />
        </a>
        <div className="nav-links">
          {links.map((l) => <a key={l.href} className="nav-link" href={l.href}>{l.label}</a>)}
        </div>
        <button className="btn btn-red nav-cta" onClick={onCta}>Simular agora</button>
      </div>
    </nav>
  );
}

function Hero({ onCta }) {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="hero-tag"><span className="pulse"></span>Atendimento personalizado</span>
          <h1 className="h-display">Realize seus sonhos <em>sem juros.</em></h1>
          <p className="lead">
            Carta de crédito para imóveis, veículos e mais. Sem entrada, sem juros — só você, seu plano e o time AA Corretora ao seu lado.
          </p>
          <div className="hero-actions">
            <button className="btn btn-red" onClick={onCta}>
              Simular meu consórcio <Icon.Arrow width="18" height="18" />
            </button>
            <a href="#como-funciona" className="btn btn-ghost">Como funciona</a>
          </div>
          <div className="hero-trust">
            <div className="hero-trust-item">
              <div className="hero-trust-num">9.5</div>
              <div className="hero-trust-lbl">Reclame Aqui</div>
            </div>
            <div className="hero-trust-item">
              <div className="hero-trust-num">+12</div>
              <div className="hero-trust-lbl">anos de mercado</div>
            </div>
            <div className="hero-trust-item">
              <div className="hero-trust-num">+5k</div>
              <div className="hero-trust-lbl">famílias atendidas</div>
            </div>
          </div>
        </div>
        <div className="hero-photo">
          <img src="/assets/hero.webp" alt="Especialista AA Corretora" />
          <div className="hero-photo-tag">
            <div className="av"><img src="/assets/logo.webp" alt="" /></div>
            <div>
              <div className="nm">Atendimento dedicado</div>
              <div className="rl">Especialista AA Corretora</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Produtos({ onPick }) {
  const items = [
    { num: '01', title: 'Imóveis', icon: <Icon.Home width="24" height="24" />, meta: 'Casa, apartamento, terreno ou construção do seu jeito.', list: ['Cartas de R$ 80mil a R$ 1.5mi', 'Use o FGTS no lance', 'Prazos de até 200 meses'] },
    { num: '02', title: 'Veículos', icon: <Icon.Car width="24" height="24" />, meta: 'Carros 0km, seminovos e motos. Sem entrada.', list: ['Cartas de R$ 30mil a R$ 250mil', 'Negocie como pagamento à vista', 'Prazos de até 100 meses'] },
    { num: '03', title: 'Pesados & Serviços', icon: <Icon.Truck width="24" height="24" />, meta: 'Caminhões, máquinas, motos e reformas.', list: ['Cartas para frota e maquinário', 'Capital de giro para o seu negócio', 'Reforma e construção'] },
  ];

  return (
    <section className="section s-products" id="produtos">
      <div className="wrap">
        <div className="section-head-flex">
          <div>
            <span className="eyebrow">O que você quer conquistar</span>
            <h2 className="h-section">Escolha sua <em>carta de crédito.</em></h2>
          </div>
          <p className="lead">Três categorias, infinitas possibilidades. Monte um plano sob medida para o seu próximo grande passo.</p>
        </div>
        <div className="products-grid">
          {items.map((it) => (
            <div key={it.num} className="product-card" onClick={onPick}>
              <div className="product-num">— {it.num}</div>
              <div className="product-icon">{it.icon}</div>
              <div className="product-title">{it.title}</div>
              <div className="product-meta">{it.meta}</div>
              <div className="product-list">
                {it.list.map((l, i) => <div key={i} className="product-list-item">{l}</div>)}
              </div>
              <div className="product-cta">Ver planos <Icon.Arrow width="14" height="14" /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Simulador() {
  return (
    <section className="section s-sim" id="simulador">
      <div className="wrap sim-grid">
        <div className="sim-side">
          <span className="eyebrow">Comece agora</span>
          <h2 className="h-section">Seu plano em <em>3 passos.</em></h2>
          <p className="lead">Responda algumas perguntas rápidas e receba uma simulação personalizada direto no seu WhatsApp — sem compromisso.</p>
          <div className="sim-features">
            <div className="sim-feature">
              <div className="sim-feature-icon"><Icon.Clock width="18" height="18" /></div>
              <div>
                <div className="sim-feature-t">Leva menos de 2 minutos</div>
                <div className="sim-feature-d">3 etapas curtas, sem rolê.</div>
              </div>
            </div>
            <div className="sim-feature">
              <div className="sim-feature-icon"><Icon.Shield width="18" height="18" /></div>
              <div>
                <div className="sim-feature-t">Seus dados protegidos</div>
                <div className="sim-feature-d">Usamos só pra te enviar a proposta.</div>
              </div>
            </div>
            <div className="sim-feature">
              <div className="sim-feature-icon"><Icon.Sparkles width="18" height="18" /></div>
              <div>
                <div className="sim-feature-t">Atendimento humano</div>
                <div className="sim-feature-d">Sem robôs, sem ligação surpresa.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="sim-card">
          <QuizForm />
        </div>
      </div>
    </section>
  );
}

function Vantagens() {
  const items = [
    { num: '02', title: 'Sem entrada', desc: 'Comece pagando só a primeira parcela.' },
    { num: '03', title: 'Use o FGTS', desc: 'Para lance, complemento ou abater parcelas.' },
    { num: '04', title: 'Carta na mão', desc: 'Negocie como pagamento à vista e abra desconto.' },
    { num: '05', title: 'Parcela flexível', desc: 'Ajuste prazos e valores ao seu plano.' },
  ];

  return (
    <section className="section s-vant" id="vantagens">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Por que AA Corretora</span>
          <h2 className="h-section">Vantagens que <em>fazem a diferença.</em></h2>
        </div>
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

function Comparativo() {
  return (
    <section className="section s-compare">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Quem faz conta, faz consórcio</span>
          <h2 className="h-section">Veja a <em>diferença.</em></h2>
        </div>
        <div className="compare-amount">
          <Icon.Home className="" width="18" height="18" />
          <div>
            <div className="compare-amount-label">Valor do imóvel</div>
            <div className="compare-amount-val">R$ 500 mil</div>
          </div>
        </div>
        <div className="compare-grid">
          <div className="cmp-card cmp-fin">
            <div className="cmp-head">Financiamento<br />com juros</div>
            <div className="cmp-row"><span className="cmp-k">Prazo</span><span className="cmp-v">420×</span></div>
            <div className="cmp-row"><span className="cmp-k">Entrada</span><span className="cmp-v">R$ 100 mil</span></div>
            <div className="cmp-row"><span className="cmp-k">Parcela</span><span className="cmp-v">R$ 4.594</span></div>
            <div className="cmp-row"><span className="cmp-k">Juros</span><span className="cmp-v">420%</span></div>
            <div className="cmp-final">
              <span>Custo final</span>
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
              <span>Custo final</span>
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
    { n: '01', t: 'Simule seu plano', d: 'Defina o valor da carta e o prazo ideal pro seu bolso.' },
    { n: '02', t: 'Adesão ao grupo', d: 'Você entra em um grupo e paga parcelas mensais — sem juros.' },
    { n: '03', t: 'Contemplação', d: 'Por sorteio mensal ou lance, você é contemplado e recebe a carta.' },
    { n: '04', t: 'Realize seu sonho', d: 'Use a carta como pagamento à vista e negocie descontos.' },
  ];

  return (
    <section className="section s-how" id="como-funciona">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Como funciona</span>
          <h2 className="h-section"><em>4 passos</em> até a chave na mão.</h2>
        </div>
        <div className="steps-grid">
          {steps.map((s) => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.t}</div>
              <div className="step-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Depoimentos() {
  const items = [
    { photo: '/assets/historia-2.webp', tag: '🏆 Campanha de Agosto', title: 'Primeira cliente premiada', q: '"Decidir com planejamento muda o jogo. Essa cliente iniciou o consórcio com a gente para trocar de moto — de forma organizada e sem juros. É sobre dar o próximo passo com segurança."' },
    { photo: '/assets/historia-1.webp', tag: '🚀 Mais um sonho', title: 'Parabéns pelo planejamento!', q: '"Começar cedo faz toda a diferença. Esse cliente confiou na nossa corretora e iniciou o consórcio para planejar a construção da casa dele. É sobre visão de futuro e decisões bem feitas hoje."' },
    { photo: '/assets/historia-3.webp', tag: '🎁 Carta contemplada', title: 'Entrega da carta de crédito', q: '"Quando a pessoa decide se planejar de verdade, as coisas acontecem. Esse cliente entrou no consórcio para comprar o veículo com estratégia — e foi contemplado na primeira parcela. Consórcio é planejamento. E, às vezes, também surpreende."' },
  ];

  return (
    <section className="section s-test">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Quem já realizou</span>
          <h2 className="h-section">Histórias que <em>inspiram.</em></h2>
        </div>
        <div className="test-grid">
          {items.map((it, i) => (
            <div className="test-photo-card" key={i}>
              <img src={it.photo} alt={it.title} className="test-photo" loading="lazy" width="80" height="80" />
              <div className="test-photo-overlay">
                <span className="test-photo-tag">{it.tag}</span>
                <div className="test-photo-title">{it.title}</div>
                <div className="test-photo-quote">{it.q}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ onCta }) {
  const [open, setOpen] = useState(0);
  const items = [
    { q: 'Consórcio cobra juros?', a: 'Não. Você paga apenas pelo crédito + uma taxa de administração diluída ao longo do plano. Nada de juros.' },
    { q: 'Posso usar o FGTS?', a: 'Sim. Você pode usar até 100% do FGTS para dar lance, complementar a carta ou abater parcelas, conforme as regras da Caixa.' },
    { q: 'Como funciona a contemplação?', a: 'Acontece nas assembleias mensais por sorteio (via Loteria Federal) ou lance — quem oferta o maior percentual leva.' },
    { q: 'Posso transferir minha cota?', a: 'Sim. A Lei do Consórcio (11.795/2008) permite a transferência da cota antes ou após a contemplação.' },
    { q: 'Preciso dar entrada?', a: 'Não. Você começa pagando a primeira parcela — sem qualquer entrada.' },
    { q: 'O grupo é regulamentado?', a: 'Sim. Todos os consórcios que oferecemos são regulamentados e fiscalizados pelo Banco Central do Brasil.' },
  ];

  return (
    <section className="section s-faq" id="faq">
      <div className="wrap faq-grid">
        <div className="faq-side">
          <span className="eyebrow">Perguntas frequentes</span>
          <h2 className="h-section">Tire suas <em>dúvidas.</em></h2>
          <p className="lead">Reunimos as perguntas mais comuns. Se ainda restar alguma, fala com a gente — respondemos rápido.</p>
          <div className="faq-help">
            <div className="faq-help-t">Não achou sua resposta?</div>
            <div className="faq-help-d">Nosso time tira dúvidas no WhatsApp em horário comercial.</div>
            <button className="btn btn-red" style={{ padding: '12px 22px', fontSize: '14px' }} onClick={onCta}>
              <Icon.Wpp width="16" height="16" /> Falar com especialista
            </button>
          </div>
        </div>
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

function CtaSection({ onCta }) {
  return (
    <section className="s-cta" id="contato">
      <div className="wrap">
        <div className="cta-card">
          <div className="cta-card-content">
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.85)' }}>Pronto pra começar?</span>
            <h2 className="h-section" style={{ marginTop: '14px' }}>Vamos conversar <em>sobre seu sonho.</em></h2>
            <p className="cta-card-sub">Atendimento humano, sem robôs. Resposta no mesmo dia útil. Te ajudamos a montar o plano que cabe no seu bolso.</p>
            <div className="cta-card-actions">
              <button className="btn btn-light" onClick={onCta}>
                <Icon.Wpp width="18" height="18" /> Falar no WhatsApp
              </button>
              <a href="tel:+551297444005" className="btn btn-ghost">
                <Icon.Phone width="16" height="16" /> Receber uma ligação
              </a>
            </div>
          </div>
          <div className="cta-info">
            <div className="cta-info-row">
              <div className="cta-info-icon"><Icon.Phone width="18" height="18" /></div>
              <div>
                <div className="cta-info-lbl">Telefone</div>
                <div className="cta-info-val">(51) 99658-3583</div>
              </div>
            </div>
            <div className="cta-info-row">
              <div className="cta-info-icon"><Icon.Pin width="18" height="18" /></div>
              <div>
                <div className="cta-info-lbl">Endereço</div>
                <div className="cta-info-val">Santo Antônio da Patrulha - RS</div>
              </div>
            </div>
            <div className="cta-info-row">
              <div className="cta-info-icon"><Icon.Clock width="18" height="18" /></div>
              <div>
                <div className="cta-info-lbl">Horário</div>
                <div className="cta-info-val">Seg–Sex · 9h às 18h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col">
            <a className="nav-logo" href="#">
              <img className="nav-logo-img footer-logo-img" src="/assets/logo.webp" alt="AA Corretora" loading="lazy" width="190" height="42" />
            </a>
            <p className="footer-brand-text">
              Especialistas em consórcios há mais de 12 anos. Realize seus sonhos sem juros, com atendimento humano e personalizado.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram"><Icon.IG width="18" height="18" /></a>
              <a href="#" aria-label="Facebook"><Icon.FB width="18" height="18" /></a>
              <a href="#" aria-label="LinkedIn"><Icon.LI width="18" height="18" /></a>
              <a href="#" aria-label="WhatsApp"><Icon.Wpp width="18" height="18" /></a>
            </div>
          </div>
          <div className="footer-col">
            <div className="footer-col-t">Produtos</div>
            <ul>
              <li><a href="#produtos">Imóveis</a></li>
              <li><a href="#produtos">Veículos</a></li>
              <li><a href="#produtos">Pesados & Serviços</a></li>
              <li><a href="#simulador">Simular agora</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-col-t">Empresa</div>
            <ul>
              <li><a href="#vantagens">Vantagens</a></li>
              <li><a href="#como-funciona">Como funciona</a></li>
              <li><a href="#faq">Perguntas frequentes</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-col-t">Certificações</div>
            <ul>
              <li><div className="footer-cert"><Icon.Shield width="16" height="16" /> Regulado pelo BACEN</div></li>
              <li><div className="footer-cert"><Icon.Shield width="16" height="16" /> Lei 11.795/2008</div></li>
              <li><div className="footer-cert">★ Reclame Aqui 9.5/10</div></li>
              <li><div className="footer-cert">+12 anos de mercado</div></li>
            </ul>
          </div>
        </div>
        <p className="footer-disclaimer">
          A AA Corretora atua como representante autorizada de administradoras de consórcio devidamente registradas no Banco Central do Brasil. As condições apresentadas são ilustrativas e podem variar conforme análise. Consulte sempre o regulamento do grupo antes da adesão.
        </p>
        <div className="footer-bot">
          <span>© 2025 AA Corretora · Todos os direitos reservados</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#">Política de privacidade</a>
            <a href="#">Termos de uso</a>
          </div>
        </div>
      </div>
    </footer>
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
        <QuizForm onClose={onClose} />
      </div>
    </div>
  );
}

export default function DesktopApp() {
  const [quizOpen, setQuizOpen] = useState(false);
  const openQuiz = () => setQuizOpen(true);

  return (
    <>
      <Nav onCta={openQuiz} />
      <Hero onCta={openQuiz} />
      <Produtos onPick={openQuiz} />
      <Simulador />
      <Vantagens />
      <Comparativo />
      <ComoFunciona />
      <Depoimentos />
      <Faq onCta={openQuiz} />
      <CtaSection onCta={openQuiz} />
      <Footer />
      <button className="fab" aria-label="WhatsApp" onClick={openQuiz}>
        <Icon.Wpp width="26" height="26" />
      </button>
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />
    </>
  );
}
