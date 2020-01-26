import bodyParser from "body-parser";
import express from "express";

import courseRoute from "./routes/course.r";

const app = express();
const PORT = process.env.PORT || 8080;

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
app.use("/course", courseRoute);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));