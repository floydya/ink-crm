const { useBabelRc, override, addLessLoader, fixBabelImports } = require("customize-cra")
const { getThemeVariables } = require("antd/dist/theme")

module.exports = override(
  useBabelRc(),
  fixBabelImports("antd", {
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    modifyVars: {
      ...getThemeVariables({
        dark: true,
        compact: true
      }),
      "@primary-color": "#fa541c"
    },
    javascriptEnabled: true
  })
)