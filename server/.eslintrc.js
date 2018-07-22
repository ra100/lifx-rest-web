module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'babel-eslint',
  extends: [
    'plugin:prettier/recommended'
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    "semi": [2, "never"],
    "no-console": "off",
    "prettier/prettier": ["error", {
      "semi": false,
      "singleQuote": true
    }],
    "object-property-newline": ["error", {
      "ObjectExpression": "always",
      "ObjectPattern": {
        "multiline": true
      }
    }]
  }
}
