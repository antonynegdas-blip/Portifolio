# Antony Joaquim Portfolio

Personal portfolio for **Antony Joaquim**, Web Developer and DevOps, built with React and Vite. The visual direction uses a clean black-and-white palette, a Bento Grid layout, and light/dark themes.

## Requirements

Install [Node.js](https://nodejs.org/) (LTS recommended), then run:

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`.

## Where to edit

| What you want to change | File | Where |
|---|---|---|
| Main English and Portuguese text | `src/App.jsx` | The `content` object near the top |
| Name, title and metadata | `src/App.jsx` | `content.en` and `content.pt` |
| Projects, descriptions, tags and links | `src/App.jsx` | `content.en.work.projects` and `content.pt.work.projects` |
| Calendly URL | `src/App.jsx` | The `calendlyUrl` constant near the top |
| Colors, spacing, typography and responsive layout | `src/styles.css` | Variables at the top and the component rules below |
| Page title and SEO description | `index.html` | `<title>` and the description meta tag |
| Project images | `src/App.jsx` and `src/styles.css` | Replace each `.project-image` visual with an `<img>` or background image when assets are ready |

## Add project images

Place image files in `public/images/`, then add an image path to the project data. For example:

```jsx
image: '/images/sants-barbershop.webp'
```

Then render the image inside the project's `.project-image` element. Keep images optimized as WebP or AVIF where possible.

## Change the main colors

The theme variables are at the beginning of `src/styles.css`:

```css
:root {
  --bg: #f4f4f0;
  --text: #171717;
  --card: #fff;
  --accent: #c7ff4a;
}
```

The dark theme overrides these values inside `:root[data-theme='dark']`. The current design intentionally uses black, white and a small lime accent. Update both variable blocks if you want the themes to remain balanced.

## Change important phrases

All visible phrases are grouped in `content.en` and `content.pt` in `src/App.jsx`. Update both languages when changing a phrase so the language switch remains complete. The main hero title is `content.en.hero.title` / `content.pt.hero.title`.

## Calendly

Set the URL here:

```jsx
const calendlyUrl = 'https://calendly.com/your-username/meeting'
```

The contact buttons currently scroll to the contact footer while the URL is empty. After adding the URL, they open Calendly in a new tab.

## Deployment on Vercel

Import this repository into Vercel. The default settings are:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

No environment variables are required for the current front-end version.

---

# Portfólio de Antony Joaquim

Portfólio pessoal de **Antony Joaquim**, Web Developer and DevOps, desenvolvido com React e Vite. A direção visual usa uma paleta limpa em preto e branco, layout Bento Grid e temas claro/escuro.

## Requisitos

Instale o [Node.js](https://nodejs.org/) (recomendamos a versão LTS) e execute:

```bash
npm install
npm run dev
```

Para criar o build de produção, execute `npm run build`. Para visualizar esse build localmente, execute `npm run preview`.

## Onde editar

| O que você deseja alterar | Arquivo | Onde |
|---|---|---|
| Textos principais em inglês e português | `src/App.jsx` | Objeto `content`, no início do arquivo |
| Nome, título e metadados | `src/App.jsx` | `content.en` e `content.pt` |
| Projetos, descrições, tags e links | `src/App.jsx` | `content.en.work.projects` e `content.pt.work.projects` |
| URL do Calendly | `src/App.jsx` | Constante `calendlyUrl`, no início do arquivo |
| Cores, espaçamentos, tipografia e layout responsivo | `src/styles.css` | Variáveis no início e regras dos componentes abaixo |
| Título da página e descrição para SEO | `index.html` | `<title>` e meta tag de descrição |
| Imagens dos projetos | `src/App.jsx` e `src/styles.css` | Substitua cada visual `.project-image` por uma tag `<img>` ou imagem de fundo quando os arquivos estiverem prontos |

## Adicionar imagens aos projetos

Coloque os arquivos de imagem em `public/images/` e adicione o caminho da imagem aos dados do projeto. Exemplo:

```jsx
image: '/images/sants-barbershop.webp'
```

Depois, renderize a imagem dentro do elemento `.project-image` do projeto. Sempre que possível, mantenha as imagens otimizadas nos formatos WebP ou AVIF.

## Alterar as cores principais

As variáveis dos temas ficam no início de `src/styles.css`:

```css
:root {
  --bg: #f4f4f0;
  --text: #171717;
  --card: #fff;
  --accent: #c7ff4a;
}
```

O tema escuro substitui esses valores dentro de `:root[data-theme='dark']`. O design atual usa intencionalmente preto, branco e um pequeno destaque verde-limão. Atualize os dois blocos de variáveis caso queira manter equilíbrio entre os temas.

## Alterar frases importantes

Todas as frases visíveis estão agrupadas em `content.en` e `content.pt`, dentro de `src/App.jsx`. Atualize os dois idiomas ao alterar uma frase para que o seletor de idioma continue completo. O título principal fica em `content.en.hero.title` / `content.pt.hero.title`.

## Calendly

Defina a URL neste local:

```jsx
const calendlyUrl = 'https://calendly.com/seu-usuario/reuniao'
```

Enquanto a URL estiver vazia, os botões de contato levam o usuário ao rodapé de contato. Depois de adicionar a URL, eles abrirão o Calendly em uma nova aba.

## Deploy na Vercel

Importe este repositório na Vercel. As configurações padrão são:

- Comando de build: `npm run build`
- Diretório de saída: `dist`
- Comando de instalação: `npm install`

A versão atual do front-end não exige variáveis de ambiente.
