import HelloWorld from "./HelloWorld.vue";
import vue from "vue";

new vue({
  el: "#app",
  render: h => h(HelloWorld)
});
