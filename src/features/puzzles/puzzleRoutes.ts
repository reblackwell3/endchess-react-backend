// backend/puzzles/puzzleRoutes.js
import express from 'express';
const router = express.Router();
const {
  getRandomPuzzle,
  getRandomPuzzleRated,
  getNextPuzzle,
  getPuzzleById,
} = require('./puzzleController');

// Get a random puzzle
router.get('/random', getRandomPuzzle);

router.get('/random-rated/:rating', getRandomPuzzleRated);

// Get the next puzzle based on elo and player ID
router.get('/next', getNextPuzzle);

// Get a single puzzle by ID
router.get('/:id', getPuzzleById);

export default router;