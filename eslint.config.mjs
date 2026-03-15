// eslint.config.mjs
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
  {
    files: ["**/*.ts", "**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
      "no-console": "warn", 
      "vue/no-unused-vars": "error", 
    },
  },
]);
