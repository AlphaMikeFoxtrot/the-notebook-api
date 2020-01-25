import express, { Request, Response } from "express";
import CourseClass from "../agents/course/course.c";
import Course from "../agents/course/course.i";

const router = express.Router();

// create a course
router.post("/", (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
        res
            .status(400)
            .json({
                error: "Invalid payload received"
            })
            .end();
        return;
    }

    return CourseClass
        .create(name)
        .then((course: Course) => {
            res
                .status(200)
                .json({
                    course,
                    error: false,
                })
                .end();
            return;
        })
        .catch((err: any) => {
            res
                .status(500)
                .json({
                    error: err
                })
                .end();
            return;
        });
});

// get a course
router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res
            .status(400)
            .json({
                error: "Invalid payload"
            })
            .end();
        return;
    }

    const course: CourseClass = new CourseClass(id);
    return course
        .get()
        .then((courseData: Course) => {
            res
                .status(200)
                .json({
                    course: courseData,
                    error: false,
                })
                .end();
            return;
        })
        .catch((err: any) => {
            res
                .status(500)
                .json({
                    error: err.message
                })
                .end();
            return;
        });
});

export default router;
