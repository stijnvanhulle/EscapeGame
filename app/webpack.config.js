const webpack = require(`webpack`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);

const extractCSS = new ExtractTextPlugin(`css/style.css`);

const publicPath = `/`;

const {entry, plugins} = require(`webpack-config-htmls`)();

const paths = [
  `./src/js/script.js`,
  `./src/css/style.css`
];

const config = {

  entry: paths,

  resolve: {
    extensions: [`.js`, `.jsx`, `.json`, `.html`, `.css`]
  },

  output: {
    path: `./server/public/`,
    filename: `js/[name].[hash].script.js`,
    publicPath
  },

  devtool: `sourcemap`,

  module: {

    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        loader: `babel`
      },
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        enforce: `pre`,
        loader: `eslint`
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract([`css`, `postcss`])
      },
      {
        test: /\.html$/,
        loader: `html`
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|mp3|mp4)$/i,
        loader: `url`,
        query: {
          limit: 1000,
          context: `./src`,
          name: `[path][name].[ext]`
        }
      }
    ]

  }
};

if(process.env.NODE_ENV === `production`) {


  config.entry = paths;

  config.plugins = [
    extractCSS,
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false
    }),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: `'production'`}
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        debug: false,
        minimize: true,
        postcss: require(`postcss-cssnext`),
        eslint: {
          fix: true
        }
      }
    })

  ];

  config.module.rules = [
    {
      test: /\.(jsx?)$/,
      exclude: /node_modules/,
      loader: `babel`
    },
    {
      test: /\.(jsx?)$/,
      exclude: /node_modules/,
      enforce: `pre`,
      loader: `eslint`
    },
    {
      test: /\.css$/,
      loader: extractCSS.extract([`css?minimize`, `postcss`])
    },
    {
      test: /\.html$/,
      loader: `html`
    },
    {
      test: /\.(jpe?g|png|gif|svg|woff2?|mp3|mp4)$/i,
      loader: `url`,
      query: {
        limit: 1000,
        name: `[path][name].[ext]`,
        context: `src`,
        publicPath
      }
    }
  ];

} else {

  config.plugins = [
    extractCSS,
    new webpack.LoaderOptionsPlugin({
      options: {
        debug: true,
        minimize: true,
        postcss: require(`postcss-cssnext`),
        eslint: {
          fix: true
        }
      }
    })

  ];

}

config.plugins = [...config.plugins, ...plugins];
config.entry = [...config.entry, ...entry];

module.exports = config;
