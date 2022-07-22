import React, { useEffect, useRef } from "react";
// import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Token } from "./lib/Token";
import { WebSocketClient } from "./lib/WebSocketClient";

import { Env } from "./lib/Env";
import { MainLayout } from "./components/MainLayout";
import { DashboardContent, EldoradoContent, ShopContent } from "./components/contents";


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

    //  cleanup
    return ()=>{
      webSocket.current?.close();
    };
  }, []);


  return (
    <BrowserRouter>
      <MainLayout title="MCCS"/>
      
      <Routes>
        <Route path={`/`} element={<DashboardContent />} />
        <Route path={`/eldorado`} element={<EldoradoContent />} />
        <Route path={`/shop`} element={<ShopContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
