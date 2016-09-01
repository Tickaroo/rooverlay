module.exports = {
  entry: {
    Rooverlay: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: './dist',
    library: '[name]',
    libraryTarget: 'var'
  }
};
