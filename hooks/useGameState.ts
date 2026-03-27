'use client';
import { useReducer, useCallback } from 'react';
import type { Track, Difficulty } from '../lib/tracks';
import type { RoundScore } from '../lib/scoring';

export type GamePhase = 'start' | 'playing' | 'result' | 'gameover';

export type GameState =
  | { phase: 'start' }
  | { phase: 'playing'; round: number; score: number; difficulty: Difficulty; tracks: Track[] }
  | { phase: 'result'; round: number; score: number; roundScore: RoundScore; track: Track; guess: number; difficulty: Difficulty; tracks: Track[]; allRounds: RoundScore[] }
  | { phase: 'gameover'; score: number; rounds: RoundScore[]; difficulty: Difficulty; playerName: string };

type Action =
  | { type: 'START'; difficulty: Difficulty; tracks: Track[] }
  | { type: 'SUBMIT_GUESS'; roundScore: RoundScore; track: Track; guess: number }
  | { type: 'NEXT_ROUND' }
  | { type: 'GAME_OVER'; playerName: string; allRounds: RoundScore[] }
  | { type: 'RESTART' };

const ROUNDS_PER_GAME = 10;

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return {
        phase: 'playing',
        round: 1,
        score: 0,
        difficulty: action.difficulty,
        tracks: action.tracks,
      };

    case 'SUBMIT_GUESS': {
      if (state.phase !== 'playing') return state;
      const newScore = state.score + action.roundScore.total;
      const prevRounds = 'allRounds' in state ? (state as { allRounds: RoundScore[] }).allRounds : [];
      return {
        phase: 'result',
        round: state.round,
        score: newScore,
        roundScore: action.roundScore,
        track: action.track,
        guess: action.guess,
        difficulty: state.difficulty,
        tracks: state.tracks,
        allRounds: [...prevRounds, action.roundScore],
      };
    }

    case 'NEXT_ROUND': {
      if (state.phase !== 'result') return state;
      return {
        phase: 'playing',
        round: state.round + 1,
        score: state.score,
        difficulty: state.difficulty,
        tracks: state.tracks,
      };
    }

    case 'GAME_OVER': {
      if (state.phase !== 'result') return state;
      return {
        phase: 'gameover',
        score: state.score,
        rounds: action.allRounds,
        difficulty: state.difficulty,
        playerName: action.playerName,
      };
    }

    case 'RESTART':
      return { phase: 'start' };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, { phase: 'start' });

  const startGame = useCallback((difficulty: Difficulty, tracks: Track[]) => {
    dispatch({ type: 'START', difficulty, tracks });
  }, []);

  const submitGuess = useCallback((roundScore: RoundScore, track: Track, guess: number) => {
    dispatch({ type: 'SUBMIT_GUESS', roundScore, track, guess });
  }, []);

  const nextRound = useCallback(() => {
    dispatch({ type: 'NEXT_ROUND' });
  }, []);

  const gameOver = useCallback((playerName: string, allRounds: RoundScore[]) => {
    dispatch({ type: 'GAME_OVER', playerName, allRounds });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  return { state, startGame, submitGuess, nextRound, gameOver, restart };
}
