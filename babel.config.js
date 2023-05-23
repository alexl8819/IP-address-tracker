module.exports = {
  "presets": [
    "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        "runtime": "automatic"
      }
    ]
  ],
  "plugins": [
    [
      "@compiled/babel-plugin",
      {
        "importReact": true,
        "cache": true
      }
    ]
  ]
};
