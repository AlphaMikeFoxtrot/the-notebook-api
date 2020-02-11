import express, { Request, Response } from "express";
import _ from "lodash";

import admin from "firebase-admin";
import DepartmentClass from "../agents/department/department.c";
import Department from "../agents/department/department.i";
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

// create a department
router.post(createResource, (req: Request, res: Response) => {
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

    return DepartmentClass
        .create(name)
        .then((department: Department) => {
            res
                .status(200)
                .json({
                    department,
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

    const department: DepartmentClass = new DepartmentClass(id);
    return department
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

    const department: DepartmentClass = new DepartmentClass(id);
    return department
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

// get a department
router.get(`${getOne}/:id`, (req: Request, res: Response) => {
    const { id } = req.params;

    const department: DepartmentClass = new DepartmentClass(id);
    return department
        .get()
        .then((departmentData: Department) => {
            res
                .status(200)
                .json({
                    department: departmentData,
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

// get all departments
router.get(`${getAll}`, (req: Request, res: Response) => {
    return DepartmentClass
        .fetchAll()
        .then((departments) => {

            if (!_.isEmpty(departments)) {
              res
                .status(200)
                .json({
                    departments,
                    error: false,
                })
                .end();
              return;
            }
            res
              .status(400)
              .json({
                  error: "no departments found"
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
    const department: DepartmentClass = new DepartmentClass(id);
    return department
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

// delete a department
router.delete(`${deleteResource}/:id`, (req: Request, res: Response) => {
    const { id } = req.params;

    const department: DepartmentClass = new DepartmentClass(id);
    return department
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

// update a department's name
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

    const department: DepartmentClass = new DepartmentClass(id);
    return department
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
