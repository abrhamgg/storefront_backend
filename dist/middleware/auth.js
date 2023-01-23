"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAuthToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(400).json({
                message: "Unauthorized, please pass in a token"
            });
        }
        const token = authorizationHeader?.split(' ')[1];
        jsonwebtoken_1.default.verify(String(token), String(process.env.TOKEN_SECRET));
        next();
    }
    catch (error) {
        res.status(401).json({ message: "invalid token" });
    }
};
exports.default = verifyAuthToken;
