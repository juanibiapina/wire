# Wire

Lightweight frontend tooling.

This is beta software. It can be used in production but it doesn't cover many
use cases and needs polishing.

## Installation

```bash
npm install @juanibiapina/wire
```

## Usage

Wire provides a `wire` CLI for running common frontend development tasks. Summary of commands:

- `npx wire init`: Initialize a minimal project in the current directory.
- `npx wire dev`: Start development server at `http://localhost:3000`.
- `npx wire build`: Build a production bundle.
- `npm wire importmap pin <package-spec>`: Pin a package to the import map.
