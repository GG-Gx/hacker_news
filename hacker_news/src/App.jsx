import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [topStories, setTopStories] = useState([]);

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
  });

  return (
<div className="App">
      <h1>Hacker News</h1>
      {topStories.length === 0 && <p>Loading...</p>}
      {topStories.map((story, index) => (
        <article key={story.id}>
          <a href={story.url} target="_blank" rel="noreferrer">{story.title}</a>
          <p>{''}by {story.by} | {story.score} points</p>
        </article>
      ))}
    </div>
  );
}

export default App;
