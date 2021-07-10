var assert = require("assert");
import { parseHTML } from "../src/parser.js";
console.log(parseHTML);

describe("parse html:", function () {
  it("<a></a>", function () {
    let tree = parseHTML("<a></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a href='//time.geekbang.com'></a>", function () {
    let tree = parseHTML("<a href='//time.geekbang.com'></a>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a href ></a>", function () {
    let tree = parseHTML("<a href ></a>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a href id></a>", function () {
    let tree = parseHTML("<a href id></a>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href="abc" id></a>', function () {
    let tree = parseHTML('<a href="abc" id></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a href=abc></a>", function () {
    let tree = parseHTML("<a href=abc></a>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<img src=baidu.com/>", function () {
    let tree = parseHTML("<img src=baidu.com/>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<img src='baidu.com'/>", function () {
    let tree = parseHTML("<img src='baidu.com'/>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a />", function () {
    let tree = parseHTML("<a />");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<A /> upper case", function () {
    let tree = parseHTML("<A />");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<>", function () {
    let tree = parseHTML("<>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].type, "text");
  });
});
