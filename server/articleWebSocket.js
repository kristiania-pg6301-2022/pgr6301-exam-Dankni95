import {Router} from "express";

export async function ArticleApi(mongoDatabase, sockets) {

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
}
