module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{css,js}"
  ],
  "swSrc": "public/js/sw.js",
  "swDest": "resources/assets/js/service-worker.js",
  "globIgnores": [
    "../workbox-cli-config.js"
  ]
};
