import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//  環境変数『USE_MOCK_SERVER』が『true』の時、モックサーバーを起動
if (process.env.USE_MOCK_SERVER && process.env.USE_MOCK_SERVER.toLowerCase() === 'true') {
  import("./mock/browser").then(({worker})=>{
    worker.start();
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
