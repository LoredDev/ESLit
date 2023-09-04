---
"@eslegant/js": minor
---

New rules structure.

Now all configs have at least `recommended` and `strict` variants, each having `error`, `warn` and `disabled`/`off` rule levels.
They are exported under the `configs` object, and are separated by purpose.
Presets are now exported under the `presets` object, being a easier way of enabling multiple configs at once.

The package has a more defined purpose, and will be used just for rules/configs related to
JavaScript and TypeScript.
