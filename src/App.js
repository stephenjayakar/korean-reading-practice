import React, { useState, useEffect, useRef } from 'react';
import words from './words';
import './App.css';

const normalizeRomanization = (str) => {
  let normalized = str.trim().toLowerCase();
  normalized = normalized.replace(/r/g, 'l');
  return normalized;
};

const App = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState(''); // 'correct', 'wrong', or ''
  const inputRef = useRef(null);

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

  useEffect(() => {
    // Focus the input when a new word is loaded and no feedback is displayed
    if (inputRef.current && !feedback) {
      inputRef.current.focus();
    }
  }, [feedback, currentWord]);

  useEffect(() => {
    // Only add the global keydown listener when feedback is shown
    // This listener will handle pressing Enter to go to next word.
    const handleGlobalKeyDown = (e) => {
      if (feedback && e.key === 'Enter') {
        e.preventDefault(); // Prevent any default action
        handleNextWord();
      }
    };

    if (feedback) {
      window.addEventListener('keydown', handleGlobalKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [feedback]);

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

  const handleNextWord = () => {
    pickRandomWord();
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
                ref={inputRef}
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
              <button onClick={handleNextWord}>Next Word</button>
              <div style={{ marginTop: '5px', fontSize: '0.9rem', color: '#666' }}>
                (Press Enter for next word)
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
