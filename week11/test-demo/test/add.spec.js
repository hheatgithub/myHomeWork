import { add } from "../add.js";
var asset = require("assert");

describe(" addtest", function() {
  it("should retunr a+b", function() {
    asset.equal(add(1, 2), 3);
  });
});
