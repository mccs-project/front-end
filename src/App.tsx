import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import TwitterAuthorizationButton from './components/TwitterAuthorizationButton';

function App() {

  const [twitterConnected, setTwitterConnected] = useState(false);
  const twitterButtonClick = ()=>{
    console.log("TODO: twitter onConnect");
    setTwitterConnected(!twitterConnected);
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
