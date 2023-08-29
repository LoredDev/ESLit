---
"@eslegant/cli": minor
---

Now the cli exports a API that runs the application and the configs object needs to be passed to the Cli class, this way any other package can run and have their configs array.
With this, the new command line interface that handles the actual configs of this repo is the "eslegant" package.
