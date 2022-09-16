# Mobx Prettier - Setup

1. Enable Custom formatters in Dev Tools by going to `Settings → Preferences → Console section → Enable custom formatters`
2. Add the following snippet to your codebase, this adds Mobx to window, and thus allows this plugin to interoperate with Mobx on your site.
   1. Typescript:
    ```ts
    import * as mobx from 'mobx'

    declare global {
      interface Window {
        mobx: typeof mobx
      }
    }

    window.mobx = mobx
    ```
    2. or Javascript ES6:
    ```js
    import * as mobx from 'mobx'
    window.mobx = mobx
    ```
    3. or Javascript ES5: If you are using the good old Javascript ES5, you do not need to do anything. Just double-check that the mobx library is present on the window in `window.mobx`.


## Compatibility

Works with Mobx version 6. It should probably work with earlier versions of Mobx as well, but this has not been tested.

## Technical details

This extension defines a custom Dev Tools formatter for Mobx objects. It uses your instance of the Mobx library from `window.mobx` and automatically applies `mobx.toJS()` to Mobx objects.
