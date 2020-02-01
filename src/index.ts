import bodyParser from "body-parser";
import express from "express";

import courseRoute from "./routes/course.r";
import departmentRoute from "./routes/department.r";
import documentRoute from "./routes/document.r";
import subjectRoute from "./routes/subject.r";

const app = express();
const PORT = process.env.PORT || 8080;

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
app.use("/course", courseRoute);
app.use("/department", departmentRoute);
app.use("/document", documentRoute);
app.use("/subject", subjectRoute);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
