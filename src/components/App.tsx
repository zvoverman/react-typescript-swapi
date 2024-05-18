import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import PersonCard from './PersonCard';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

const queryClient = new QueryClient();

function App() {
  const [length, setLength] = useState<number>(12);
  const [favoriteCards, setFavoriteCards] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      // cap maximum number of cards to limit API calls and ignore invalid data
      let result = Math.min(Math.max(value, 1), 50);
      setLength(result);
    }
  };

  // Call AWS lambda to update DynamoDB here!!
  const handleFavoriteToggle = (cardIndex: number) => {
    setFavoriteCards(prevFavorites =>
      prevFavorites.includes(cardIndex)
        ? prevFavorites.filter(id => id !== cardIndex)
        : [...prevFavorites, cardIndex]
    );
  };

  // Switch between 'All-Items' and 'Favorites'
  const handleToggleChange = (value: number) => {
    setShowFavorites(value === 2);
  };

  const displayedCards = showFavorites
    ? favoriteCards
    : Array.from({ length }, (_, index) => index);

  return (
    <QueryClientProvider client={queryClient}>
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

        <ToggleButtonGroup
          className="toggle-buttons"
          type="radio"
          name="options"
          defaultValue={1}
          onChange={handleToggleChange}
        >
          <ToggleButton id="tbg-radio-1" value={1}>
            All-Items
          </ToggleButton>
          <ToggleButton id="tbg-radio-2" value={2}>
            Favorites
          </ToggleButton>
        </ToggleButtonGroup>

        <div className="App-cards">
          {displayedCards.map(index => (
            <PersonCard 
              key={index} 
              index={index} 
              isFavorite={favoriteCards.includes(index)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
