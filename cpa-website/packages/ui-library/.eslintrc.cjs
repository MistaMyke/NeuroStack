
const path = require('node:path');

module.exports = {
  extends: ['@cpa/eslint-config', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json')
      }
    }
  }
};
