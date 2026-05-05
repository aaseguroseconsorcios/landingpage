# AA Corretora — Landing Page

Landing page em React (Vite) servida por Node/Express. Pronta para deploy na Railway.

## Estrutura

```
.
├── index.html              # entry HTML único
├── server.js               # servidor Node/Express (produção)
├── vite.config.js          # build com @vitejs/plugin-react
├── public/assets/          # imagens (servidas em /assets/...)
├── src/
│   ├── main.jsx            # responsive root: decide mobile vs desktop
│   ├── mobile/
│   │   ├── App.jsx         # experiência mobile (snap-scroll de 9 telas)
│   │   └── styles.css
│   └── desktop/
│       ├── App.jsx         # experiência desktop
│       ├── Icons.jsx
│       ├── Quiz.jsx
│       └── styles.css
└── legacy/                 # arquivos da versão original (Babel-no-browser),
                            # mantidos só para referência
```

## Responsividade

`src/main.jsx` decide qual experiência renderizar com base em
`window.matchMedia('(min-width: 1024px)')`:

- Largura **< 1024 px** → carrega o bundle `mobile`
- Largura **>= 1024 px** → carrega o bundle `desktop`

Cada bundle tem JS + CSS próprios e é carregado sob demanda (code-split do
Vite). Quando o usuário cruza o breakpoint via resize ou rotação, a página
recarrega automaticamente para garantir um estado de estilos limpo.

Para mudar o ponto de corte, edite a constante `DESKTOP_QUERY` em
[src/main.jsx](src/main.jsx).

## Rodar localmente

```bash
npm install
npm run dev          # Vite dev server em http://localhost:5173
```

Para simular produção (build + servidor Node):

```bash
npm run build
npm start            # http://localhost:3000  (ou $PORT)
```

## Deploy na Railway

A Railway detecta o `package.json` e roda automaticamente:

1. `npm install`
2. `npm run build` (via heuristica do Nixpacks; o `start` script depende de `dist/`)
3. `npm start`

Passo a passo:

1. **Suba o código para o GitHub** (ou use a Railway CLI). Em qualquer caso é
   preciso ter um repositório git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Vite + Node landing"
   git branch -M main
   git remote add origin <url-do-seu-repo>
   git push -u origin main
   ```

2. **Crie um projeto na Railway**: <https://railway.app/new> →
   *Deploy from GitHub repo* → selecione o repositório.

3. **Domínio provisório**: depois do primeiro deploy, vá em
   *Settings → Networking → Generate Domain*. A Railway cria algo como
   `aa-corretora-production.up.railway.app` com HTTPS automático.

4. **(Opcional) Build command explícito**: se o Nixpacks não rodar o build
   sozinho, defina em *Settings → Build*:
   - Build Command: `npm run build`
   - Start Command: `npm start`

5. **Healthcheck (opcional)**: aponte para `/healthz`.

A Railway injeta `PORT` automaticamente; o `server.js` já lê `process.env.PORT`.

## Notas

- A pasta `legacy/` contém os HTMLs originais com React+Babel via CDN — pode
  apagar quando não precisar mais.
- As pastas `assets/`, `uploads/` e `scraps/` na raiz são da versão antiga; as
  imagens em uso ficam em `public/assets/`.
