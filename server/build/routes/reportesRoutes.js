"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportesControllers_1 = require("../controllers/reportesControllers");
const router = (0, express_1.Router)();
router.get('/', reportesControllers_1.getReport);
exports.default = router;
