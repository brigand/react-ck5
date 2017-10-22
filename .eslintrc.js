module.exports = {
  parser: "babel-eslint",
  extends: "airbnb",
  rules: {
    "react/jsx-filename-extension": 0,
    "quotes": 0,
    "react/sort-comp": 0,
    "import/no-extraneous-dependencies": 0,
    "no-console": 0,
  },
  env: {
    browser: true,
    node: true,
  },
};
