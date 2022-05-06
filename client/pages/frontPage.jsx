import {Link, Navigate} from "react-router-dom"
import React from "react"
import {ListArticles} from "./listArticles";
import Sidebar from "./sidebar";
import {Card} from "@mui/material";


export function FrontPage({user}) {

    const ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));


    return (
        <>
            <div className="left-side"><Sidebar  socket={ws}/></div>
            <main  style={{ padding: "1rem 1rem 1rem 1rem", width:"98%" }} className="main"><ListArticles user={user} ws={ws} /></main>
            <footer className="section coral">© 2022 Kristiania Avis</footer>
        </>
    )
}
