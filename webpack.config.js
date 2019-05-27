const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin')
const { styles } = require('@ckeditor/ckeditor5-dev-utils')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  entry: {
    'pagina-ejemplo': './fuente/wm/interfaz/js/pagina-ejemplo.js',
    'login': './fuente/wm/interfaz/js/login.js',
    'inicio': './fuente/wm/interfaz/js/inicio.js',
    'secciones-indice': './fuente/wm/interfaz/js/secciones-indice.js',
    'secciones-articulo': './fuente/wm/interfaz/js/secciones-articulo.js',
    'secciones-categorias': './fuente/wm/interfaz/js/secciones-categorias.js',
    'secciones-secciones': './fuente/wm/interfaz/js/secciones-secciones.js',
    'secciones-autores': './fuente/wm/interfaz/js/secciones-autores.js',
    'contenidos': './fuente/wm/interfaz/js/contenidos.js'
  },
  output: {
    filename: 'wm/interfaz/js/[name].js',
    path: path.resolve(__dirname, 'app')
  },

  // mode: 'development',
  // devtool: 'inline-source-map',

  mode: 'production',
  devtool: '',
  // devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.svg$/,
        // test: /ckeditor5-.*icons.*\.svg$/,
        use: [ 'raw-loader' ]
      },
      {
        test: /ckeditor5-.*\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'postcss-loader',
            options: styles.getPostCssConfig({
              themeImporter: {
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
              },
              minify: true
            })
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        exclude: /@ckeditor/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|ckeditor|cmsCkeditor\.js)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
            // minimize: false,
            interpolate: true // Para usar ${require('../comun/footer.html')} en las plantillas html
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        // test: /\.(png|jpg|gif|svg)$/,
        // exclude: /(@ckeditor)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/wm/interfaz/img/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new CKEditorWebpackPlugin({
      // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
      language: 'en',
      additionalLanguages: ['es'],
      outputDirectory: 'wm/interfaz/js/ckeditor5-translations'

      // Whether the build process should fail if an error occurs.
      // Defaults to `false`.
      // strict: true,

      // Whether to log all warnings to the console.
      // Defaults to `false`.
      // verbose: true
    }),
    //
    new HtmlWebpackPlugin({
      chunks: [ 'pagina-ejemplo' ],
      filename: path.resolve(__dirname, 'app/index.html'),
      template: path.resolve(__dirname, 'fuente/index.html'),
      hash: true
    }),
    //
    new HtmlWebpackPlugin({
      chunks: [ 'login' ],
      filename: path.resolve(__dirname, 'app/wm/login/index.html'),
      template: path.resolve(__dirname, 'fuente/wm/login/index.html'),
      hash: true
    }),
    new HtmlWebpackPlugin({
      chunks: [ 'inicio' ],
      filename: path.resolve(__dirname, 'app/wm/index.html'),
      template: path.resolve(__dirname, 'fuente/wm/index.html'),
      hash: true
    }),
    new HtmlWebpackPlugin({
      chunks: [ 'secciones-indice' ],
      filename: path.resolve(__dirname, 'app/wm/secciones/indice/index.html'),
      template: path.resolve(__dirname, 'fuente/wm/secciones/indice/index.html'),
      hash: true
    }),
    new HtmlWebpackPlugin({
      chunks: [ 'secciones-articulo' ],
      filename: path.resolve(__dirname, 'app/wm/secciones/articulo/index.html'),
      template: path.resolve(__dirname, 'fuente/wm/secciones/articulo/index.html'),
      hash: true
    }),
    new HtmlWebpackPlugin({
      chunks: [ 'secciones-categorias' ],
      filename: path.resolve(__dirname, 'app/wm/secciones/categorias/index.html'),
      template: path.resolve(__dirname, 'fuente/wm/secciones/categorias/index.html'),
      hash: true
    }),
    new HtmlWebpackPlugin({
      chunks: [ 'secciones-secciones' ],
      filename: path.resolve(__dirname, 'app/wm/secciones/secciones/index.html'),
      template: path.resolve(__dirname, 'fuente/wm/secciones/secciones/index.html'),
      hash: true
    }),
    new HtmlWebpackPlugin({
      chunks: [ 'secciones-autores' ],
      filename: path.resolve(__dirname, 'app/wm/secciones/autores/index.html'),
      template: path.resolve(__dirname, 'fuente/wm/secciones/autores/index.html'),
      hash: true
    }),
    new HtmlWebpackPlugin({
      chunks: [ 'contenidos' ],
      filename: path.resolve(__dirname, 'app/wm/contenidos/index.html'),
      template: path.resolve(__dirname, 'fuente/wm/contenidos/index.html'),
      hash: true
    }),
    //
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'wm/interfaz/css/[name].css',
      chunkFilename: 'wm/interfaz/css/[id].css'
    }),
    new FaviconsWebpackPlugin({
      // Your source logo
      logo: path.resolve(__dirname, 'fuente/wm/interfaz/img/logo.svg'),
      // The prefix for all image files (might be a folder or a name)
      prefix: 'wm/interfaz/iconos-app[hash:8]/',
      // Generate a cache file with control hashes and
      // don't rebuild the favicons until those hashes change
      persistentCache: true,
      // Inject the html into the html-webpack-plugin
      inject: true,
      // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
      background: '#1565c0',
      // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    })
  ]
}
