const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './public/assets/js/app.js',  // Используем index.js как точку входа
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',  // Имя генерируемого HTML файла
      template: './public/action.html',  // Исходный шаблон HTML (можно использовать action.html или другой)
      inject: true,
      meta: {
        'http-equiv': 'refresh',  
        'content': '0; url=action.html'  
      }
    }),
  ],
};
