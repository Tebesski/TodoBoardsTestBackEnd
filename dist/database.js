"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: "postgres",
    host: "34.116.204.64",
    database: "postgres",
    password: "u~/R??k:~LM>T7oJ",
    port: 5432,
});
