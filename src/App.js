import React, { useState, useEffect } from 'react';
import words from './words';
import './App.css';

const normalizeRomanization = (str) => {
  // Make lowercase and trim
  let normalized = str.trim().toLowerCase();
  // Treat 'r' and 'l' as the same:
  normalized = normalized.replace(/r/g, 'l');
  return normalized;
};

const App = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState(''); // 'correct' or 'wrong' or ''

  useEffect(() => {
    pickRandomWord();
  }, []);

  const pickRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);
    setUserInput('');
    setFeedback('');
    setStatus('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentWord) return;

    const normalizedUserInput = normalizeRomanization(userInput);
    const normalizedAnswer = normalizeRomanization(currentWord.romanization);

    if (normalizedUserInput === normalizedAnswer) {
      setScore({ ...score, correct: score.correct + 1 });
      setFeedback(`✅ Correct! Romanization: "${currentWord.romanization}"`);
      setStatus('correct');
    } else {
      setScore({ ...score, wrong: score.wrong + 1 });
      setFeedback(`❌ Wrong! Correct: "${currentWord.romanization}"`);
      setStatus('wrong');
    }
  };

  return (
    <div className="app-container">
      <div className="scoreboard">
        Correct: {score.correct} | Wrong: {score.wrong}
      </div>
      {currentWord && (
        <div className={`word-container ${status}`}>
          <div className="word">{currentWord.hangul}</div>
          {!feedback && (
            <form onSubmit={handleSubmit} className="input-container">
              <input
                type="text"
                value={userInput}
                placeholder="Type romanization..."
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button type="submit">Check</button>
            </form>
          )}
          {feedback && (
            <>
              <div className="feedback">{feedback}</div>
              <div className="feedback">Translation: "{currentWord.translation}"</div>
              <button onClick={pickRandomWord}>Next Word</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
