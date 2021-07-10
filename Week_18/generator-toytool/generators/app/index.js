const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.name = "";
  }

  async initPackage() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname, // Default to current folder name
      },
    ]);
    this.name = answers.name;
    const pkgJson = {
      name: this.name,
      version: "1.0.0",
      description: "",
      main: "generator/app/index.js",
      scripts: {
        build: "webpack",
        test: 'mocha --require @babel/register',
        coverage: "nyc mocha --require @babel/register"
      },
      author: "",
      license: "ISC",
      devDependencies: {},
      dependencies: {},
    };

    await this.addDependencies("vue");
    await this.addDevDependencies([
      "webpack",
      "webpack-cli",
      "vue-loader@15.9.5",
      "vue-template-compiler",
      "vue-style-loader",
      "css-loader",
      "copy-webpack-plugin",
      "mocha",
      "nyc",
      "@babel/core",
      "@babel/preset-env",
      "@babel/register",
      "@istanbuljs/nyc-config-babel",
      'babel-plugin-istanbul',
      'babel-loader'
    ]);

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }

  copyFiles() {
    this.fs.copyTpl(
      this.templatePath("HelloWorld.vue"),
      this.destinationPath("src/HelloWorld.vue"),
      {}
    );

    this.fs.copyTpl(
        this.templatePath("sample-test.js"),
        this.destinationPath("test/sample-test.js"),
        {}
    );

    this.fs.copyTpl(
      this.templatePath("webpack.config.js"),
      this.destinationPath("webpack.config.js"),
      {}
    );

    this.fs.copyTpl(
        this.templatePath(".babelrc"),
        this.destinationPath(".babelrc"),
        {}
    );

    this.fs.copyTpl(
        this.templatePath(".nycrc"),
        this.destinationPath(".nycrc"),
        {}
    );

    this.fs.copyTpl(
      this.templatePath("main.js"),
      this.destinationPath("src/main.js"),
      {}
    );

    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("src/index.html"),
      { title: this.name }
    );
  }
};
