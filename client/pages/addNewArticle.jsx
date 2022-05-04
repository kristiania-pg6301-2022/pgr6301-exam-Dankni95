import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FormInput, FormTextArea, FormTextOptions} from "../lib/formInput";
import {ArticlesApiContext} from "../articlesApiContext.jsx";

export function AddNewArticle({user}) {
    const {createArticle} = useContext(ArticlesApiContext);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Politics");
    const [content, setContent] = useState("");

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        const {name} = user.openid
        createArticle({title, date: new Date().toLocaleDateString(), category, content, name});
        navigate("/");
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Add new article</h1>

            <FormInput label={"Title:"} value={title} onChangeValue={setTitle}/>
            <FormTextOptions label={"Category: "} value={category} onChangeValue={setCategory}/>
            <FormTextArea label={"Content:"} value={content} onChangeValue={setContent}/>
            <div>
                <button>Submit</button>
            </div>
        </form>
    );
}
