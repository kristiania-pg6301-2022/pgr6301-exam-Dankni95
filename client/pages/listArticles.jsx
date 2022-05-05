import React, {useState, useEffect} from "react";
import {Card, Button, CardActions, CardContent, Typography} from "@mui/material";

function Article({article: {title, date, category, content, name}, user, ws}) {
    const [newTitle, setTitle] = useState("");


    function handleInputChange(e) {
        e.preventDefault();
        setTitle(e.target.value)
    }

    async function saveClick(title) {
        ws.send(JSON.stringify({title: title, newTitle: newTitle}))
    }

    function deleteClick(title) {
        ws.send(JSON.stringify({deleteArticle: title}))
    }

    return (
        <Card style={{marginTop: "20px"}} >
            <CardContent >
                <h6>{category}</h6>
                <h6>{date}</h6>

                <Typography gutterBottom variant="h5" component="div">
                    {user.openid && user?.openid?.name === name ?
                        <input type='text' onChange={(e) => {
                            handleInputChange(e)
                        }} defaultValue={title}/> : <h1>{title}</h1>}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {user?.google || user?.openid ? <h4>{content}</h4> : "Sign in to read the article"}
                </Typography>
            </CardContent>
            <h6>By: {name}</h6>
            <CardActions>
                {user.openid && user?.openid?.name === name ?
                    <>
                        <Button onClick={() => saveClick(title)}>Save</Button>
                        <Button onClick={() => deleteClick(title)}>Delete</Button>
                    </>
                    : ""}
            </CardActions>
        </Card>
    );


}


export function ListArticles({user, socket}) {
    const [category, setCategory] = useState("");
    const [categoryQuery, setCategoryQuery] = useState("");
    const [ws, setWs] = useState();


    function handleSubmitQuery(e) {
        e.preventDefault();
        setCategory(categoryQuery);
    }

    const [articles, setArticles] = useState("");
    useEffect(() => {

        socket.onopen = () => {
            socket.send(JSON.stringify({category: categoryQuery}))
        }

        socket.onmessage = (event) => {

            setArticles("")

            console.log("onmessage")

            let data = JSON.parse(event.data);
            let reversed = data.reverse()
            reversed.forEach((article) => {
                const {name, title, content, date, category} = article
                setArticles((articles) => [...articles, {name, title, content, date, category}]);
            })
        };
        setWs(socket)
    }, [category]);


    return (
        <div >
            <h2>Articles</h2>

            <div >
                <form onSubmit={handleSubmitQuery}>
                    <label>
                        Category:
                        <select name={"Category"} value={categoryQuery}
                                onChange={(e) => setCategoryQuery(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="Politics">Politics</option>
                            <option value="Economics">Economics</option>
                            <option value="Sport">Sport</option>
                            <option value="Health">Health</option>
                        </select>
                        <button>Select</button>
                    </label>
                </form>
            </div>
            {Object.keys(articles).map((keyName, i) => (
                <Article  key={articles[keyName].title} article={articles[keyName]} user={user} ws={ws}/>
            ))}
        </div>
    );
}
