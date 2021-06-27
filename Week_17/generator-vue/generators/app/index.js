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
      script: {
        test: 'echo "Error: no test specified" && exit 1',
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
      "vue-loader",
      "vue-template-compiler",
      "vue-style-loader",
      "css-loader",
      "copy-webpack-plugin",
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
      this.templatePath("webpack.config.js"),
      this.destinationPath("webpack.config.js"),
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
