import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [topStories, setTopStories] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const getTopStories = await fetch(
          'https://hacker-news.firebaseio.com/v0/topstories.json'
        );
        const topStoriesData = await getTopStories.json();
        const topTwentyStories = topStoriesData.slice(0, 20);

        const storyData = await Promise.all(
          topTwentyStories.map(async (storyId) => {
            const getStoryData = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
            );
            return await getStoryData.json();
          })
        );

        const allStories = await Promise.all(storyData);
        setTopStories(allStories);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchResults = topStories.filter((story) => {
      return story.title.toLowerCase().includes(searchText.toLowerCase());
    });
    setTopStories(searchResults);
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="App">
      <h1>Hacker News</h1>
      <form className="search-form" autoComplete='off' onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="search" 
          id="search" 
          placeholder="Search" 
          value={searchText} 
          onChange={handleChange} 
        />
        <button type="submit">Search</button>
      </form>
      <div className="news-container">
        {topStories.length === 0 && <p>Loading...</p>}
        {topStories.map((story, index) => (
          <div className="news-card" key={story.id}>
            <a href={story.url} target="_blank" rel="noreferrer">{story.title}</a>
            <p>{''}by {story.by} | {story.score} points</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
