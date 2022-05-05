import React, {useContext, useState, useEffect} from "react";


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
        <div>
            <h6>{category}</h6>
            <div>{user.openid && user?.openid?.name === name ?
                <input type='text' onChange={(e) => {
                    handleInputChange(e)
                }} defaultValue={title}/> : <h1>{title}</h1>}
            </div>
            <h6>{date}</h6>
            {user?.google || user?.openid ? <h4>{content}</h4> : "Sign in to read the article"}
            <h6>By: {name}</h6>
            {user.openid && user?.openid?.name === name ?
                <div>
                <button onClick={(event) => saveClick(title)}>Save</button>
                <button onClick={(event) => deleteClick(title)}>Delete</button>
                </div>
            : ""}
        </div>
    );
}


export function ListArticles({user}) {
    const [category, setCategory] = useState("");
    const [categoryQuery, setCategoryQuery] = useState("");
    const [ws, setWs] = useState();


    function handleSubmitQuery(e) {
        e.preventDefault();
        setCategory(categoryQuery);
    }

    const [articles, setArticles] = useState("");
    useEffect(() => {
        const ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));

        ws.onopen = () => {
            ws.send(JSON.stringify({category: categoryQuery}))
        }

        ws.onmessage = (event) => {

            setArticles("")

            console.log("onmessage")

            let data = JSON.parse(event.data);
            data.forEach((article) => {
                const {name, title, content, date, category} = article
                setArticles((articles) => [...articles, {name, title, content, date, category}]);
            })

        };
        setWs(ws)
    }, [category]);


    return (
        <div>
            <h2>Articles</h2>

            <div>
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
                <Article key={articles[keyName].title} article={articles[keyName]} user={user} ws={ws}/>
            ))}
        </div>
    );
}
