import { useState, useEffect, useRef, useCallback } from 'react';

const IBGE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome';
const CITIES_CACHE_KEY = 'aa_ibge_cities_v1';

let cachedCities = null;
let citiesInflight = null;
let cachedGeo;
let geoInflight = null;

function normalize(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export async function loadCities() {
  if (cachedCities) return cachedCities;
  if (citiesInflight) return citiesInflight;

  try {
    const raw = sessionStorage.getItem(CITIES_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedCities = parsed;
        return cachedCities;
      }
    }
  } catch {}

  citiesInflight = (async () => {
    try {
      const res = await fetch(IBGE_URL);
      if (!res.ok) throw new Error(`IBGE ${res.status}`);
      const data = await res.json();
      const slim = data.map((c) => {
        const uf =
          c?.microrregiao?.mesorregiao?.UF?.sigla ||
          c?.['regiao-imediata']?.['regiao-intermediaria']?.UF?.sigla ||
          c?.['regiao-imediata']?.UF?.sigla ||
          '';
        return { nome: c.nome, uf, key: normalize(`${c.nome} ${uf}`) };
      });
      cachedCities = slim;
      try { sessionStorage.setItem(CITIES_CACHE_KEY, JSON.stringify(slim)); } catch {}
      return slim;
    } catch (err) {
      console.error('Falha ao carregar cidades do IBGE', err);
      cachedCities = [];
      return [];
    } finally {
      citiesInflight = null;
    }
  })();
  return citiesInflight;
}

export async function loadGeo() {
  if (cachedGeo !== undefined) return cachedGeo;
  if (geoInflight) return geoInflight;
  geoInflight = (async () => {
    try {
      const r = await fetch('/api/geo');
      if (!r.ok) { cachedGeo = null; return null; }
      const data = await r.json();
      cachedGeo = data?.city && data?.state ? { nome: data.city, uf: data.state } : null;
      return cachedGeo;
    } catch {
      cachedGeo = null;
      return null;
    } finally {
      geoInflight = null;
    }
  })();
  return geoInflight;
}

export function formatCity(c) {
  if (!c) return '';
  return c.uf ? `${c.nome} - ${c.uf}` : c.nome;
}

export function CityAutocomplete({
  value = '',
  onChange,
  onPick,
  suggestion,
  placeholder = 'Sua cidade',
  inputClassName = 'quiz-input',
  id = 'quiz-cidade',
}) {
  const [query, setQuery] = useState(value);
  const [cities, setCities] = useState(cachedCities || []);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value !== undefined && value !== query) setQuery(value);
  }, [value]);

  const ensureCities = useCallback(async () => {
    if (cities.length > 0) return;
    setLoading(true);
    const list = await loadCities();
    setLoading(false);
    setCities(list);
  }, [cities.length]);

  useEffect(() => {
    if (!query || cities.length === 0) {
      setFiltered([]);
      return;
    }
    const q = normalize(query);
    if (!q) { setFiltered([]); return; }
    const prefix = [];
    const sub = [];
    for (const c of cities) {
      const nNome = normalize(c.nome);
      if (nNome.startsWith(q)) prefix.push(c);
      else if (c.key.includes(q)) sub.push(c);
      if (prefix.length >= 30) break;
    }
    const merged = prefix.concat(sub).slice(0, 8);
    setFiltered(merged);
    setActiveIdx(merged.length > 0 ? 0 : -1);
  }, [query, cities]);

  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const pickCity = (city) => {
    const formatted = formatCity(city);
    setQuery(formatted);
    setTouched(true);
    setOpen(false);
    onChange?.(formatted);
    onPick?.(city);
    inputRef.current?.blur();
  };

  const acceptSuggestion = () => {
    if (suggestion) pickCity(suggestion);
  };

  const handleKey = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown') { setOpen(true); ensureCities(); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (filtered[activeIdx]) {
        e.preventDefault();
        pickCity(filtered[activeIdx]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showSuggestion =
    suggestion &&
    !touched &&
    (!query || normalize(query) !== normalize(formatCity(suggestion)));

  const listboxId = `${id}-list`;
  const hasResults = open && filtered.length > 0;
  const showEmpty = open && !loading && cities.length > 0 && query && filtered.length === 0;
  const showLoading = open && loading && filtered.length === 0;

  return (
    <div className="city-ac" ref={wrapRef}>
      <div className="city-ac-input-wrap">
        <span className="city-ac-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          ref={inputRef}
          id={id}
          className={`${inputClassName} city-ac-input`}
          type="text"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeIdx >= 0 ? `${listboxId}-${activeIdx}` : undefined}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            setTouched(true);
            onChange?.(v);
            onPick?.(null);
            setOpen(true);
            ensureCities();
          }}
          onFocus={() => { setOpen(true); ensureCities(); }}
          onKeyDown={handleKey}
        />
      </div>

      {showSuggestion && (
        <button
          type="button"
          className="city-ac-suggestion"
          onClick={acceptSuggestion}
          tabIndex={-1}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>
            Você está em <b>{suggestion.nome} - {suggestion.uf}</b>?
          </span>
          <span className="city-ac-suggestion-cta">Usar</span>
        </button>
      )}

      {(hasResults || showLoading || showEmpty) && (
        <ul className="city-ac-list" role="listbox" id={listboxId}>
          {showLoading && <li className="city-ac-status">Carregando cidades…</li>}
          {hasResults && filtered.map((c, i) => (
            <li
              key={`${c.nome}-${c.uf}-${i}`}
              id={`${listboxId}-${i}`}
              className={`city-ac-item ${i === activeIdx ? 'active' : ''}`}
              role="option"
              aria-selected={i === activeIdx}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pickCity(c)}
            >
              <span className="city-ac-name">
                <Highlight text={c.nome} query={query} />
              </span>
              <span className="city-ac-uf">{c.uf}</span>
            </li>
          ))}
          {showEmpty && <li className="city-ac-status">Nenhuma cidade encontrada</li>}
        </ul>
      )}
    </div>
  );
}

function Highlight({ text, query }) {
  if (!query) return text;
  const q = normalize(query);
  const nText = normalize(text);
  const idx = nText.indexOf(q);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="city-ac-mark">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}
