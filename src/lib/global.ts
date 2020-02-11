const global: any = {
    firebase: {
        firestore: {
            collections: {
                courses: "courses",
                departments: "departments",
                documents: "documents",
                subjects: "subjects",
                users: "users"
            }
        }
    },
    hash: {
        salts: 12
    },
    routes: {
        agentSpecific: {
            addChild: "/foeto",
            createResource: "/",
            deleteResource: "/erado",
            getAll: "/omnis",
            getChildren: "/liberi",
            getOne: "/unus",
            removeChild: "/aufero",
            updateResource: "/immuto"
        },
        global: {
            course: `${process.env.BASE}/scilicet`,
            department: `${process.env.BASE}/provincia`,
            document: `${process.env.BASE}/scriptum`,
            subject: `${process.env.BASE}/subject`,
            user: `${process.env.BASE}/hominem`,
        },
    },
};

export default global;
