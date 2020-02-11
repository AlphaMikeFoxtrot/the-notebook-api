import express, { Request, Response } from "express";
import _ from "lodash";

import * as admin from "firebase-admin";
import CourseClass from "../agents/course/course.c";
import Course from "../agents/course/course.i";
import globalConfig from "../lib/global";

const router = express.Router();
const {
    addChild,
    createResource,
    deleteResource,
    getAll,
    getChildren,
    getOne,
    removeChild,
    updateResource
} = globalConfig.routes.agentSpecific;

// create a course
router.post(`${createResource}`, (req: Request, res: Response) => {
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

// add a child
router.post(`${addChild}/:id/:childID`, (req: Request, res: Response) => {
    const { id, childID } = req.params;
    if (!id || !childID) {
        return res
            .status(400)
            .json({
                error: "Invalid payload"
            })
            .end();
    }

    const course: CourseClass = new CourseClass(id);
    return course
        .addChild(childID)
        .then((value: admin.firestore.WriteResult) => {
            return res
                .status(200)
                .json({
                    error: false,
                    value
                })
                .end();
        })
        .catch((err) => {
            return res
                .status(500)
                .json({
                    error: err.message
                })
                .end();
        });
});

// remove a child
router.delete(`${removeChild}/:id/:childID`, (req: Request, res: Response) => {
    const { id, childID } = req.params;
    if (!id || !childID) {
        return res
            .status(400)
            .json({
                error: "Invalid payload"
            })
            .end();
    }

    const course: CourseClass = new CourseClass(id);
    return course
        .removeChild(childID)
        .then((value) => {
            return res
                .status(200)
                .json({
                    error: false,
                    value
                })
                .end();
        }).catch((err) => {
            return res
                .status(500)
                .json({
                    error: err.message
                })
                .end();
        });
});

// get a course
router.get(`${getOne}/:id`, (req: Request, res: Response) => {
    const { id } = req.params;

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

// get all courses
router.get(`${getAll}`, (req: Request, res: Response) => {
    return CourseClass
        .fetchAll()
        .then((courses) => {

            if (!_.isEmpty(courses)) {
              res
                .status(200)
                .json({
                    courses,
                    error: false,
                })
                .end();
              return;
            }
            res
              .status(400)
              .json({
                  error: "no courses found"
              })
              .end();
            return;
        })
        .catch((err) => {
            res.status(500).json({
                error: err.message
            }).end();
            return;
        });
});

// get children
router.get(`${getChildren}/:id`, (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res
            .status(400)
            .json({
                error: "Invalid payload"
            })
            .end();
    }
    const course: CourseClass = new CourseClass(id);
    return course
        .getChildren()
        .then((children: string[]) => {
            return res
                .status(200)
                .json({
                    children,
                    error: false,
                })
                .end();
        })
        .catch((err) => {
            return res
                .status(500)
                .json({
                    error: err.message
                })
                .end();
        });
});

// delete a course
router.delete(`${deleteResource}/:id`, (req: Request, res: Response) => {
    const { id } = req.params;

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
router.put(`${updateResource}/:id`, (req: Request, res: Response) => {
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
