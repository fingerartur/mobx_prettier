# Description - EN

Mobx Prettifier helps you inspect Mobx data in Dev Tools with ease!

Complicated Mobx proxies get automatically transformed into plain and simple JS for anything written to your Dev Tools Console, and the same goes for variables in Dev Tools Sources debugger.

Setup:
Follow the guide here: xxxx

1. Enable Custom formatters in Dev Tools by going to `Settings → Preferences → Console section → Enable custom formatters`
2. Add the following snippet to your codebase, this adds Mobx to window, and thus allows this plugin to interoperate with Mobx on your site.

```ts
// e.g. If you are using TS / JS modules, add mobx to window like this:

import * as mobx from 'mobx'

declare global {
  interface Window {
    mobx: typeof mobx
  }
}

window.mobx = mobx
```

Compatibility:
Works with Mobx v6. It should probably work with earlier versions of Mobx as well, but this has not been tested.

<!--
Technically:

This extension automatically calls `toJS()` on any Mobx objects that you log to console or debug in Dev Tools. It makes inspecting of Mobx data as easy as inspecting plain
It works both in Console and Debugger. Ipmlemented via Chrome Dev Tools Formatters -->
