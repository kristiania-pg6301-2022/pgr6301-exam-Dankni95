import {Link, Navigate} from "react-router-dom"
import React from "react"
import {ListArticles} from "./listArticles";
import Sidebar from "./sidebar";


export function FrontPage({user}) {

    return (
        <>
            <div className="left-side"><Sidebar/></div>
            <main className="main"><ListArticles user={user}/></main>
            <footer className="section coral">Footer</footer>
        </>
    )
}
