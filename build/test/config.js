import vueLoaderConfig from '../webpack/vue-loader-config'

export default {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      }
    ]
  }
}
