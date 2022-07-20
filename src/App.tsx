import React, { useEffect, useRef, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";

import TwitterAuthorizationButton from "./components/TwitterAuthorizationButton";
import { TwitterOAuth2 } from "./lib/TwitterOAuth2";
import { Token } from "./lib/Token";
import { Button } from "@mui/material";
import { WebSocketClient } from "./lib/WebSocketClient";
import { WebSocketMessage } from "./shared/api/interfaces";
import { MetaMaskAccountButton, TwitterAccountButton } from "./components/AccountButton";

import { Env } from "./lib/Env";



function App() {

  const initialize = useRef(false);
  const webSocket = useRef<WebSocketClient|undefined>();
  useEffect(()=>{
    (async()=>{
      //  NODE_ENVがdevelopmentの場合2回呼ばれるので1回しか処理をしないようにする
      if(initialize.current === true) { return; }
      else { initialize.current = true; }

      //  ローカルサーバーのAPIアクセスで利用するトークンを更新
      new Token().refresh();

      //  WebSocket接続（originへ接続）
      if(Env.isDevelopment === false) {
        const url: URL = new URL("ws" + window.location.href.substring(4)); //  replace 'http' to 'ws'
        webSocket.current = new WebSocketClient(url.origin);
      }
      
    })();
  }, []);
 

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      
      <TwitterAccountButton />
      <MetaMaskAccountButton />
      <Button onClick={()=>{
        // fetch("/api/twitter/users/me",).then(async res=>{ console.log(await res.text()); } ).catch(err=>console.error(err));
        // webSocket.current?.send({ command: "/test/client", data: { test: "client test message" } } as WebSocketMessage);
      }} >TEST BUTTON</Button>

    </div>
  );
}

export default App;
