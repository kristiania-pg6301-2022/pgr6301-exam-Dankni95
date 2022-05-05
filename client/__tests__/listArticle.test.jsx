import { ListArticles } from "../pages/listArticles";

import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { ArticlesApiContext } from "../articlesApiContext.jsx";
import {logPlugin} from "@babel/preset-env/lib/debug";

describe("ListMovies component", () => {
  it("shows loading screen", () => {
    const domElement = document.createElement("div");
    ReactDOM.render(<ListArticles />, domElement);
    expect(domElement.innerHTML).toMatchSnapshot();
  });

  it("shows movies", async () => {
    const articles = [{ title: "ar 1" }, { title: "ar 2" }];
    const domElement = document.createElement("div");
    await act(async () => {
      ReactDOM.render(
        <ArticlesApiContext.Provider value={{ listMovies: () => articles }}>
          <ListArticles />
        </ArticlesApiContext.Provider>,
        domElement
      );
    });

    expect(
      Array.from(domElement.querySelectorAll("h6")).map((e) => e.innerHTML)
    ).toEqual(["movie 1", "movie 2"]);
    expect(domElement.innerHTML).toMatchSnapshot();
  });

  it("queries by country", async () => {
    const domElement = document.createElement("div");
    const listMovies = jest.fn(() => []);
    await act(async () => {
      ReactDOM.render(
        <ArticlesApiContext.Provider value={{ listMovies }}>
          <ListArticles />
        </ArticlesApiContext.Provider>,
        domElement
      );
    });
    Simulate.change(domElement.querySelector("#country-query"), {
      target: { value: "Ukraine" },
    });
    await act(async () => {
      await Simulate.submit(domElement.querySelector("form"));
    });
    expect(listMovies).toHaveBeenCalledWith({
      country: "Ukraine",
    });
  });

  it("shows error message", async () => {
    const domElement = document.createElement("div");
    await act(async () => {
      const listMovies = () => {
        throw new Error("Something went wrong");
      };
      ReactDOM.render(
        <ArticlesApiContext.Provider value={{ listMovies }}>
          <ListArticles />
        </ArticlesApiContext.Provider>,
        domElement
      );
    });

    expect(domElement.querySelector("#error-text").innerHTML).toEqual(
      "Error: Something went wrong"
    );
    expect(domElement.innerHTML).toMatchSnapshot();
  });
});
