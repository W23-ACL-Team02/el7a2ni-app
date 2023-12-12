"use strict";

var express = require('express');

var medicineModel = require('../models/medicine.js');

var _require = require('mongoose'),
    mongoose = _require["default"];

var router = express.Router();
router.post('/add', function _callee(req, res) {
  var _req$body, name, details, activeIngredients, quantity, price, splitIngredients, jsonIngredients, index, exists, medicine;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, details = _req$body.details, activeIngredients = _req$body.activeIngredients, quantity = _req$body.quantity, price = _req$body.price;
          splitIngredients = activeIngredients.split("|");
          jsonIngredients = "[";

          for (index = 0; index < splitIngredients.length; index++) {
            jsonIngredients += "\"" + splitIngredients[index] + "\",";
          }

          jsonIngredients = jsonIngredients.substring(0, jsonIngredients.length - 1) + "]";
          jsonIngredients = JSON.parse(jsonIngredients);
          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(medicineModel.findOne({
            name: name
          }));

        case 9:
          exists = _context.sent;

          if (!(exists != null)) {
            _context.next = 13;
            break;
          }

          res.status(400).send("".concat(name, " is already in the database"));
          return _context.abrupt("return");

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(medicineModel.create({
            name: name,
            details: details,
            category: category,
            activeIngredients: jsonIngredients,
            quantity: quantity,
            price: price
          }));

        case 15:
          medicine = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(medicine.save());

        case 18:
          res.status(200).send("".concat(name, " created successfully!"));
          _context.next = 24;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](6);
          res.status(400).json({
            err: _context.t0.message
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 21]]);
});
router.put('/edit', function _callee2(req, res) {
  var _req$body2, id, name, details, category, activeIngredients, quantity, price, splitIngredients, jsonIngredients, index, updatedMedicine;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, id = _req$body2.id, name = _req$body2.name, details = _req$body2.details, category = _req$body2.category, activeIngredients = _req$body2.activeIngredients, quantity = _req$body2.quantity, price = _req$body2.price;
          splitIngredients = activeIngredients.split("|");
          jsonIngredients = "[";

          for (index = 0; index < splitIngredients.length; index++) {
            jsonIngredients += "\"" + splitIngredients[index] + "\",";
          }

          jsonIngredients = jsonIngredients.substring(0, jsonIngredients.length - 1) + "]";
          activeIngredients = JSON.parse(jsonIngredients);
          _context2.prev = 6;
          _context2.next = 9;
          return regeneratorRuntime.awrap(medicineModel.findOneAndUpdate({
            _id: id
          }, {
            _id: id,
            name: name,
            details: details,
            category: category,
            activeIngredients: activeIngredients,
            quantity: quantity,
            price: price
          }));

        case 9:
          updatedMedicine = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(updatedMedicine.save());

        case 12:
          res.status(200).send("Updated ".concat(name, " successfully"));
          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](6);
          res.status(400).json({
            err: _context2.t0.message
          });

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 15]]);
});
router["delete"]('/delete', function _callee3(req, res) {
  var name, exists, deletedMedicine;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          name = req.body.name;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(medicineModel.find({
            name: name
          }));

        case 4:
          exists = _context3.sent;

          if (!(exists == null)) {
            _context3.next = 8;
            break;
          }

          res.status(400).send("".concat(name, " is not in the database"));
          return _context3.abrupt("return");

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(medicineModel.deleteOne({
            name: name
          }));

        case 10:
          deletedMedicine = _context3.sent;
          res.status(200).send("Deleted ".concat(name, " successfully"));
          _context3.next = 17;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](1);
          res.status(400).json({
            err: _context3.t0.message
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 14]]);
});
router["delete"]('/nuke', function _callee4(req, res) {
  var medicine;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(medicineModel.deleteMany());

        case 3:
          medicine = _context4.sent;
          res.status(200).send("nuked the model \uD83D\uDCA3");
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          res.status(400).json({
            err: _context4.t0.message
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get('/find', function _callee5(req, res) {
  var searchKey, medicine;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          searchKey = req.query.search;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(medicineModel.find({
            "$or": [{
              name: {
                "$regex": searchKey,
                "$options": "i"
              }
            }, {
              activeIngredients: {
                "$regex": searchKey,
                "$options": "i"
              }
            }]
          }));

        case 4:
          medicine = _context5.sent;
          res.render("allMedicine", {
            medicine: medicine
          });
          _context5.next = 11;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](1);
          res.status(400).json({
            err: _context5.t0.message
          });

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
router.get('/view', function _callee6(req, res) {
  var id, medicine, activeIngredients, activeIngredientsString, index;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = new mongoose.Types.ObjectId(req.query.id);
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(medicineModel.findOne({
            _id: id
          }));

        case 4:
          medicine = _context6.sent;
          activeIngredients = JSON.stringify(medicine._doc.activeIngredients);
          activeIngredients = activeIngredients.substring(1, activeIngredients.length - 1); //remove []

          activeIngredients = activeIngredients.split(",");
          activeIngredientsString = "";

          for (index = 0; index < activeIngredients.length; index++) {
            activeIngredientsString += activeIngredients[index].substring(1, activeIngredients[index].length - 1) + "|"; //remove ""
          }

          activeIngredientsString = activeIngredientsString.substring(0, activeIngredientsString.length - 1); //for the extra | at the end

          medicine._doc.activeIngredients = activeIngredientsString;
          res.render("editMedicine", {
            medicine: medicine
          });
          _context6.next = 18;
          break;

        case 15:
          _context6.prev = 15;
          _context6.t0 = _context6["catch"](1);
          res.status(400).json({
            err: _context6.t0.message
          });

        case 18:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 15]]);
});
router.get('/', function _callee7(req, res) {
  var medicine, categories;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(medicineModel.find());

        case 3:
          medicine = _context7.sent;
          _context7.next = 6;
          return regeneratorRuntime.awrap(medicineModel.find().distinct("category"));

        case 6:
          categories = _context7.sent;
          res.render("allMedicine", {
            medicine: medicine,
            categories: categories
          });
          _context7.next = 13;
          break;

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          res.status(400).json({
            err: _context7.t0.message
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = router;