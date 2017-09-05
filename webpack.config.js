var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
	entry: {
		prysm: ['./src/js/prysm.js'],
		index: ['./src/js/index.js'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].min.js',
		library:'prysm',
		libraryTarget:'umd'
	},
	module:{
		loaders:[
			{test:/\.js$/, loader: 'babel-loader', exclude:/node_modules/}
		]
	},
	externals: {
		'prysm': 'prysm'
	},
	resolve: {
		extensions: [".js"]
	},
	plugins:[
		new HtmlWebpackPlugin({
			inject: false,
			template: "html/index.html",
			filename: "../index.html",
			ts:Date.now()
		}),
		new UglifyJsPlugin({
			compress: true
		})
	]
};
