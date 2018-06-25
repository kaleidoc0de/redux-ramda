module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "**/src/*.js",
    "!**/src/index.js",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};
