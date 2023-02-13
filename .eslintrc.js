/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    node: true
  },
  extends: ["@remix-run/eslint-config", "@remix-run/eslint-config/node"]
};
