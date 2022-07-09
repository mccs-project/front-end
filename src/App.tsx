import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import TwitterAuthorizationButton from './components/TwitterAuthorizationButton';
import { TwitterOAuth2 } from './lib/TwitterOAuth2';

function App() {

  useEffect(()=>{
    (async()=>{
      const twitter = new TwitterOAuth2();

      //  twitterの認可ページからリダイレクトされた時
      if(twitter.isRedirectUrl(window.location.href)) {
        console.log(window.location.href);
        const code: string = twitter.getCodeFromRedirectPage();
        const codeVerifier: string|null = twitter.popCodeVerifierFromSessionStorage();
        if(codeVerifier === null) { throw new Error("{A799D88A-D023-4645-9CFD-273257263720}"); }

        //  AccessKey取得テスト
        twitter.getAccessKeyTest(code, codeVerifier);
        //  現在のURLをルートに戻す
        window.history.replaceState(null, "", "/");
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
