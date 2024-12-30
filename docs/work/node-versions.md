# Node versions

```sh
Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:69:19)
    at Object.createHash (node:crypto:133:10)
    at module.exports (C:\Users\timof\repos\timo\dot-one\node_modules\webpack\lib\util\createHash.js:135:53)
    at NormalModule._initBuildHash (C:\Users\timof\repos\timo\dot-one\node_modules\webpack\lib\NormalModule.js:417:16)
    at handleParseError (C:\Users\timof\repos\timo\dot-one\node_modules\webpack\lib\NormalModule.js:471:10)
    at C:\Users\timof\repos\timo\dot-one\node_modules\webpack\lib\NormalModule.js:503:5
    at C:\Users\timof\repos\timo\dot-one\node_modules\webpack\lib\NormalModule.js:358:12
    at C:\Users\timof\repos\timo\dot-one\node_modules\loader-runner\lib\LoaderRunner.js:373:3
    at iterateNormalLoaders (C:\Users\timof\repos\timo\dot-one\node_modules\loader-runner\lib\LoaderRunner.js:214:10)
    at iterateNormalLoaders (C:\Users\timof\repos\timo\dot-one\node_modules\loader-runner\lib\LoaderRunner.js:221:10)
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
C:\Users\timof\repos\timo\dot-one\node_modules\react-scripts\scripts\start.js:19
  throw err;
  ^

Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:69:19)
    at Object.createHash (node:crypto:133:10)
    at module.exports (C:\Users\timof\repos\timo\dot-one\node_modules\webpack\lib\util\createHash.js:135:53)
    at NormalModule._initBuildHash (C:\Users\timof\repos\timo\dot-one\node_modules\webpack\lib\NormalModule.js:417:16)
    at C:\Users\timof\repos\timo\dot-one\node_modules\webpack\lib\NormalModule.js:452:10
    at C:\Users\timof\repos\timo\dot-one\node_modules\webpack\lib\NormalModule.js:323:13
    at C:\Users\timof\repos\timo\dot-one\node_modules\loader-runner\lib\LoaderRunner.js:367:11    
    at C:\Users\timof\repos\timo\dot-one\node_modules\loader-runner\lib\LoaderRunner.js:233:18    
    at context.callback (C:\Users\timof\repos\timo\dot-one\node_modules\loader-runner\lib\LoaderRunner.js:111:13)
    at C:\Users\timof\repos\timo\dot-one\node_modules\babel-loader\lib\index.js:59:103 {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],        
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}

Node.js v18.19.1

nvm use 16
```
