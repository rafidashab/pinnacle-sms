
import {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);
  const [phone, setPhone] = useState("");
  const [wallet, setWallet] = useState("");

  const handleSubmit = (evt) => {
      evt.preventDefault();
      alert(`Submitting Name ${phone} ${wallet}`)
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
