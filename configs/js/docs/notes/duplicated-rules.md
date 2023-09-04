# Duplicated rules

This is a list of rules that implements the same features and/or end
up fixing the same errors.

- **[`@typescript/member-ordering`][ts/member-ordering], [`@typescript/sort-type-constituents`][ts/sort-type-constituents], [`import/order`][in/order]**: 
  implements the same functions from [`eslint-plugin-perfectionist`][plugin-perfectionist]

- **[`unicorn/no-for-loop`][un/no-for-loop] and [`@typescript/prefer-for-of`][ts/prefer-for-of]**: 
  `unicorn/no-for-loop` was used as it also reports when `i`/`index` is used.

- **[`unicorn/prefer-includes`][un/prefer-includes] and [`@typescript/prefer-includes`][ts/prefer-includes]**: 
  `unicorn/prefer-includes` was used as it not needs type information to run.

- **[`@typescript/prefer-regexp-exec`][ts/prefer-regexp-exec] and [`unicorn/prefer-regexp-test`][un/prefer-regexp-test]**: 
  `unicorn/prefer-regexp-exec` was used, because it reports on `RegExp#exec()` and `String#match()`


[ts/member-ordering]: <https://typescript-eslint.io/rules/member-ordering>
[ts/prefer-for-of]: <https://typescript-eslint.io/rules/prefer-for-of>
[ts/prefer-includes]: <https://typescript-eslint.io/rules/prefer-includes>
[ts/prefer-regexp-exec]: <https://typescript-eslint.io/rules/prefer-regexp-exec>
[ts/sort-type-constituents]: <https://typescript-eslint.io/rules/sort-type-constituents>

[un/no-for-loop]: <https://github.com/sindresorhus/eslint-plugin-unicorn/blob/6d15a02d48de7ecfc38d0683a8487b2f937d83a0/docs/rules/no-for-loop.md>
[un/prefer-includes]: <https://github.com/sindresorhus/eslint-plugin-unicorn/blob/6d15a02d48de7ecfc38d0683a8487b2f937d83a0/docs/rules/prefer-includes.md>
[un/prefer-regexp-test]: <https://github.com/sindresorhus/eslint-plugin-unicorn/blob/6d15a02d48de7ecfc38d0683a8487b2f937d83a0/docs/rules/prefer-regexp-test.md>

[in/order]: <https://github.com/import-js/eslint-plugin-import/blob/6b95a021938139726b3f862beb37012d6e2afab2/docs/rules/order.md>

[plugin-perfectionist]: <https://eslint-plugin-perfectionist.azat.io/>
