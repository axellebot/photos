const { VueLoaderPlugin } = require('vue-loader')
const babelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except')
const ModuleReplaceWebpackPlugin = require('module-replace-webpack-plugin')
const path = require('path')
const StyleLintPlugin = require('stylelint-webpack-plugin')

const SassGetGridConfig = require('./src/utils/SassGetGridConfig')

const appName = process.env.npm_package_name

module.exports = {
	entry: path.join(__dirname, 'src', 'main.js'),
	output: {
		path: path.resolve(__dirname, './js'),
		publicPath: '/js/',
		filename: `${appName}.js?v=[contenthash]`,
		chunkFilename: `${appName}.[name].js?v=[contenthash]`,
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['vue-style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
					'css-loader',
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							functions: {
								'get($keys)': SassGetGridConfig,
							},
						},
					},
				],
			},
			{
				test: /\.(js|vue)$/,
				use: 'eslint-loader',
				exclude: /node_modules/,
				enforce: 'pre',
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: babelLoaderExcludeNodeModulesExcept([
					'@essentials/request-timeout',
					'@nextcloud/event-bus',
					'camelcase',
					'hot-patcher',
					'semver',
					'webdav',
				]),
			},
			{
				test: /\.svg$/,
				// illustrations
				loader: 'svg-inline-loader',
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
		new StyleLintPlugin(),
		// patch webdav/dist/request.js
		new ModuleReplaceWebpackPlugin({
			modules: [{
				test: /request.js/,
				replace: './src/patchedRequest.js',
				exclude: [/patchedRequest.js$/],
			}],
		}),
	],
	resolve: {
		extensions: ['*', '.js', '.vue'],
		symlinks: false,
	},
}