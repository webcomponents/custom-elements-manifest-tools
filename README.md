# custom-elements-manifest-tools

Tools for working with custom elements manifests

## Monorepo

This repository is a monorepo using [npm workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces) and [Wireit](https://github.com/google/wireit) to run scripts.

## Setup

### Install dependencies:

From the root directory run:
```sh
npm ci
```

### Build all packages

From the root directory run:
```sh
npm run build
```

This will build all packages

### Build a single package

Running `npm run build` in a single package will build that package and its monorepo dependencies.


## Packages

- **custom-elements-manifest-tools** Tools for working with custom elements manifest data, such as resolving references, getting lists of element declarations, getting elements and modules by name, etc.
- **custom-elements-manifest-validator** Validates mafests for correctness.
  