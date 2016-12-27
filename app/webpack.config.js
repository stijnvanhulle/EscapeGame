/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-12T15:57:56+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-27T23:11:43+01:00
* @License: stijnvanhulle.be
*/

// changed some loader syntax after reading
// https://webpack.js.org/how-to/upgrade-from-webpack-1/

const path = require('path');

const webpack = require('webpack');
const {UglifyJsPlugin} = webpack.optimize;

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const {entry, plugins} = require(`webpack-config-htmls`)();

const extractCSS = new ExtractTextWebpackPlugin(`css/style.css`);

// change for production build on different server path
const publicPath = '/';

// hard copy assets folder for:
// - srcset images (not loaded through html-loader )
// - json files (through fetch)
// - fonts via WebFontLoader

const copy = new CopyWebpackPlugin([
  {
    from: './src/assets',
    to: 'assets'
  }
], {ignore: ['.DS_Store']});

const config = {

  entry: [
    './src/sass/style.scss', './src/js/index.js'
  ],

  resolve: {
    modules: [
      path.resolve('./src/js'), path.resolve('./node_modules')
    ],
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.html',
      '.scss',
      '.css'
    ]
  },

  output: {
    path: path.join(__dirname, 'server', 'public'),
    filename: 'js/[name].[hash].js',
    publicPath
  },

  devtool: 'source-map', // or "inline-source-map"

  module: {
  noParse: [],
    rules: [
      {
        test: /\.css$/,
        loader: extractCSS.extract({fallbackLoader: "style?sourceMap", loader: "css?sourceMap"})
      }, {
        test: /\.scss$/,
        loader: extractCSS.extract({fallbackLoader: 'style?sourceMap', loader: 'css?sourceMap!sass?sourceMap'})
      }, {
        test: /\.html$/,
        loader: 'html',
        options: {
          attrs: ['audio:src', 'img:src', 'video:src', 'source:srcset'] // read src from video, img & audio tag
        }
      }, {
        test: /\.(jsx?)$/,
        exclude: [
          path.resolve(__dirname, 'node_modules/'),
          'src/js/compatibility'
        ],
        use: [
          {
            loader: 'babel'
          }, {
            loader: 'eslint',
            options: {
              fix: true,
              cacheDirectory: true
            }
          }
        ]
      }, {
        test: /\.(svg|png|jpe?g|gif|webp)$/,
        loader: 'url',
        options: {
          limit: 1000, // inline if < 1 kb
          context: './src',
          name: '[path][name].[ext]'
        }
      }, {
        test: /\.(mp3|mp4)$/,
        loader: 'file',
        options: {
          context: './src',
          name: '[path][name].[ext]'
        }
      }
    ]

  },



  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    copy,
    new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery"})
  ]

};

if (process.env.NODE_ENV === 'production') {

  //image optimizing
  config.module.rules.push({test: /\.(svg|png|jpe?g|gif)$/, loader: 'image-webpack', enforce: 'pre'});

  config.devtool = '';

  config.module.rules[0] = {
    test: /\.css$/,
    loader: ExtractTextWebpackPlugin.extract({fallbackLoader: "style?minimize", loader: "css?minimize"})

  };
  config.module.rules[1] = {
    test: /\.scss$/,
    loader: ExtractTextWebpackPlugin.extract({fallbackLoader: 'style?minimize', loader: 'css?minimize!sass?minimize'})
  };

  config.plugins = [
    ...config.plugins,
    new ExtractTextWebpackPlugin({filename: 'css/[name].css', disable: false, allChunks: true}),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: "'production'"
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      comments: false,
      compress: {
        warnings: false
      },
      beautify: false
    })

  ];

} else {
  //config.devtool = 'inline-sourcemap';
  config.plugins = [
    ...config.plugins,
    extractCSS
  ];
}

config.plugins = [
  ...config.plugins,
  ...plugins
];
config.entry = [
  ...config.entry,
  ...entry
];

module.exports = config;
