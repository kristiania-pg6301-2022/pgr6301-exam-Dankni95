import React, {useContext, useState, useEffect} from "react";
import {useLoading} from "../useLoading";
import {ArticlesApiContext} from "../articlesApiContext.jsx";
import {useNavigate} from "react-router-dom";


export async function handleClick(article, deleteArticle) {
    await deleteArticle(article)
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
            {user.openid && user?.openid?.name === name ? <button onClick={(event) => handleClick( {del: title}, deleteArticle)}>Edit</button> : ""}
        </div>
    );
}


export function ListArticles({user}) {
    const {listArticles} = useContext(ArticlesApiContext);
    const [category, setCategory] = useState("");
    const [categoryQuery, setCategoryQuery] = useState("");
    const {loading, error, data} = useLoading(
        async () => await listArticles({category: category}),
        [category]
    );

    function handleSubmitQuery(e) {
        e.preventDefault();
        setCategory(categoryQuery);
    }

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <div id="error-text">{error.toString()}</div>
            </div>
        );
    }

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
            {data.map((article) => (
                <Article key={article.title} article={article} user={user} />
            ))}
        </div>
    );
}
