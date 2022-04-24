module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      modules: true
    }
  },
  rules: {
    "indent": "off",
    "object-curly-spacing": ["error", "always"],
    "@typescript-eslint/indent": [
      "error",
      "tab",
      {
        "ignoredNodes": [
          "FunctionExpression > .params[decorators.length > 0]",
          "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
          "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key"
        ]
      }
    ],
    "new-cap": "off",
    "no-useless-constructor": "off",
    "no-empty-function": "off",
    "no-unused-vars": "off",
    "no-invalid-this": "off",
    "multiline-ternary": 0,
    "curly": ["error", "multi-line"],
    "lines-between-class-members": "off",
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
  },
  extends: [
    "eslint-config-codesupport"
  ],
};