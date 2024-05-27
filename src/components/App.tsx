import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import './App.css';
import PersonCard from './PersonCard';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

const queryClient = new QueryClient();

interface CharacterData {
  id: number;
  name: string;
  height: string;
  mass: string;
  eye_color: string;
  hair_color: string;
  skin_color: string;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GetPeople />
    </QueryClientProvider>
  )
}

function GetPeople() {
  const [query, setQuery] = useState<string>('');
  const [length, setLength] = useState<number>(12);
  const [favoriteCards, setFavoriteCards] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  // Get list of favorites from dyamoDB
  const { isLoading, error, data } = useQuery<CharacterData[]>('people', () =>
    // Lambda API Gateway
    fetch('https://w5c9dy2dg4.execute-api.us-east-2.amazonaws.com/people', {
      headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
      },
    }).then(res =>
      res.json()
    )
  );

  // Updates the local favorites list
  useEffect(() => {
    if (data) {
      setFavoriteCards(data.map(person => person.id));
    }
  }, [data]);

  if (isLoading) return (<p>Loading...</p>);

  if (error) return (<p>Error fetching data.</p>);

  const handleLengthInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      // cap maximum number of cards to limit API calls and ignore invalid data
      let result = Math.min(Math.max(value, 1), 50);
      setLength(result);
    }
  };

  const handleQueryInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value !== '' || value !== null) {
      setQuery(value);
    }
  };

  const handleFavoriteToggle = (cardIndex: number) => {
    setFavoriteCards(prevFavorites =>
      prevFavorites.includes(cardIndex)
        ? prevFavorites.filter(id => id !== cardIndex)
        : [...prevFavorites, cardIndex]
    );
  };

  const searchPeople = async (name: string) => {
    try {
      const response = await fetch(`https://w5c9dy2dg4.execute-api.us-east-2.amazonaws.com/people/search?name=${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      setFavoriteCards(data.map((person: { id: number; }) => person.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuery = () => {
    searchPeople(query);
  }

  // Switch between 'All-Items' and 'Favorites'
  const handleToggleChange = (value: number) => {
    setShowFavorites(value === 2);
  };

  const displayedCards = !showFavorites
    ? Array.from({ length }, (_, index) => index)
    : favoriteCards


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
          onChange={handleLengthInputChange}
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

      {showFavorites &&
        <div className="App-filter">
          <label htmlFor="queryInput">Filter Favorites: </label>
          <input className="queryInput" value={query} onChange={handleQueryInputChange} onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleQuery();
            }
          }} />
        </div>}

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
  );
}

export default App;
