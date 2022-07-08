import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import TwitterAuthorizationButton, { TwitterAuthorizationButtonProps } from './components/TwitterAuthorizationButton';

function App() {

  const [twitterConnected, setTwitterConnected] = useState(false);
  const twitterOnConnect = ()=>{
    console.log("TODO: twitter onConnect");
    setTwitterConnected(true);
  };
  const twitterOnDisconnect = ()=>{
    console.log("TODO: twitter onDisconnect");
    setTwitterConnected(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      
      <TwitterAuthorizationButton isConnected={twitterConnected} onConnect={twitterOnConnect} onDisconnect={twitterOnDisconnect}/>
      
    </div>
  );
}

export default App;
