"use strict";

require("core-js/stable");

require("regenerator-runtime/runtime");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _queries = _interopRequireDefault(require("./queries"));

var _Users = _interopRequireDefault(require("./controllers/Users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var port = 7321;
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.get('/', function (request, response) {
  response.json({
    info: 'Node.js, Express, and Postgres API'
  });
});
app.get('/users', _Users["default"].getAll);
app.get('/users/:id', _Users["default"].getOne);
app.post('/users', _queries["default"].createUser);
app.put('/users/:id', _queries["default"].updateUser);
app["delete"]('/users/:id', _queries["default"].deleteUser);
app.listen(port, function () {
  console.log("App running on port ".concat(port, "."));
});
