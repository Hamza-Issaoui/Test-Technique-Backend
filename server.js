
const express = require("express");
const cors = require("cors");
const { success, error } = require("consola");
const morgan = require('morgan')


require('dotenv').config();
const db = require("./Config/db");

const PORT = process.env.APP_PORT || 3000;
const DOMAIN = process.env.APP_DOMAIN;


const authRouter = require("./Routes/authRouter");
const userRouter = require("./Routes/userRouter");


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'))


app.use("/", authRouter);
app.use("/users", userRouter);



app.listen(PORT, async () => {
    try {
        success({
            message: `Server started on PORT ${PORT}` + `URL : ${DOMAIN}`,
            badge: true,
        });
    } catch (err) {
        error({ message: `error with server`, badge: true });
    }
});