"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const routers_1 = __importDefault(require("./routers"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({
    limit: '50mb'
}));
app.use(express_1.default.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: '50mb'
}));
app.use((0, cookie_parser_1.default)());
const Port = process.env.APP_PORT || 8080;
app.use('/api', routers_1.default);
app.get('/healthcheck', (req, res) => {
    res.send('OK');
});
app.listen(Port, () => {
    console.log(['Info'], `${process.env.APP_NAME}`, `Server started on port ${Port}`);
});
