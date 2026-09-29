# Portafolio personal

Sitio personal y blog, construido con [Astro](https://astro.build). Se publica en
<https://bguzmanm.github.io/me/>.

Las secciones del home (`About`, `Experiencia`, `Proyectos`, `Contacto`) viven en
`src/components/`, y el blog se arma a partir de los `.md` en `src/pages/posts/`.

## Requisitos

- [Node.js](https://nodejs.org) 18 o superior
- [pnpm](https://pnpm.io) 12.8.1

La versión de pnpm está fijada en el campo `packageManager` del `package.json`, así
que si usás [corepack](https://nodejs.org/api/corepack.html) no necesitás instalarla a
mano: `corepack enable` y el resto se encarga solo.

## Comandos

Todos se corren desde la raíz del proyecto:

| Comando          | Acción                                                      |
| :--------------- | :---------------------------------------------------------- |
| `pnpm install`   | Instala las dependencias                                    |
| `pnpm dev`       | Levanta el server de desarrollo en `localhost:4321`         |
| `pnpm build`     | Construye el sitio de producción en `./dist/`               |
| `pnpm preview`   | Sirve el build localmente, para revisar antes de desplegar  |
| `pnpm lint`      | Corre ESLint sobre los `.astro` y el resto del código       |
| `pnpm format`    | Formatea con Prettier                                       |
| `pnpm astro ...` | Comandos del CLI de Astro, como `astro add` o `astro check` |

## Estructura

```text
src/
├── assets/
│   └── images/        # imágenes que importa la web, vía astro:assets
├── components/        # secciones del home y componentes sueltos
├── layouts/
│   ├── Layout.astro            # layout general, con el <head> y los metadatos
│   └── MarkdownPostLayout.astro # layout de los posts
├── pages/
│   ├── index.astro      # home
│   ├── posts.astro      # índice del blog
│   └── posts/*.md       # un archivo por post
└── styles/
    └── global.css
```

Las imágenes del blog van aparte en `public/assets/images/`, porque las referencia
los `.md` por URL y no pasan por el pipeline de assets de Astro.

## Deploy

El deploy es automático: cada push a `main` dispara `.github/workflows/astro.yml`,
que hace install, lint, build y publica en GitHub Pages.

El workflow **no** declara la versión de pnpm a propósito. `pnpm/action-setup` la lee
del campo `packageManager` del `package.json`, y si se especifica en los dos lugares a
la vez la action falla con un error de versiones duplicadas. Si alguna vez cambiás la
versión de pnpm, cambiala solo ahí.

## Formateo

`prettier-plugin-astro` formatea los `.astro`. Hay un `.prettierignore` con lo que no
se debe tocar, y conviene conocerlo antes de correr `pnpm format`:

| Entrada                | Por qué                                                             |
| :--------------------- | :------------------------------------------------------------------ |
| `pnpm-lock.yaml`       | Lo genera pnpm; formatearlo produce diff en cada install            |
| `src/pages/posts/*.md` | El formateo de markdown reflowea el texto y puede alterar el render |
| `.github/workflows/`   | El quoting de los `run:` con `${{ }}` es sensible                   |

Un detalle de `prettier-plugin-astro`: cuando parte un elemento inline en varias
líneas, Astro deja de recortar el whitespace y mete espacios visibles en el texto
renderizado. Si un párrafo queda con un espacio raro antes de un punto, es eso.

## Stack

- [Astro 4](https://astro.build) con `@astrojs/tailwind` y `@astrojs/sitemap`
- [Tailwind CSS 3](https://tailwindcss.com), con los colores del tema definidos en
  `tailwind.config.mjs`
- [sharp](https://sharp.pixelplumbing.com) para la optimización de imágenes
- ESLint + Prettier con `prettier-plugin-astro`

## Licencia

[MIT](./LICENSE)
