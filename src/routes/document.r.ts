import express, { Request, Response } from "express";
import _ from "lodash";

import DocumentClass from "../agents/document/document.c";
import Document from "../agents/document/document.i";

const router = express.Router();

// create a document
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

    return DocumentClass
        .create(name)
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
router.get("/unus/:id", (req: Request, res: Response) => {
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
router.get("/omnis", (req: Request, res: Response) => {
    return DocumentClass
        .fetchAll()
        .then((documents) => {
            console.log(JSON.stringify(documents));
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
router.delete("/:id", (req: Request, res: Response) => {
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
