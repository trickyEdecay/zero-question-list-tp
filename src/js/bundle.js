(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function sendRequest(ajaxObj) {
  return new Promise(function (resolve, reject) {
    ajaxObj.success = function (response) {
      resolve(response);
    };

    ajaxObj.error = function (response) {
      reject(response);
    };

    $.ajax(ajaxObj);
  });
}

sendRequest({
  url: "__PUBLIC__/index/user/a",
  type: "post"
}).then(function (response) {
  console.log(response);
  return sendRequest({
    url: "__PUBLIC__/index/user/b",
    type: "post"
  });
})["catch"](function (response) {
  return new Promise(function (resolve, reject) {
    reject(response);
  });
}).then(function (response) {
  console.log(response);
  return sendRequest({
    url: "__PUBLIC__/index/user/c",
    type: "post"
  });
})["catch"](function (response) {
  return new Promise(function (resolve, reject) {
    reject(response);
  });
}).then(function (response) {
  console.log(response);
})["catch"](function (response) {
  console.log(response);
  return new Promise(function (resolve, reject) {
    reject(response);
  });
});

_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var response;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return sendRequest({
            url: "__PUBLIC__/index/user/a",
            type: "post"
          });

        case 2:
          response = _context.sent;
          console.log(response);
          _context.next = 6;
          return sendRequest({
            url: "__PUBLIC__/index/user/b",
            type: "post"
          });

        case 6:
          response = _context.sent;
          console.log(response);
          _context.next = 10;
          return sendRequest({
            url: "__PUBLIC__/index/user/c",
            type: "post"
          });

        case 10:
          response = _context.sent;
          console.log(response);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();

(function () {
  // 分页的当前页
  var currentPage = 1; // 提交一个新问题的逻辑

  $("#submit-question-form").submit(function (e) {
    e.preventDefault();
    $("#error-text").html("");

    if ($("#question-input").val().trim() === "") {
      $("#error-text").html("提交的问题不能为空");
      return;
    }

    $.ajax({
      url: "__PUBLIC__/index/question/createQuestion",
      type: "post",
      data: {
        question: $("#question-input").val(),
        isAnonymous: $("#is-anonymous").is(":checked")
      },
      success: function success(response) {
        response = JSON.parse(response);

        if (response.code !== "0000") {
          $("#error-text").html(response.msg);
          return;
        }

        var question = response.data;
        getQuestionList(currentPage);
        $("#question-input").val("");
        bindCloseBtnEvent(true);
      },
      error: function error() {
        $("#error-text").html("好像我与服务器分手了TAT");
      }
    });
  }); // 给删除按钮绑定事件

  function bindCloseBtnEvent() {
    var onlyLast = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var $closeBtn = $(".close-btn");

    if (onlyLast) {
      $closeBtn = $closeBtn.last();
    }

    $closeBtn.click(function () {
      var _this = this;

      $("#error-text").html("");
      var id = $(this).data("id"); // 删除问题的逻辑

      $.ajax({
        url: "api/questionHandler/deleteQuestion",
        type: "post",
        data: {
          id: id
        },
        success: function success(response) {
          response = JSON.parse(response);

          if (response.code !== "0000") {
            $("#error-text").html(response.msg);
            return;
          }

          getQuestionList(currentPage);
          $(_this).parent().remove();
        }
      });
    });
  }

  bindCloseBtnEvent(); // 登出的逻辑

  $("#logout-btn").click(function () {
    $.ajax({
      url: "__PUBLIC__/index/user/logout",
      type: "post",
      success: function success(data) {
        location.href = "__PUBLIC__/login";
      }
    });
  });

  function getQuestionList() {
    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    $.ajax({
      url: "__PUBLIC__/index/question/getAllQuestions",
      type: "get",
      data: {
        page: page
      },
      success: function success(response) {
        response = JSON.parse(response);

        if (response.code !== "0000") {
          $("#error-text").html(response.msg);
          return;
        }

        renderQuestionList(response.data.questions);
        generatePaginationBtn(page, response.data.pageCount);
      },
      error: function error() {
        $("#error-text").html("好像我与服务器分手了TAT");
      }
    });
  }

  function renderQuestionList(data) {
    $("#question-list").html("");
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var question = _step.value;
        $("#question-list").append("\n            <div class=\"question-item\">\n                <p class=\"content\">".concat(question.question, "</p>\n                <p class=\"time\">").concat(question.time, " by ").concat(question.userName, "</p>\n                <button type=\"button\" class=\"close close-btn\" aria-label=\"Close\" data-id=\"").concat(question.id, "\"><span aria-hidden=\"true\">&times;</span></button>\n            </div>\n            "));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    bindCloseBtnEvent();
  } // 页面加载完成的时候请求问题列表


  $(window).on("load", function () {
    $.ajax({
      url: "__PUBLIC__/index/user/get_nick_name",
      type: "get",
      success: function success(response) {
        // 验证一下这个用户到底登录了没有
        response = JSON.parse(response);

        if (response.code !== "0000") {
          location.href = "__PUBLIC__/login";
          return;
        }

        $("#nick-name").html("".concat(response.data, "<span class=\"caret\"></span>"));
        var currentPageRegex = /(page)=(\w+)/.exec(location.search);

        if (!currentPageRegex) {
          currentPage = 1;
        } else {
          currentPage = Number(currentPageRegex[2]);
        }

        getQuestionList(currentPage);
      }
    });
  });
  /**
   * 生成分页器上面的数字按钮数组
   * @param currentPage 当前页面。这个数字必须大于等于1
   * @param pageCount 总共有多少个页面
   * @param paginationBtnCount 总共需要多少个分页按钮，默认是5个
   * @returns {Array|*[]} 返回数字按钮的数组
   */

  function generatePaginationNum(currentPage, pageCount) {
    var paginationBtnCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
    var result = [];

    if (paginationBtnCount >= pageCount) {
      for (var i = 0; i < pageCount; i++) {
        result.push(i + 1);
      }

      return result;
    } // 1. 先生成一个初始数组
    // 当前页之前有多少个按钮


    var btnCountBefore = Math.floor((paginationBtnCount - 1) / 2); // 当前页之后有多少个按钮

    var btnCountAfter = Math.ceil((paginationBtnCount - 1) / 2);

    for (var _i = currentPage - btnCountBefore; _i < currentPage; _i++) {
      result.push(_i);
    }

    result.push(currentPage);

    for (var _i2 = currentPage + 1; _i2 <= currentPage + btnCountAfter; _i2++) {
      result.push(_i2);
    } // 2. 向后滑动窗口


    if (result[0] < 1) {
      var offset = 1 - result[0];

      for (var _i3 = 0; _i3 < paginationBtnCount; _i3++) {
        result[_i3] += offset;
      }
    } // 3. 向前滑动窗口


    if (result[paginationBtnCount - 1] > pageCount) {
      var _offset = result[paginationBtnCount - 1] - pageCount;

      for (var _i4 = 0; _i4 < paginationBtnCount; _i4++) {
        result[_i4] -= _offset;
      }
    } // 4. 切割数量


    result = result.slice(0, pageCount);
    return result;
  }

  function generatePaginationBtn(currentPage, pageCount) {
    var paginationNumArr = generatePaginationNum(currentPage, pageCount);
    $("#pagination").html("");
    $("#pagination").append('\
        <li class="pagination-prev-btn">\
            <a href="#" aria-label="Previous">\
                <span aria-hidden="true">&laquo;</span>\
            </a>\
        </li>');
    $("#pagination").append("\n        <li class=\"pagination-prev-btn\">\n            <a href=\"#\" aria-label=\"Previous\">\n                <span aria-hidden=\"true\">&laquo;</span>\n            </a>\n        </li>\n        ");

    for (var i = 0; i < paginationNumArr.length; i++) {
      $("#pagination").append("\n            <li class=\"pagination-num-btn\" data-page=\"".concat(paginationNumArr[i], "\"><a href=\"#\">").concat(paginationNumArr[i], "</a></li>\n            "));
    }

    $("#pagination").append("\n        <li class=\"pagination-next-btn\">\n            <a href=\"#\" aria-label=\"Next\">\n                <span aria-hidden=\"true\">&raquo;</span>\n            </a>\n        </li>");
    $(".pagination-num-btn").click(function () {
      location.href = "index?page=".concat($(this).data("page"));
    });
    $(".pagination-prev-btn").click(function () {
      if (currentPage !== 1) {
        location.href = "index?page=".concat(currentPage - 1);
      }
    });
    $(".pagination-next-btn").click(function () {
      if (currentPage !== pageCount) {
        location.href = "index?page=".concat(currentPage + 1);
      }
    });
  }
})();

},{}]},{},[1]);
