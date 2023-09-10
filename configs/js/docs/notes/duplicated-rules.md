# Duplicated rules

This is a list of rules that implements the same features and/or end
up fixing the same errors.

- **[`@typescript/member-ordering`][ts/member-ordering], [`@typescript/sort-type-constituents`][ts/sort-type-constituents], [`import/order`][im/order]**: 
  implements the same functions from [`eslint-plugin-perfectionist`][plugin-perfectionist]

- **[`unicorn/no-for-loop`][un/no-for-loop] and [`@typescript/prefer-for-of`][ts/prefer-for-of]**: 
  `unicorn/no-for-loop` was used as it also reports when `i`/`index` is used.

- **[`unicorn/prefer-includes`][un/prefer-includes] and [`@typescript/prefer-includes`][ts/prefer-includes]**: 
  `unicorn/prefer-includes` was used as it not needs type information to run.

- **[`@typescript/prefer-regexp-exec`][ts/prefer-regexp-exec] and [`unicorn/prefer-regexp-test`][un/prefer-regexp-test]**: 
  `unicorn/prefer-regexp-exec` was used, because it reports on `RegExp#exec()` and `String#match()`

- **[`import/extensions`][im/extensions] and [`n/file-extension-in-import`][n/file-extension-in-import]**: 
  `import/extensions` was used, as it is not a node-specific issue.

- **[`import/no-extraneous-dependencies`][im/no-extraneous-dependencies], [`n/no-extraneous-require`][n/no-extraneous-require] and [`n/no-extraneous-import`][n/no-extraneous-import]**: 
  `import/no-extraneous-dependencies` was used, as it is not a node-specific issue.

- **[`import/no-unresolved`][im/no-unresolved], [`n/no-missing-require`][n/no-missing-require] and [`n/no-missing-import`][n/no-missing-import]**: 
  `import/no-unresolved` was used, as it is not a node-specific issue.

[ts/member-ordering]: <https://typescript-eslint.io/rules/member-ordering>
[ts/prefer-for-of]: <https://typescript-eslint.io/rules/prefer-for-of>
[ts/prefer-includes]: <https://typescript-eslint.io/rules/prefer-includes>
[ts/prefer-regexp-exec]: <https://typescript-eslint.io/rules/prefer-regexp-exec>
[ts/sort-type-constituents]: <https://typescript-eslint.io/rules/sort-type-constituents>

[un/no-for-loop]: <https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-for-loop.md>
[un/prefer-includes]: <https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-includes.md>
[un/prefer-regexp-test]: <https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-regexp-test.md>

[im/order]: <https://github.com/import-js/eslint-plugin-import/blob/maib/docs/rules/order.md>
[im/extensions]: <https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md>
[im/no-extraneous-dependencies]: <https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md>
[im/no-unresolved]: <https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md>

[n/file-extension-in-import]: <https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/file-extension-in-import.md>
[n/no-extraneous-import]: <https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-extraneous-import.md>
[n/no-extraneous-require]: <https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-extraneous-require.md>
[n/no-missing-import]: <https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-missing-import.md>
[n/no-missing-require]: <https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-missing-require.md>

[plugin-perfectionist]: <https://eslint-plugin-perfectionist.azat.io/>
