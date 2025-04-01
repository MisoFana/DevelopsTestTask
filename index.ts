import express from "express";
import logger from "morgan"
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import countriesRouter from "./src/routers/countriesRouter";

dotenv.config();

const app = express();
app.use(logger("combined"));
app.use(express.json());
app.use('/', countriesRouter);

mongoose.connect(process.env.MONGO_URL as string)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on: ${process.env.HOST}:${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.error("Something went wrong", err);
    })

