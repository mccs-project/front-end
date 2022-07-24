import React, { useEffect, useRef } from "react";
// import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Token } from "./lib/Token";

import { Env } from "./lib/Env";
import { MainLayout } from "./components/MainLayout";
import { DashboardContent, EldoradoContent, ShopContent } from "./components/contents";


function App() {

  
  useEffect(()=>{
    (async()=>{

      //  ローカルサーバーのAPIアクセスで利用するトークンを更新
      new Token().refresh();

    })();

  }, []);


  return (
    <BrowserRouter>
      <MainLayout title="MCCS">
        <Routes>
          <Route path={`/`} element={<DashboardContent />} />
          <Route path={`/eldorado`} element={<EldoradoContent />} />
          <Route path={`/shop`} element={<ShopContent />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
