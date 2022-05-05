export async function ArticleWebSocket(mongoDatabase, recipient, message) {

    const category = message?.category
    const oldTitle = message?.title
    const newTitle = message?.newTitle
    const deleteArticle = message?.deleteArticle


    let query = {
        category: ""
    };

    if (category) {
        query.category = {$in: [category.toLowerCase()]};
        return await initMongo(query)
    } else if (newTitle) {
        await mongoDatabase
            .collection("articles").updateOne({title: oldTitle}, {$set:{title: newTitle}})
        return await initMongo({})
    }else if(deleteArticle){
        await mongoDatabase
            .collection("articles").deleteOne({title: deleteArticle})
        return await initMongo({})
    }
    else {
        return await initMongo({})
    }

    async function initMongo(query) {
        return await mongoDatabase
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
            .toArray()
    }
}

