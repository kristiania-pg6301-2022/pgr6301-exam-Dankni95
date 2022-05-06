import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

function Article({
  article: { title, date, category, content, name },
  user,
  ws,
}) {
  const [newTitle, setTitle] = useState("");

  function handleInputChange(e) {
    e.preventDefault();
    setTitle(e.target.value);
  }

  async function saveClick(title) {
    ws.send(JSON.stringify({ title: title, newTitle: newTitle }));
  }

  function deleteClick(title) {
    ws.send(JSON.stringify({ deleteArticle: title }));
  }

  return (
    <Card style={{ marginTop: "20px" }}>
      <CardContent>
        <h6>{category}</h6>
        <h6>{date}</h6>

        <Typography gutterBottom variant="h7" component="div">
          {user.openid && user?.openid?.name === name ? (
            <input
              style={{ width: "50%" }}
              type="text"
              onChange={(e) => {
                handleInputChange(e);
              }}
              defaultValue={title}
            />
          ) : (
            <h1>{title}</h1>
          )}
        </Typography>
        <Typography variant="h7" color="text.secondary">
          {user?.google || user?.openid ? (
            <>{content}</>
          ) : (
            "Sign in to read the article"
          )}
        </Typography>
      </CardContent>
      <h6>By: {name}</h6>
      <CardActions>
        {user.openid && user?.openid?.name === name ? (
          <>
            <Button onClick={() => saveClick(title)}>Save</Button>
            <Button onClick={() => deleteClick(title)}>Delete</Button>
          </>
        ) : (
          ""
        )}
      </CardActions>
    </Card>
  );
}

export function ListArticles({ user, ws }) {
  const [articles, setArticles] = useState("");

  useEffect(() => {
    ws.onopen = () => {
      // call server for info first time
      ws.send(JSON.stringify({ category: "" }));
    };

    ws.onmessage = (event) => {
      setArticles("");

      let data = JSON.parse(event.data);
      let reversed = data.reverse();
      reversed.forEach((article) => {
        const { name, title, content, date, category } = article;
        setArticles((articles) => [
          ...articles,
          { name, title, content, date, category },
        ]);
      });
    };
  }, [articles]);

  return (
    <div>
      <h2>Articles</h2>
      {Object.keys(articles).map((keyName, i) => (
        <Article
          key={articles[keyName].title}
          article={articles[keyName]}
          user={user}
          ws={ws}
        />
      ))}
    </div>
  );
}
