"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloRoute = void 0;
const helloRoute = (app) => {
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
};
exports.helloRoute = helloRoute;
