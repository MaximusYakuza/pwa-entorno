// workbox-config.cjs
module.exports = {
  globDirectory: "dist/",
  globPatterns: ["**/*.{js,css,html,png,svg}"],
  swDest: "dist/sw.js",
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  sourcemap: false,
};
