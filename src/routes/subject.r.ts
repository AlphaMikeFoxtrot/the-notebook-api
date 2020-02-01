import express, { Request, Response } from "express";
import _ from "lodash";

import SubjectClass from "../agents/subject/subject.c";
import Subject from "../agents/subject/subject.i";

const router = express.Router();

// create a subject
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

    return SubjectClass
        .create(name)
        .then((subject: Subject) => {
            res
                .status(200)
                .json({
                    error: false,
                    subject,
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

// get a subject
router.get("/unus/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    const subject: SubjectClass = new SubjectClass(id);
    return subject
        .get()
        .then((subjectData: Subject) => {
            res
                .status(200)
                .json({
                    error: false,
                    subject: subjectData,
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

// get all subjects
router.get("/omnis", (req: Request, res: Response) => {
    return SubjectClass
        .fetchAll()
        .then((subjects) => {
            console.log(JSON.stringify(subjects));
            if (!_.isEmpty(subjects)) {
              res
                .status(200)
                .json({
                    error: false,
                    subjects,
                })
                .end();
              return;
            }
            res
              .status(400)
              .json({
                  error: "no subjects found"
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

// delete a subject
router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    const subject: SubjectClass = new SubjectClass(id);
    return subject
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

// update a subject's name
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

    const subject: SubjectClass = new SubjectClass(id);
    return subject
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
