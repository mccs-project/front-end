import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Fetch } from './lib/Fetch';

//  fetchを置き換え
window.fetch = Fetch.getOverrideFetch();


//  起動オプションによってMockServerを起動する
const startMockServer = new Promise<void>((resolve, reject) => {
  //  環境変数『REACT_APP_USE_MOCK_SERVER』が『true』の時、モックサーバーを起動
  if (process.env.REACT_APP_USE_MOCK_SERVER && process.env.REACT_APP_USE_MOCK_SERVER.toLowerCase() === 'true') {
    import("./mock/browser").then(({worker})=>{
      worker.start().then(()=>{ resolve(); });
    });
  }
  else {
    resolve();
  }
});



startMockServer.then(()=>{
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
