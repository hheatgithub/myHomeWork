var Generator = require("yeoman-generator");
module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.answers = null;
    // Next, add your custom code
    // this.option("babel"); // This method adds support for a `--babel` flag
  }

  async initPackage() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      }
    ]);

    const pkgJson = {
      name: this.answers.name,
      version: "1.0.0",
      description: "",
      main: "generators/app/index.js",
      scripts: {
        test: 'echo "Error: no test specified" && exit 1'
      },
      author: "",
      license: "ISC",
      dependencies: {},
      devDependencies: {
        eslint: "^3.15.0"
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
    this.addDependencies("vue");
    this.addDevDependencies("webpack");
    this.addDevDependencies("vue-loader");
    this.addDevDependencies("vue-template-compiler");
    this.addDevDependencies("vue-style-loader");
    this.addDevDependencies("css-loader");
    this.addDevDependencies("copy-webpack-plugin");
  }

  copyFiles() {
    this.fs.copyTpl(
      this.templatePath("HelloWorld.vue"),
      this.destinationPath("src/HelloWorld.vue")
    );

    this.fs.copyTpl(
      this.templatePath("webpack.config.js"),
      this.destinationPath("webpack.config.js")
    );

    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("src/index.html"),
      { title: this.answers.name }
    );

    this.fs.copyTpl(
      this.templatePath("main.js"),
      this.destinationPath("src/main.js")
    );
  }
};
