const express = require("express")
const { default: mongoose } = require("mongoose");
const path = require("path");
module.exports = class Application {
    #App = express();
    #DB_URI;
    #PORT;
    constructor(PORT, DB_URI) {
        this.#PORT = PORT;
        this.#DB_URI = DB_URI;
        this.configApplication();
        this.connectToMongoDB();
        this.createServer();
        this.createServer();
        this.errorHandling();
    }
    configApplication() {
        this.#App.use(express.json());
        this.#App.use(express.urlencoded({ extended: true }));
        this.#App.use(express.static(path.join(__dirname, "..", "public")));
    }
    createServer() {
        const http = require("http");
        http.createServer(this.#App).listen(this.#PORT, () => {
            console.log(`run > http://localhost:${this.#PORT}`);
        });
    }
    connectToMongoDB() {
        mongoose.connect(this.#DB_URI, (err) => {
            if (!err) return console.log("connected to MongoDB");
            else return console.log("faild to connect to MongoDB");
        });
    }
    createRote() {

    }
    errorHandling() {
        this.#App.use((req, res, next) => {
            return res.status(404).json({
                statusCode: 404,
                message: "آدرس مورد نظر یافت نشد",
            })
        });
        this.#App.use((err, req, res, next) => {
            const statusCode = err.status || 500;
            const message = err.message || "InternalServerError";
            return res.status(statusCode).json({
                statusCode,
                message
            })
        })
    }
};