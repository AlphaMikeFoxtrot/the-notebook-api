import express, { Request, Response } from "express";
import _ from "lodash";

import DocumentClass from "../agents/document/document.c";
import Document from "../agents/document/document.i";
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

// create a document
router.post(`${createResource}`, (req: Request, res: Response) => {
    const { name, data } = req.body;
    if (!name || !data) {
        res
            .status(400)
            .json({
                error: "Invalid payload received"
            })
            .end();
        return;
    }

    return DocumentClass
        .create(name, data)
        .then((document: Document) => {
            res
                .status(200)
                .json({
                    document,
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

// get a document
router.get(`${getOne}/:id`, (req: Request, res: Response) => {
    const { id } = req.params;

    const document: DocumentClass = new DocumentClass(id);
    return document
        .get()
        .then((documentData: Document) => {
            res
                .status(200)
                .json({
                    document: documentData,
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

// get all documents
router.get(`${getAll}`, (req: Request, res: Response) => {
    return DocumentClass
        .fetchAll()
        .then((documents) => {

            if (!_.isEmpty(documents)) {
              res
                .status(200)
                .json({
                    documents,
                    error: false,
                })
                .end();
              return;
            }
            res
              .status(400)
              .json({
                  error: "no documents found"
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

// delete a document
router.delete(`${deleteResource}/:id`, (req: Request, res: Response) => {
    const { id } = req.params;

    const document: DocumentClass = new DocumentClass(id);
    return document
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

// update a document's name
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

    const document: DocumentClass = new DocumentClass(id);
    return document
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
