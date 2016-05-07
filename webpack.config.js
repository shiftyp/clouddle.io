var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var devFlagPlugin = new webpack.DefinePlugin({
	__DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
	//devtool: 'cheap-module-eval-source-map',
	devtool: 'inline-sourcemap',
	entry: [
		'./src/js/index.js'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/static/',
		filename: 'bundle.js',
		hot: true
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		//new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		devFlagPlugin//,
		//new ExtractTextPlugin('app.css')
	],
	module: {
		loaders: [
			{
				test: /node_modules[\\\/]auth0-lock[\\\/].*\.js$/,
				loaders: [
					'transform-loader/cacheable?brfs',
					'transform-loader/cacheable?packageify'
				]
			}, {
				test: /node_modules[\\\/]auth0-lock[\\\/].*\.ejs$/,
				loader: 'transform-loader/cacheable?ejsify'
			},
			{ test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
			{ test: /\.json$/, loaders: ['json-loader'] },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract('css-loader?module!cssnext-loader') }
		]
	},
	resolve: {
		extensions: ['', '.js', '.json']
	}
};
