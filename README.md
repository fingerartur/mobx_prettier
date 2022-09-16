# mobx_prettier
Chrome extension - Prettifier / formatter for easy debugging of Mobx objects in Dev Tools console and debugger.

## Setup
```bash
npm i
```

## Develop
```bash
# Start up the example
npm run example
# Build the extension
npm run build

# Load the extension via chrome devtools
# Test the extension on the example
```
Chrome > Extensions > Load unpacked

Read about [developing extensions](https://developer.chrome.com/docs/extensions/mv3/getstarted/).

## Publish
```bash
npm run pack
```

Read about [publishing extensions](https://developer.chrome.com/docs/webstore/publish/).

## Sources
*There is no official documentation for writing chrome formatters and that just sucks immensely.*

- [chrome formatters blog #1](https://www.mattzeunert.com/2016/02/19/custom-chrome-devtools-object-formatters.html)
- [chrome formatters blog #2](https://docs.google.com/document/d/18GbcfQ4ddHgwbUzQgALQ6o8VFxtS9eJUD-xl9EjfxOU/edit#)
- [example #1 - mobx formatter, not very good](https://github.com/kubk/mobx-log)
- [example #2 - immutable.js formatter](https://github.com/andrewdavey/immutable-devtools/blob/master/src/createFormatters.js)

