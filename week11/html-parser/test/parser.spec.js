import { parseHTML } from "../src/parser.js";
var asset = require("assert");

describe(" parseHTML", function() {
  it("<a></a>", function() {
    const tree = parseHTML("<a></a>");
    asset.equal(tree.children[0].tagName, "a");
    asset.equal(tree.children[0].children.length, 0);
  });

  it("<A></A>", function() {
    const tree = parseHTML("<A></A>");
    asset.equal(tree.children[0].tagName, "A");
    asset.equal(tree.children[0].children.length, 0);
  });

  it("<A />", function() {
    const tree = parseHTML("<A />");
    asset.equal(tree.children[0].tagName, "A");
    asset.equal(tree.children[0].children.length, 0);
  });
  it("<a href='//time.geekbang.org'></a>", function() {
    const tree = parseHTML("<a href ='//time.geekbang.org' ></a>");
    console.log("tree=", tree, "\ntree.children[0]=", tree.children[0]);
    if (tree.children[0]) {
      asset.equal(tree.children.length, 1);
      asset.equal(tree.children[0].children.length, 0);
    }
  });

  it("<a href id></a>", function() {
    const tree = parseHTML("<a href = 'abc' id></a>");

    if (tree.children[0]) {
      asset.equal(tree.children.length, 1);
      asset.equal(tree.children[0].children.length, 0);
    }
  });

  it("<a  id = 123></a>", function() {
    const tree = parseHTML("<a id = 123></a>");

    if (tree.children[0]) {
      asset.equal(tree.children.length, 1);
      asset.equal(tree.children[0].children.length, 0);
    }
  });

  it("<br />", function() {
    const tree = parseHTML("<br />");
    console.log("tree=", tree);
    if (tree.children[0]) {
      asset.equal(tree.children.length, 1);
      asset.equal(tree.children[0].children.length, 0);
    }
  });

  it("<br/>", function() {
    const tree = parseHTML("<br/>");
    console.log("tree=", tree);
    if (tree.children[0]) {
      asset.equal(tree.children.length, 1);
      asset.equal(tree.children[0].children.length, 0);
    }
  });

  it('<a  id = "123"></a>', function() {
    const tree = parseHTML('<a  id = "123"></a>');
    console.log("tree=", tree);
    if (tree.children[0]) {
      asset.equal(tree.children.length, 1);
      asset.equal(tree.children[0].children.length, 0);
    }
  });

  it('<a  id = "123"/>', function() {
    const tree = parseHTML('<a  id = "123"/>');
    console.log("tree=", tree);
    if (tree.children[0]) {
      asset.equal(tree.children.length, 1);
      asset.equal(tree.children[0].children.length, 0);
    }
  });

  it("<a  id = '123' />", function() {
    const tree = parseHTML("<a  id = '123' />");
    console.log("tree=", tree);
    if (tree.children[0]) {
      asset.equal(tree.children.length, 1);
      asset.equal(tree.children[0].children.length, 0);
    }
  });

  it("<>", function() {
    const tree = parseHTML("<>");
    console.log("tree=", tree);

    asset.equal(tree.children.length, 1);
    asset.equal(tree.children[0].type, "text");
  });
});
