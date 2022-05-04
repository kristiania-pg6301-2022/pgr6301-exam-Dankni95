import React, {useContext, useState, useEffect} from "react";
import {ArticlesApiContext} from "../articlesApiContext.jsx";
import {useNavigate} from "react-router-dom";
import {useLoading} from "../useLoading";

export async function handleClick(article, deleteArticle) {
    await deleteArticle(article)
    useNavigate()
}


function Article({article: {title, date, category, content, name}, user}) {
    const {deleteArticle} = useContext(ArticlesApiContext)

    return (
        <div>
            <h6>{category}</h6>
            <h1>{"title" + title}</h1>
            <h6>{date}</h6>
            {user?.google || user?.openid ? <h4>{content}</h4> : "Sign in to read the article"}
            <h6>By: {name}</h6>
            {user.openid && user?.openid?.name === name ?
                <button onClick={(event) => handleClick({del: title}, deleteArticle)}>Edit</button> : ""}
        </div>
    );
}


export function ListArticles({user}) {
    const [category, setCategory] = useState("");
    const [categoryQuery, setCategoryQuery] = useState("");


    function handleSubmitQuery(e) {
        e.preventDefault();
        setCategory(categoryQuery);
    }

    const [articles, setArticles] = useState("");
    useEffect(() => {
        const ws = new WebSocket(window.location.origin.replace(/^http/, "ws") + "/");
        ws.onmessage = (event) => {
            const {name, title, content, date, category} = JSON.parse(event.data);
            setArticles((articles) => [...articles, {name, title, content, date, category}]);
        };
    }, []);




    return (
        <div>
            <h1>Articles</h1>

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
                <Article key={articles[keyName].title} article={articles[keyName]} user={user}/>
            ))}
        </div>
    );
}
