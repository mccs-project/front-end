import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import TwitterAuthorizationButton from './components/TwitterAuthorizationButton';
import { TwitterOAuth2 } from './lib/TwitterOAuth2';
import { Token } from './lib/Token';

function App() {

  useEffect(()=>{
    (async()=>{
      //  ローカルサーバーのAPIアクセスで利用するトークンを更新
      await new Token().refresh().catch(err=>{ console.error(err); });

      //  twitterの認可ページからリダイレクトされている場合
      if(TwitterOAuth2.isRedirectUrl(window.location.href)) {
        new TwitterOAuth2().onRedirectUrl();
      }
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

    </div>
  );
}

export default App;
