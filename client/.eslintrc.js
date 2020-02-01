module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': [0],
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    'import/no-unresolved': 'off',
    'no-unused-expressions': ['error', { 'allowTernary': true }],
    'no-param-reassign': 0,
    'quote-props': ['error', 'consistent'],
    "vue/order-in-components": ["error", {
      "order": [
        "el",
        "name",
        "parent",
        "functional",
        ["delimiters", "comments"],
        ["components", "directives", "filters"],
        "extends",
        "mixins",
        "inheritAttrs",
        "model",
        ["props", "propsData"],
        "data",
        "computed",
        "watch",
        "LIFECYCLE_HOOKS",
        "methods",
        ["template", "render"],
        "renderError"
      ]
    }],
    'vue/no-parsing-error': [2, {
      "invalid-first-character-of-tag-name": false
    }],
    "import/no-dynamic-require": true,
    "global-require": 0
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
