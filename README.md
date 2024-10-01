# Dot One

Based on the frontend steps for building the moments fullstack app [in this repo](https://github.com/Code-Institute-Solutions/moments).

![CI logo](https://codeinstitute.s3.amazonaws.com/fullstack/ci_logo_small.png)

## Workflow

```sh
npm start # port 3000 is used
npm test
npm run lint
npm run build
```

## About the project

This project uses React v17.0.2 which was released March 2021.  I relies on a deployed [Django (Python) backend project](https://github.com/timofeysie/drf-two) by default.  This can be changed by editing the ```axios.defaults.baseURL``` value in src\api\axiosDefaults.js file to point to a locally running backend.

It uses the [Bootstrap v4.6](https://react-bootstrap-v4.netlify.app/) CSS framework which was released January 2021.

It also use:

- [Font awesome](https://fontawesome.com/) [free](https://fontawesome.com/search?m=free&o=r) icons
- [Css Modules in React](https://medium.com/@ralph1786/using-css-modules-in-react-app-c2079eadbb87)
- [CSS Modules Stylesheet](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)

The package.json for the app after its complete uses these version settings:

```js
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^11.2.7",
    "@testing-library/user-event": "^12.8.3",
    "axios": "^0.21.4",
    "bootstrap": "^4.6.0",
    "jwt-decode": "^3.1.2",
    "react": "^17.0.2",
    "react-bootstrap": "^1.6.3",
    "react-dom": "^17.0.2",
    "react-infinite-scroll-component": "^6.1.0",
    "react-router-dom": "^5.3.0",
    "react-scripts": "^4.0.3",
    "web-vitals": "^1.1.2"
  },
```

The documentation below follow the [Code Institute](https://codeinstitute.net/global/about-us/) advanced frontend moments project walkthrough.

As of this writing, mid-2024, the stack is getting quite dated.  As it was designed for a full-stack web development boot camp student project, it has served its purpose well.  Be aware that information online about the libraries used might point to newer versions.  A good example is the routing section below.

## Getting Started

Clone the repo on your local computer in the usual way, install the dependencies and start the app with commands such as:

```sh
git clone https://github.com/timofeysie/dot-one.git
npm install
npm start
```

If you experience any of these errors when trying to start the app,

```err
Cannot find module 'C:\Users\Gia\repos\dot-one\node_modules\isexe\index.js'. Please verify that the package.json has a valid "main" entry
```

```err
'react-scripts' is not recognized as an internal or external command, operable program or batch file.
```

```err
Error: error:0308010C:digital envelope routines::unsupported
 opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
 library: 'digital envelope routines',
 reason: 'unsupported',
 code: 'ERR_OSSL_EVP_UNSUPPORTED'
```

Node.js v20.10.0

Change the 'start' to  "start": "react-scripts --openssl-legacy-provider start" and it works

The issue and solutions are described in [this StackOverflow link](https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported).

## Developer work flow

Create a branch from the develop branch.  Don't work on the main branch directly.  Pull requests will be made by requesting to merge work from your issue branch into the develop branch.  When we want to do a deployment to prod, there will be a merge of the develop branch into the main branch which will then automatically trigger a deployment to production.

## How the app was made

Please see the [full how the app was made document](./docs/how_the_app_was_made.md) in the docs directory for details about how feature creation, issues faced and deployment steps.

## House keeping todo

Here are some things that will make the app better for growing bigger.

- use an enum for strings such as ```useRedirect("loggedIn");``` to avoid typos
