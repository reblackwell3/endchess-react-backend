// backend/server.js
import express, { NextFunction, Request } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import dotenv from 'dotenv';
import puzzleRoutes from './features/puzzles/puzzleRoutes';
import playerRoutes from './features/players/playerRoutes';
import gameRoutes from './features/games/gameRoutes';
import importRoutes from './features/import/importRoutes';
import authRoutes from './features/_auth/tokenRoutes';
import { attachPlayerId } from './features/_middleware/addPlayerIdMiddleware';
import {
  authenticateToken,
  createOrUpdateAuth,
} from './features/_middleware/authMiddleware';

dotenv.config({ path: '.env' });

const app = express();
app.use(cors<Request>());

connectDB();

app.use(express.json());

app.use('/auth', authRoutes);

app.use(authenticateToken);

app.use(createOrUpdateAuth);

app.use(attachPlayerId);

app.use('/puzzles', puzzleRoutes);

app.use('/players', playerRoutes);

app.use('/games', gameRoutes);

app.use('/import', importRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
