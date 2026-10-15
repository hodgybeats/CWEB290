//circle.js

const { PI } = Math;

//Using CommonJS "exports"
// exports.area = (r) => PI * r ** 2;
//Using ES modules
export const area = (r) => PI * r ** 2;

//Using CommonJS "exports"
// exports.circumference = (r) => 2 * PI * r;
//Using ES modules
export const circumference = (r) => 2 * PI * r;
