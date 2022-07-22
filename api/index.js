const express = require("express");
const app = express();
const port = 8080;

// middlewares
const body_parser = require("body-parser");
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));
const cors = require("cors");
app.use(cors());

// rotas 
const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

const categoryRoutes = require("./routes/category");
app.use("/api/category", categoryRoutes);

const transationRoutes = require("./routes/transation");
app.use("/api/transation", transationRoutes);

const scheduleRoutes = require("./routes/schedule");
app.use("/api/schedule", scheduleRoutes);

app.listen(port, ()=> {console.log("Server on http://localhost:" + port)})