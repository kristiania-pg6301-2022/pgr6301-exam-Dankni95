import React, {useContext, useState, useEffect} from "react";
import {ArticlesApiContext} from "../articlesApiContext.jsx";
import "./sidebar.css"

export default (user) => {
    const [category, setCategory] = useState("");
    const [categoryQuery, setCategoryQuery] = useState("");
    const [ws, setWs] = useState();


    function handleSubmitQuery(e) {
        e.preventDefault();
        setCategory(e.target.value);
    }
    const [articles, setArticles] = useState("");

    useEffect(() => {
        const ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));
        ws.onopen = () => {
            ws.send(JSON.stringify({category: categoryQuery}))
        }

        setWs(ws)
    }, [category]);


    return (
        <div>
            <h2>Articles</h2>

            <div>
                <div>
                    <form>
                        <h1> Category:</h1>
                        <button onClick={(e)=>{
                            handleSubmitQuery(e)
                        }} value="">All</button>
                        <button value="Politics" onClick={(e)=>{
                            handleSubmitQuery(e)
                        }} >Politics</button>
                        <button value="Economics" onClick={(e)=>{
                            handleSubmitQuery(e)
                        }} >Economics</button>
                        <button value="Sport" onClick={(e)=>{
                            handleSubmitQuery(e)
                        }} >Sport</button>
                        <button value="Health" onClick={(e)=>{
                            handleSubmitQuery(e)
                        }} >Health</button>
                    </form>
                </div>
            </div>
        </div>
    );

};