import { Router } from "express";

export function ArticlesApi(mongoDatabase, sockets) {
  const router = new Router();

  router.post("/", async (req, res) => {
    async function titleExists(title) {
      const db = mongoDatabase.collection("articles");

      const exists = await db.find({ title: title.toString() }).toArray();

      return exists.length > 0;
    }

    function validateValue(title, content) {
      if (title === "" || title === undefined) return true;
      else return content === "" || content === undefined;
    }

    let { title, date, category, content, name } = req.body;

    let hasNullValues = validateValue(title, content);

    let exists = await titleExists(title);

    if (exists || hasNullValues) {
      res.sendStatus(400);
    } else {
      category = [category.toLowerCase()];

      mongoDatabase
        .collection("articles")
        .insertOne({ title, date, category, content, name });

      let item = await mongoDatabase
        .collection("articles")
        .find({})
        .sort({ metacritic: -1 })
        .map(({ title, date, content, category, name }) => ({
          title,
          date,
          content,
          category,
          name,
        }))
        .limit(100)
        .toArray();
      res.json(item);

      for (const recipient of sockets) {
        recipient.send(JSON.stringify(item));
      }
    }
  });

  return router;
}
