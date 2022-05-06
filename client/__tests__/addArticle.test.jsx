import {AddNewArticle} from "../pages/addNewArticle";
import React from "react";
import ReactDOM from "react-dom";
import {Simulate} from "react-dom/test-utils";
import {MemoryRouter} from "react-router-dom";
import {ArticlesApiContext} from "../articlesApiContext.jsx";

describe("add article component", () => {
    it("shows article form", () => {
        const element = document.createElement("div");
        ReactDOM.render(
            <MemoryRouter>
                <AddNewArticle/>
            </MemoryRouter>,
            element
        );
        expect(element.innerHTML).toMatchSnapshot();
        expect(
            Array.from(element.querySelectorAll("form label strong")).map(
                (e) => e.innerHTML
            )
        ).toEqual(["Title:", "Content:"]);
    });

    it("adds article on submit", () => {
        const createArticle = jest.fn();
        const title = "Test title";
        const content = "test content"
        const category = "Politics"
        const date = new Date().toLocaleDateString()


        const user = {openid: {name: "Danny"}}


        const element = document.createElement("div");
        ReactDOM.render(
            <ArticlesApiContext.Provider value={{createArticle}}>
                <MemoryRouter>
                    <AddNewArticle user={user}/>
                </MemoryRouter>
            </ArticlesApiContext.Provider>,
            element
        );
        Simulate.change(element.querySelector(".form-input input"), {
            target: {value: title},
        });
        Simulate.change(element.querySelector(".form-text-input textarea"), {
            target: {value: content},
        });

        let name = user.openid.name

        Simulate.submit(element.querySelector("form"));
        expect(createArticle).toBeCalledWith({
            category,
            content,
            date,
            name,
            title
        });
    });
});
