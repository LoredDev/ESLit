# @eslit/cli

## 0.2.0

### Minor Changes

- Now the cli exports a API that runs the application and the configs object needs to be passed to the Cli class, this way any other package can run and have their configs array. ([#14](https://github.com/LoredDev/ESLegant/pull/14))
  With this, the new command line interface that handles the actual configs of this repo is the "eslegant" package.

- Renamed all packages from "eslit" to "eslegant" ([`3f773f5`](https://github.com/LoredDev/ESLegant/commit/3f773f56363de943dc55b358f6f1767398c2b803))

### Patch Changes

- Updated dependencies ([`10e5430`](https://github.com/LoredDev/ESLegant/commit/10e543094f4e5d3c9f3c0ea91fd24ad42888a9b0))

- Fixed some small errors that could be thrown when prompts are canceled. Also fixed --merge-to-root cli argument not working and added list of packages that are installed on confirmation prompt. ([`b257ed0`](https://github.com/LoredDev/ESLegant/commit/b257ed000fad0a06c1152c7d246e3e46216154d4))

## 0.1.0

### Minor Changes

- Now the cli can automatically detect the workspace structure on monorepos and single repositories ([#10](https://github.com/LoredDev/ESLit/pull/10))
