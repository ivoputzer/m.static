# m.static

[![travis](https://img.shields.io/travis/ivoputzer/m.static.svg?style=for-the-badge)](https://travis-ci.org/ivoputzer/m.static)
[![dependencies](https://img.shields.io/badge/dependencies-none-blue.svg?style=for-the-badge&colorB=44CC11)](package.json)
[![coverage status](https://img.shields.io/coveralls/ivoputzer/m.static.svg?style=for-the-badge)](https://coveralls.io/github/ivoputzer/m.static?branch=master)
[![linter](https://img.shields.io/badge/coding%20style-standard-brightgreen.svg?style=for-the-badge)](http://standardjs.com/)

[![node](https://img.shields.io/badge/node-6%2B-blue.svg?style=for-the-badge)](https://nodejs.org/docs/v6.0.0/api)
[![version](https://img.shields.io/npm/v/m.static.svg?style=for-the-badge&colorB=007EC6)](https://www.npmjs.com/package/m.static)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&colorB=007EC6)](https://spdx.org/licenses/MIT)
[![minzip](https://img.shields.io/bundlephobia/minzip/m.static.svg?style=for-the-badge)](https://bundlephobia.com/scan-results?packages=m.static)
[![downloads](https://img.shields.io/npm/dt/m.static.svg?style=for-the-badge&colorB=007EC6)](https://www.npmjs.com/package/m.static)

**[m(icro)](https://github.com/ivoputzer/m.cro#readme)[static](https://github.com/ivoputzer/m.static)** is a lightweight static file server for node.js written in es6+

# Local Usage

```
  $ npm i
  $ npm start --port 8088 --cwd ./ --defaultFile index.html --errorFile 404.html
```

# Global Install

when installed globally `m.static` can be used as follows:
```
  $ npm i -g m.static
  $ m.static --port 8088 --cwd ./ --defaultFile index.html --errorFile 404.html
```
