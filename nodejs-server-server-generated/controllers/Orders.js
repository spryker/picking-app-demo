'use strict';

var utils = require('../utils/writer.js');
var Orders = require('../service/OrdersService');

module.exports.ordersGET = function ordersGET (req, res, next) {
  Orders.ordersGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.ordersOrderReferenceGET = function ordersOrderReferenceGET (req, res, next) {
  var orderReference = req.swagger.params['orderReference'].value;
  Orders.ordersOrderReferenceGET(orderReference)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
