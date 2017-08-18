import { addAlias } from 'module-alias'
import { join } from 'path'
import { readFileSync } from 'fs'
import { register } from 'vuegister'
import jsdom from 'jsdom-global'
import vueNode from 'vue-node'
import { config } from 'vue'
import webpackConfig from '../webpack/base'

const indexFile = readFileSync(join(__dirname, '../../src/index.html'), 'utf8')
const { alias } = webpackConfig.resolve

jsdom(indexFile)

Object.keys(alias).forEach(key => addAlias(key, alias[key]))

if (process.env.NODE_ENV === 'test') {
  vueNode(join(__dirname, 'config.js'))
} else {
  addAlias('vue', 'vue/dist/vue.min')
  register()
}

config.productionTip = false
