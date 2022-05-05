import {Router} from "express";

export function ArticlesApi(mongoDatabase, sockets) {

    const router = new Router();


    router.post("/", async (req, res) => {

        async function titleExists(title) {
            const db = mongoDatabase
                .collection("articles")

            const exists = await db.find({title: title.toString()})
                .toArray()

            return exists.length > 0
        }

        function validateValue(body) {
            console.log("this "+Object.values(body).every(value => value !== null))
            // still fails
            return !Object.values(body).every(value => value !== null)
        }

        let {title, date, category, content, name} = req.body;

        let hasNullValues = validateValue(req.body)

        let exists = await titleExists(title)

        if (exists || hasNullValues) {
            res.sendStatus(400)
        } else {
            category = [category.toLowerCase()];

            mongoDatabase
                .collection("articles")
                .insertOne({title, date, category, content, name});
            res.sendStatus(200);

            const article = {title, date, category, content, name}

            for (const recipient of sockets) {
                recipient.send(JSON.stringify(article));
            }
        }
    });

    return router;
}
