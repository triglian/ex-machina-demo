const path = require('path');

module.exports = {
  mode: 'production',
  entry: './js/app.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build/js')
  }
};