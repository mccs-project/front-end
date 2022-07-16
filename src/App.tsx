import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import TwitterAuthorizationButton from "./components/TwitterAuthorizationButton";
import { TwitterOAuth2 } from "./lib/TwitterOAuth2";
import { Token } from "./lib/Token";
import { Button } from "@mui/material";
import { WebSocketClient } from "./lib/WebSocketClient";




function App() {

  const initialize = useRef(false);
  const webSocket = useRef<WebSocketClient|undefined>();
  useEffect(()=>{
    (async()=>{
      //  NODE_ENVがdevelopmentの場合2回呼ばれるので1回しか処理をしないようにする
      if(initialize.current === true) { return; }
      else { initialize.current = true; }

      //  ローカルサーバーのAPIアクセスで利用するトークンを更新
      const tokenObj: Token = new Token();
      await tokenObj.refresh();
      //  トークンを取得
      const token: string = tokenObj.getToken();

      //  twitterの認可ページからリダイレクトされている場合
      if(TwitterOAuth2.isRedirectUrl(window.location.href)) {
        await new TwitterOAuth2().onRedirectUrl();
      }

      //  WebSocket接続（originへ接続）
      const url: URL = new URL("ws" + window.location.href.substring(4)); //  replace 'http' to 'ws'
      webSocket.current = new WebSocketClient(url.origin);
      
    })();
  }, []);

  const [twitterConnected, setTwitterConnected] = useState(false);
  const twitterButtonClick = async()=>{
    //  認可画面へ遷移
    await new TwitterOAuth2().authorize();
  };
  

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      
      <TwitterAuthorizationButton isConnected={twitterConnected} onClick={twitterButtonClick} />
      <Button onClick={()=>{
        // fetch("/api/twitter/users/me",).then(async res=>{ console.log(await res.text()); } ).catch(err=>console.error(err));
        webSocket.current?.send("hoge-");
      }} >hoge</Button>

    </div>
  );
}

export default App;
