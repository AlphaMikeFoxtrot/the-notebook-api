import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import { decrypt } from "./lib/cryptic";
import globalConfig from "./lib/global";
import courseRoute from "./routes/course.r";
import departmentRoute from "./routes/department.r";
import documentRoute from "./routes/document.r";
import subjectRoute from "./routes/subject.r";
import userRoute from "./routes/user.r";

const app = express();
const PORT = process.env.PORT || 3578;
const { course, department, document, subject, user } = globalConfig.routes.global;

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// general
app.use(express.static("public"));

// routes
app.use(course, courseRoute);
app.use(department, departmentRoute);
app.use(document, documentRoute);
app.use(subject, subjectRoute);
app.use(user, userRoute);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
