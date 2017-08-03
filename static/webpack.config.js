var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
	entry: {
		app: ['./src/js/main.js']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: process.env.NODE_ENV === 'dev' ? '[name].js' : '[name].[hash].js'
	},
	module:{
		loaders:[
			{test:/\.js$/, loader: 'babel-loader', exclude:/node_modules/}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".jsx"]
	},
	plugins:[
		new HtmlWebpackPlugin({
			inject: false,
			template: "html/index.html",
			filename: "../../index.html",
			ts:Date.now()
		})
	]
};
