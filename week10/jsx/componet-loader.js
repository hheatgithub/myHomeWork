let sfcparser = require("@vue/comiler-sfc");
let webpack = require("webpack");

module.exports = function(source) {
  let descriptor = sfcparser.parse(source, {
    sourceMap: false
  }).descriptor;
  let r = sfcparser.compileTemplate({
    filename: "example.vue",
    source: descriptor.template.content
  });

  console.log(webpack);
  return "";
};
