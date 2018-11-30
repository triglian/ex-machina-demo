# Ex machina online toy story demo

This repo contains the code for an toy store demo SPA.

## Getting started

### Development

Run the following command:
```sh
npm install && npm start
```

During development we target the latest Chrome browser and we're using ES6 modules that will not run in older browsers

### Production

Run the following command:

```sh
npm install && npm build
```

Then open the `index.html` file that is inside the './build' directory. The JavaScript logic in the __build__ version is ES5 and should run on most modern browsers. Of special interest is version 41 of Chrome which is used by Googlebot and render and crawl SPAs for the Google Search Engine ([https://developers.google.com/search/docs/guides/rendering](https://developers.google.com/search/docs/guides/rendering)).


### Deployment
Whenever there is a push in the master branch of the github repo, a travis build is instantiated [here](https://travis-ci.org/triglian/ex-machina-demo/). If the travis build is successfull the __build__ version of the website is deployed at [https://triglian.github.io/ex-machina-demo/](https://triglian.github.io/ex-machina-demo/)

## Design decisions

* Use the &lt;template&gt; tag to reuse markup
* ES6 syntax for less verbose and more readable code
* Flexbox for the layout
