
export async function ArticleWebSocket(mongoDatabase, recipient) {

    console.log(recipient.url)

            const articles = await mongoDatabase
                .collection("articles")
                .find({})
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

            articles.forEach((article) => {
                recipient.send(JSON.stringify(article));
            })
}

