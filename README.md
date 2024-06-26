# Wire

Wire is a proof-of-concept frontend development and build tool. The goal is to
provide a development and deployment experience as close to web standards as
possible.

This is experimental software. It can technically be used in production but it
doesn't cover many use cases and needs polishing.

## Features

- Supports HTML + EJS, CSS and TypeScript.
- Dev server for local development
- Optimized production builds using [SWC](https://swc.rs).
- Supports [Import Maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap).

## Installation

Install wire as a development dependency in your project:

```bash
npm install --save-dev @juanibiapina/wire
```

## Usage

Wire provides a `wire` CLI for running common frontend development and build
tasks. Summary of commands:

- `npx wire init`: Initialize a minimal project in the current directory.
- `npx wire dev`: Start development server at `http://localhost:3000`.
- `npx wire build`: Build a production bundle.
- `npm wire importmap pin <package-spec>`: Pin a package to the import map.

## Design

### HTML

HTML lives in `src/html`. Files are named `:name.html.ejs`, with a special
`index.html.ejs` for the root route.

Wire uses EJS for adapting the generated HTML to the environment. Helpers are
available for common tasks.

### CSS

CSS lives in `src/css`. Files are named `:name.css`. They can be included in
HTML files using the `stylesheetLinkTag` helper function in .html.ejs files:

```eruby
<%- stylesheetLinkTag("application") %>
```

This will include the `application.css` file.

### TypeScript

Typescript files live in `src/typescript`. Files are named `:name.tsx`. JSX is
supported by default.

Typescript files can be included in HTML files using the `scriptModuleTag`
helper function in .html.ejs files:

```eruby
<%- scriptModuleTag("application") %>
```

This will include the `application.js` file compiled from `application.tsx`.

### Public files

All files in the `src/public` directory are copied to the output directory's
`public` directory.

## EJS helpers

- async importMapScriptTag(): Include the import map script tag.
- scriptModuleTag(name): Include a script tag for JS module defined by `src/typescript/:name.tsx`.
- stylesheetLinkTag(name): Include a link tag for CSS file defined by `src/css/:name.css`.
- includeCSSDirectory(name): Include all CSS files in the `src/css/:name` directory.
- production: True if the environment is production.
