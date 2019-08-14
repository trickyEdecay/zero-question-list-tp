(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function hello() {
  var abc = "123";
  console.log("hello ".concat(abc));
}

var _default = hello;
exports["default"] = _default;
},{}],2:[function(require,module,exports){
"use strict";

var _hello = _interopRequireDefault(require("./hello.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(function () {
  var a = 123;
  console.log("hello ".concat(a));
  (0, _hello["default"])();
})();
},{"./hello.js":1}]},{},[2]);
