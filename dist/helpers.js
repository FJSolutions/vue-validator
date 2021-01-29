"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrap = void 0;
const vue_1 = require("vue");
const unwrap = (value) => {
    return vue_1.isRef(value) ? value.value : value;
};
exports.unwrap = unwrap;
