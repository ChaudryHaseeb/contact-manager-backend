const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");
const rateLimiter = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 5000;

const apiLimiter = rateLimiter({
  windowMs : 5 * 60 * 1000,
  max : 100,
  message : 'too many request from this ip address please try again after 5 mintues',
});

app.use("/api", apiLimiter);
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}));

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use(errorHandler);
connectDb();

app.listen(port, () => {
  console.log(`server is listen on the port ${port}`);
});
