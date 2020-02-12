import * as admin from "firebase-admin";
import _ from "lodash";

export default abstract class Parent {
    constructor(
        public ref: admin.firestore.CollectionReference,
        public id: string,
        public child: string,
        public grandchild?: string
        ) {}

    public async get() {
        const parentData: admin.firestore.DocumentSnapshot = await this.ref.doc(this.id).get();
        const parent = parentData.data();
        if (this.child) {
            const children: any[] = await this.getChildren();
            return {
                ...parent,
                [this.child]: children
            };
        } else {
            return parent;
        }
    }

    public getChildren(): Promise<any> {
        return this.ref.doc(this.id).get().then((parent: admin.firestore.DocumentSnapshot) => {
            if (!parent.exists) {
                throw new Error("Resource not found");
            }
            const infants: admin.firestore.DocumentReference[] = parent.data()[this.child];
            const promises: any[] = [];
            infants.forEach((infant: admin.firestore.DocumentReference) => {
                promises.push(infant.get());
            });
            return Promise
                .all(promises);
        })
        .then((children) => {
            const family: any[] = [];
            children.forEach((child: admin.firestore.DocumentSnapshot) => {
                family.push(this.grandchild ? _.omit(child.data(), this.grandchild) : child.data());
            });
            return family;
        })
        .catch((err) => {
            throw new Error(err);
        });
    }
}
