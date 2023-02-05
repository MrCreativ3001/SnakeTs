const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/js/game.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "bundle.js",
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'public'),
		},
		compress: true,
		port: 8080,
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				exclude: /node_modules/,
				use: [
					{ loader: "ts-loader" }
				]
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	],
}