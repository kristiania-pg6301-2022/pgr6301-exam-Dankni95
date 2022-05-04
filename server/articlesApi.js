import {Router} from "express";

export async function ArticleWebSocket(mongoDatabase, sockets) {

  await initMongo({})



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

            for (const recipient of sockets) {
                articles.forEach((article) => {
                    recipient.send(JSON.stringify(article));
                })
            }
        }
    }

    const router = new Router();


        router.post("/", (req, res) => {
            let {title, date, category, content, name} = req.body;
            category = [category.toLowerCase()];
            mongoDatabase
                .collection("articles")
                .insertOne({title, date, category, content, name});
            res.sendStatus(200);
        });


        return router;
}
