
import {useState, useEffect} from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const test = axios.get("/api").then(function (res) {
      setData(res.data.message)
    })
    console.log("we", test)
  }, []);
  const [phone, setPhone] = useState("");
  const [wallet, setWallet] = useState("");

  const handleSubmit = (evt) => {
      evt.preventDefault();
      const data = { phone: phone, wallet:wallet }
      console.log(data)
      const test = axios.post("/api/submit", data) 
    console.log("sub",test) 
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : data}</p>
        <p>Associate your phone number with a Stellar Wallet</p>
        <form onSubmit={handleSubmit}>
          
      <input type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)}/>
          
          <input type="text"
              value={wallet}
              onChange={e => setWallet(e.target.value)}/>
              
          <input type="submit"/>
        </form>
        
      </header>
    </div>
  );
}

export default App;
