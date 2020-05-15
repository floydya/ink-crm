const { useBabelRc, override, addLessLoader } = require("customize-cra")
const lessToJs = require('less-vars-to-js')
const fs = require('fs');

const paletteLess = fs.readFileSync('./node_modules/antd/es/style/themes/dark.less', 'utf8');
const palette = lessToJs(paletteLess, {resolveVariables: true, stripPrefix: true});

module.exports = override(
  useBabelRc(),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      ...palette,
      "@primary-color": "#00ff00"
    }
  })
)