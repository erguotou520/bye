module.exports = {
  root: true,
  // https://github.com/vuejs/eslint-config-vue
  extends: 'vue',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    "no-sequences": [0],
    "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0
  },
  globals: {
    "Notification": true,
    "it": true,
    "describe": true
  }
}
