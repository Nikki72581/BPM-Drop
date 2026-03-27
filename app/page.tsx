'use client';
import { useState } from 'react';
import Scanline from '../components/Scanline';
import StartScreen from '../components/StartScreen';
import GameScreen from '../components/GameScreen';
import ResultScreen from '../components/ResultScreen';
import GameOverScreen from '../components/GameOverScreen';
import { useGameState } from '../hooks/useGameState';
import { fetchTracksForDifficulty, selectRoundTracks } from '../lib/tracks';
import type { Difficulty, Track } from '../lib/tracks';
import type { RoundScore } from '../lib/scoring';

const ROUNDS_PER_GAME = 10;

export default function Home() {
  const { state, startGame, submitGuess, nextRound, gameOver, restart } = useGameState();
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('anonymous');

  const handleStart = async (difficulty: Difficulty, name: string) => {
    setPlayerName(name);
    setLoadError(null);
    setLoadingTracks(true);
    try {
      const allTracks = await fetchTracksForDifficulty(difficulty);
      const tracks = selectRoundTracks(allTracks, ROUNDS_PER_GAME);
      startGame(difficulty, tracks);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load tracks. Check your API key.');
    } finally {
      setLoadingTracks(false);
    }
  };

  const handleGuessSubmit = (roundScore: RoundScore, track: Track, guess: number) => {
    submitGuess(roundScore, track, guess);
  };

  const handleNext = () => {
    if (state.phase !== 'result') return;
    if (state.round >= ROUNDS_PER_GAME) {
      gameOver(playerName, state.allRounds);
    } else {
      nextRound();
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a12',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Scanline />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {state.phase === 'start' && (
          <>
            <StartScreen
              onStart={handleStart}
              loading={loadingTracks}
            />
            {loadError && (
              <div style={{
                maxWidth: '520px',
                margin: '0 auto',
                padding: '0 24px',
                textAlign: 'center',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                color: '#ff4444',
              }}>
                {loadError}
              </div>
            )}
          </>
        )}

        {state.phase === 'playing' && (
          <GameScreen
            key={`round-${state.round}`}
            round={state.round}
            score={state.score}
            track={state.tracks[state.round - 1]}
            onGuessSubmit={handleGuessSubmit}
            onQuit={restart}
          />
        )}

        {state.phase === 'result' && (
          <ResultScreen
            roundScore={state.roundScore}
            track={state.track}
            guess={state.guess}
            round={state.round}
            totalScore={state.score}
            isLastRound={state.round >= ROUNDS_PER_GAME}
            onNext={handleNext}
          />
        )}

        {state.phase === 'gameover' && (
          <GameOverScreen
            score={state.score}
            rounds={state.rounds}
            difficulty={state.difficulty}
            playerName={state.playerName}
            onPlayAgain={restart}
          />
        )}
      </div>
    </main>
  );
}
