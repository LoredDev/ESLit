---
"@eslegant/js": minor
---

Added rules for NodeJS environments, using the eslint-plugin-n and eslint-plugin-security.

The added configs in the `recommended` object helps preventing issues 
such as using deprecated or unsupported APIs and warns about security issues. 
Building on top of the recommended configs of the plugins.

In the `strict` object they helps making the code more node-explicit, such as importing
global variables (e.g. `process` needs to be imported from `node:process`).
