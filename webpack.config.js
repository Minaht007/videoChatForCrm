const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './public/action.html',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'action.html',  // Имя генерируемого HTML файла
      template: './public/action.html',  // Исходный шаблон HTML
      inject: true,
      meta: {
        'http-equiv': 'refresh',  // Добавление метатега для автоматического перенаправления
        'content': '0; url=action.html'  // URL для перенаправления
      }
    }),
  ],
};
