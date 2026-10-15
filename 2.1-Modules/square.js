//square.js

//using CommonJS "exports"
// module.exports = class Square{

//using ES Modules
export default class Square{

    constructor(width){
        this.width = width;
    }

    area() {
        return this.width ** 2;
    }
}