// eslint-disable-next-line
const sinon = require('sinon');
// eslint-disable-next-line
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const exposedProperties = ['window', 'document'];

sinon.stub(console, 'error').callsFake(warning => {
  if (
    warning &&
    (warning.indexOf('Warning: Failed prop type:') > -1 ||
      warning.indexOf('Warning: Each child in an array or iterator should have a unique "key" prop') > -1)
  ) {
    throw new Error(warning);
  } else if (warning) {
    // eslint-disable-next-line
    console.warn(warning); // NOSONAR Kun testkode
  }
});

const dom = new JSDOM('<html><body><div id="app" /></body></html>', {
  url: 'http://localhost/sak',
});
global.document = dom.window.document;
global.window = document.window;
global.DOMParser = dom.window.DOMParser;
Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.HTMLElement = dom.window.HTMLElement;
global.Date = Date;
// https://github.com/facebookincubator/create-react-app/issues/3199
global.requestAnimationFrame = cb => {
  setTimeout(cb, 0);
};

global.cancelAnimationFrame = cb => {
  setTimeout(cb, 0);
};
