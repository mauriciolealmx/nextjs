module.exports = {
  parser: 'babel-eslint',
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
  },
};
