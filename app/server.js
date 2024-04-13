const express = require("express");
const mongoose = require("mongoose"); // No need for default import
const path = require("path");
const { AllRoutes } = require("./router/router");
const morgan = require("morgan");

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
    this.createRote();
    this.errorHandling();
  }

  configApplication() {
    this.#App.use(morgan("dev"))
    this.#App.use(express.json());
    this.#App.use(express.urlencoded({ extended: true }));
    this.#App.use(express.static(path.join(__dirname, "..", "public")));
  }

  async connectToMongoDB() {
    try {
      await mongoose.connect(this.#DB_URI);
      console.log("connected to MongoDB");
    } catch (err) {
      console.error("failed to connect to MongoDB:", err);
    }
  }

  createServer() {
    const http = require("http");
    http.createServer(this.#App).listen(this.#PORT, () => {
      console.log(`run > http://localhost:${this.#PORT}`);
    });
  }

  createRote() {
    this.#App.use(AllRoutes)
  }

  errorHandling() {
    this.#App.use((req, res, next) => {
      return res.status(404).json({
        statusCode: 404,
        message: "آدرس مورد نظر یافت نشد",
      });
    });

    this.#App.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      const message = err.message || "InternalServerError";
      return res.status(statusCode).json({
        statusCode,
        message,
      });
    });
  }
};
