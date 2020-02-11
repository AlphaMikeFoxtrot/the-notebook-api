import express, { Request, Response } from "express";
import * as admin from "firebase-admin";
import _ from "lodash";

import SubjectClass from "../agents/subject/subject.c";
import Subject from "../agents/subject/subject.i";
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

// create a subject
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

    const subject: SubjectClass = new SubjectClass(id);
    return subject
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

    const subject: SubjectClass = new SubjectClass(id);
    return subject
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

// get a subject
router.get(`${getOne}/:id`, (req: Request, res: Response) => {
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
router.get(`${getAll}`, (req: Request, res: Response) => {
    return SubjectClass
        .fetchAll()
        .then((subjects) => {

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
    const subject: SubjectClass = new SubjectClass(id);
    return subject
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

// delete a subject
router.delete(`${deleteResource}/:id`, (req: Request, res: Response) => {
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
