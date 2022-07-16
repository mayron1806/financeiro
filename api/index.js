const express = require("express");
const app = express();
const port = 8080;

// middlewares
const body_parser = require("body-parser");
app.use(body_parser.json());

// rotas 
const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

const categoryRoutes = require("./routes/category");
app.use("/api/category", categoryRoutes);

const transationRoutes = require("./routes/transation");
app.use("/api/transation", transationRoutes);

const transationManagerRoutes = require("./routes/transationManager");
app.use("/api/manager", transationManagerRoutes);

app.listen(port, ()=> {console.log("Server on http://localhost:" + port)})