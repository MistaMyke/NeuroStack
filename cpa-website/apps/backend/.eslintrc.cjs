const path = require('node:path');

module.exports = {
  extends: ['../../packages/eslint-config'],
  env: {
    node: true,
    jest: true
  },
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json')
      }
    }
  }
};
