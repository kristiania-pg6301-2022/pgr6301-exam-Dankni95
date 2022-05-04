import {Router} from "express";

export function ArticlesApi(mongoDatabase, recipient) {

    const router = new Router();

    router.get("/", async (req, res) => {

        let query = {
            category: ""
        };
        const {category, del} = req.query;
        if (category) {
            query.category = {$in: [category.toLowerCase()]};
            await initMongo(query)
        } else if (del) {
            await mongoDatabase
                .collection("articles").deleteOne({title: del})
        } else {
            await initMongo({})
        }



    async function initMongo(query) {
        if ({query}) {
            const articles = await mongoDatabase
                .collection("articles")
                .find(query)
                .sort({metacritic: -1})
                .map(({title, date, content, category, name}) => ({
                    title,
                    date,
                    content,
                    category,
                    name
                }))
                .limit(100)
                .toArray();

            res.json(articles);
        }
    }})

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
