import {Router} from "express";

export function ArticlesApi(mongoDatabase, recipient) {

    const router = new Router();

    router.post("/", (req, res) => {
        let {title, date, category, content, name} = req.body;
        category = [category.toLowerCase()];
        mongoDatabase
            .collection("articles")
            .insertOne({title, date, category, content, name});
        res.sendStatus(200);


        const article = { title, date,category,content, name }

        for (const recipient of sockets) {
            recipient.send(JSON.stringify(article));
        }

    });



    return router;
}
