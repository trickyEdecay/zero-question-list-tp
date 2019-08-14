"use strict";

var _hello = _interopRequireDefault(require("./hello.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(function () {
  var a = 123;
  console.log("hello ".concat(a));
  (0, _hello["default"])();
})();