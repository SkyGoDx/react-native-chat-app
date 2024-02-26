import mongoose, { Error as MongooseError, Connection } from "mongoose";
import logger from "morgan";
import express, { Application } from "express";
import path from 'path';
// import cookieParser from 'cookie-parser';
import { developmentErrors, mongoseErrors, notFound, productionErrors } from './handlers/errorHandlers';
import { userRouter } from './router/userRouter/user.index';
import dotenv from "dotenv";
import Io from "./webSockets";
import http from "http"
dotenv.config();

const app: Application = express();

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(
  process.env.DATABASE || ""
).then((_con: typeof mongoose) => {
  console.log("Connected to DB");
}).catch((e: MongooseError) => {
  console.log(e);
  throw e.message;
});

// api routes
app.use("/api/user", userRouter);


if (process.env.ENV === "DEVELOPMENT") {
  app.use(developmentErrors);
} else {
  app.use(productionErrors);
}
const server = http.createServer(app);
const io = new Io(server);

server.listen('4000', () => {
  console.log("server satrted");
});

app.use(mongoseErrors);
app.use(notFound);
