import express, { Request, Response } from "express";
import _ from "lodash";

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
                    error: err.message
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

// delete a course
router.delete("/:id", (req: Request, res: Response) => {
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
        .delete()
        .then(() => {
            res
                .status(200)
                .json({
                    error: false,
                    message: "Resource successfully deleted"
                })
                .end();
            return;
        })
        .catch((err) => {
            res
                .status(500)
                .json({
                    error: err.message
                })
                .end();
            return;
        });
});

// update a course's name
router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!id || !name) {
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
        .updateName(name)
        .then((value) => {
            res
                .status(200)
                .json({
                    empty: _.isEmpty(value),
                    error: false,
                    writeResult: value,
                })
                .end();
            return;
        })
        .catch((err) => {
            return res
                .status(404)
                .json({
                    error: err.message
                })
                .end();
       });
});

export default router;
