# @eslit/config

## 0.3.0

### Minor Changes

- Added rules for NodeJS environments, using the eslint-plugin-n and eslint-plugin-security. ([`dcce924`](https://github.com/LoredDev/ESLegant/commit/dcce9242867061235c4396cdaced707dec111c16))

  The added configs in the `recommended` object helps preventing issues
  such as using deprecated or unsupported APIs and warns about security issues.
  Building on top of the recommended configs of the plugins.

  In the `strict` object they helps making the code more node-explicit, such as importing
  global variables (e.g. `process` needs to be imported from `node:process`).

- Added new ESLint rules inspired by StandardJS. ([`4a1f38f`](https://github.com/LoredDev/ESLegant/commit/4a1f38ff2452f9555203e9ff301fc3b90be6854c))

- New rules structure. ([#18](https://github.com/LoredDev/ESLegant/pull/18))

  Now all configs have at least `recommended` and `strict` variants, each having `error`, `warn` and `disabled`/`off` rule levels.
  They are exported under the `configs` object, and are separated by purpose.
  Presets are now exported under the `presets` object, being a easier way of enabling multiple configs at once.

  The package has a more defined purpose, and will be used just for rules/configs related to
  JavaScript and TypeScript.

- Configs now export a `default` variation, where rule leves aren't overriden. ([`f4e52b9`](https://github.com/LoredDev/ESLegant/commit/f4e52b991c19f8e1f515383c792effd72838ded8))

- New rules related to possible security vulnerabilities in JavaScript. ([`2e1914c`](https://github.com/LoredDev/ESLegant/commit/2e1914c733b16d5f82b39a672c758a63b77ae282))
  Provided by `eslint-plugin-security` and `eslint-plugin-no-secrets`

- Renamed all packages from "eslit" to "eslegant" ([`3f773f5`](https://github.com/LoredDev/ESLegant/commit/3f773f56363de943dc55b358f6f1767398c2b803))

### Patch Changes

- Updated dependencies ([`10e5430`](https://github.com/LoredDev/ESLegant/commit/10e543094f4e5d3c9f3c0ea91fd24ad42888a9b0))

- Renamed @eslegant/config to @eslegant/js ([#16](https://github.com/LoredDev/ESLegant/pull/16))

## 0.2.0

### Minor Changes

- Rewritten most of the package logic, so now it uses a more standard ESLint configuration object structure. All configurations now are separated in scope and presets are created for better convenience when configuring ESLint. ([#8](https://github.com/LoredDev/ESLit/pull/8))
  (fixes [#3](https://github.com/loreddev/eslit/issues/3)).
