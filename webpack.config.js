const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {

	entry: {
		inicio: './fuente/interfaz/js/inicio.js',
		articulos: './fuente/interfaz/js/articulos.js',
		articulo: './fuente/interfaz/js/articulo.js',
		categoria: './fuente/interfaz/js/categoria.js',
		busqueda: './fuente/interfaz/js/busqueda.js',
		cmsEditor: './fuente/interfaz/js/cmsEditor.js',
		'wm-login': './fuente/interfaz/js/wm-login.js',
		'wm-inicio': './fuente/interfaz/js/wm-inicio.js',
		'wm-secciones-indice': './fuente/interfaz/js/wm-secciones-indice.js',
		'wm-secciones-articulo': './fuente/interfaz/js/wm-secciones-articulo.js',
		'wm-secciones-categorias': './fuente/interfaz/js/wm-secciones-categorias.js',
		'wm-secciones-secciones': './fuente/interfaz/js/wm-secciones-secciones.js',
		'wm-secciones-autores': './fuente/interfaz/js/wm-secciones-autores.js',
		'wm-contenidos': './fuente/interfaz/js/wm-contenidos.js',
		'wm-push': './fuente/interfaz/js/wm-push.js'
	},
	output: {
		filename: 'interfaz/js/[name].js',
		path: path.resolve(__dirname, 'app')
	},

	mode: "development",
	devtool: 'inline-source-map',

	//mode: "production",
	//devtool: '',
	//devtool: 'source-map',

/*	devServer: {
		contentBase: path.join(__dirname, 'app'),
		port: 9000
	},
*/	module: {
		rules: [
			{
				test: /\.svg$/,
				//test: /ckeditor5-.*icons.*\.svg$/,
				use: [ 'raw-loader' ]
			},
			{
				test: /ckeditor5-.*\.css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							//singleton: true
						}
					},
					{
						loader: 'postcss-loader',
						options: styles.getPostCssConfig( {
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
						loader: MiniCssExtractPlugin.loader,
						options: {
							//publicPath: '../'
						}
					},
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|wm-ckeditor|cmsCkeditor\.js)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["babel-preset-env"]
					}
				}
			},
			{
				test:  /\.html$/,
				use: {
					loader: 'html-loader',
					options: {
						//minimize: true,
						minimize: false,
						interpolate: true			// Para usar ${require('../comun/footer.html')} en las plantillas html
					}
				}
			},
			{
				test: /\.(png|jpg|gif)$/,
				//test: /\.(png|jpg|gif|svg)$/,
				//exclude: /(@ckeditor)/,
				use: [
					{
						loader: 'file-loader',
						options: {
							//name: '/interfaz/img/[name]_[hash:7].[ext]'			// Así queda en img src
							name: '/interfaz/img/[name].[ext]'
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
				parallel: true
				//sourceMap: true // set to true if you want JS source maps
			}),
			new OptimizeCSSAssetsPlugin({})
		]
/*		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'terceros',
					chunks: 'all'
				}
			}
		}
*/
	},
	plugins: [
//		new BundleAnalyzerPlugin(),
		new CKEditorWebpackPlugin( {
			// See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
			language: 'en'
		}),
		//
		new HtmlWebpackPlugin({
			chunks: [ 'inicio' ],
			filename: path.resolve(__dirname, 'app/index.html'),
			template: path.resolve(__dirname, 'fuente/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'articulos' ],
			filename: path.resolve(__dirname, 'app/articulos/index.html'),
			template: path.resolve(__dirname, 'fuente/articulos/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'articulo' ],
			filename: path.resolve(__dirname, 'app/articulo/index.html'),
			template: path.resolve(__dirname, 'fuente/articulo/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'categoria' ],
			filename: path.resolve(__dirname, 'app/categoria/index.html'),
			template: path.resolve(__dirname, 'fuente/categoria/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'busqueda' ],
			filename: path.resolve(__dirname, 'app/busqueda/index.html'),
			template: path.resolve(__dirname, 'fuente/busqueda/index.html'),
			hash: true
		}),
		//
		new HtmlWebpackPlugin({
			chunks: [ 'wm-login' ],
			filename: path.resolve(__dirname, 'app/wm/login/index.html'),
			template: path.resolve(__dirname, 'fuente/wm/login/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'wm-inicio' ],
			filename: path.resolve(__dirname, 'app/wm/index.html'),
			template: path.resolve(__dirname, 'fuente/wm/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'wm-secciones-indice' ],
			filename: path.resolve(__dirname, 'app/wm/secciones/indice/index.html'),
			template: path.resolve(__dirname, 'fuente/wm/secciones/indice/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'wm-secciones-articulo' ],
			filename: path.resolve(__dirname, 'app/wm/secciones/articulo/index.html'),
			template: path.resolve(__dirname, 'fuente/wm/secciones/articulo/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'wm-secciones-categorias' ],
			filename: path.resolve(__dirname, 'app/wm/secciones/categorias/index.html'),
			template: path.resolve(__dirname, 'fuente/wm/secciones/categorias/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'wm-secciones-secciones' ],
			filename: path.resolve(__dirname, 'app/wm/secciones/secciones/index.html'),
			template: path.resolve(__dirname, 'fuente/wm/secciones/secciones/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'wm-secciones-autores' ],
			filename: path.resolve(__dirname, 'app/wm/secciones/autores/index.html'),
			template: path.resolve(__dirname, 'fuente/wm/secciones/autores/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'wm-contenidos' ],
			filename: path.resolve(__dirname, 'app/wm/contenidos/index.html'),
			template: path.resolve(__dirname, 'fuente/wm/contenidos/index.html'),
			hash: true
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'wm-push' ],
			filename: path.resolve(__dirname, 'app/wm/push/index.html'),
			template: path.resolve(__dirname, 'fuente/wm/push/index.html'),
			hash: true
		}),
		//
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: 'interfaz/css/[name].css',
			chunkFilename: 'interfaz/css/[id].css'
		}),
		new ServiceWorkerWebpackPlugin({
			entry: path.join(__dirname, 'fuente/sw.js'),
			filename: 'sw.js',
			excludes: ['*']
		})
	]
};
