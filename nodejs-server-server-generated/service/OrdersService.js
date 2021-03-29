'use strict';


/**
 * Get a list of orders
 *
 * returns OrderCollection
 **/
exports.ordersGET = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Find an order by ID
 *
 * orderReference String Order reference of an order to be fetched
 * returns Order
 **/
exports.ordersOrderReferenceGET = function(orderReference) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "number_of_items" : 5,
  "order_reference" : "DE_123456789",
  "created_at" : "2021-01-23T13:42:00+0000",
  "cusotmer_reference" : "DE_987654321",
  "id" : "DE_123456789",
  "grand_total_formatted" : "$25.41",
  "status" : "ready for picking"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

