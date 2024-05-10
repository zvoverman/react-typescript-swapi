import React, { useState } from 'react';
import logo from '../logo.svg';
import './App.css';
import PersonCard from './PersonCard';

function App() {
  const [length, setLength] = useState(12); // Initial length is set to 12

  const handleInputChange = (event: any) => {
    const value = parseInt(event.target.value);
    let result = Math.min(value, 50); // while <input max="50">, greater numbers can be entered into the input -> ensure maximum of 50 to limit API calls
    console.log(result);
    setLength(result);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2 className="App-title">SWAPI React + Typescript Test!</h2>
        <a
          className="SWAPI-link"
          href="https://swapi.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Star Wars API
        </a>
      </header>
      <div className="App-input">
        <label htmlFor="lengthInput"># of People Cards Displayed:</label>
        <input
          type="number"
          id="lengthInput"
          value={length}
          onChange={handleInputChange}
          min="1"
          max="50"
        />
      </div>
      {/* Create an array of specified length and render a PersonCard component for each element*/}
      <div className="App-cards">
        {Array.from({ length }).map((_, index) => (
          <PersonCard key={index} index={index} />
        ))}
      </div>
    </div>
  );
}

export default App;
