// routes/interactionsRoutes.mjs
import express from 'express';
import { createOrUpdateInteraction, getInteractions, getFeatureIdInteractions, createOrUpdateFeatureIdInteraction, getUserFeatureInteractions } from './interactionsController.mjs';

const router = express.Router();

// General interactions routes
router.post('/interactions/:username', createOrUpdateInteraction);
router.get('/interactions/:username', getInteractions);

// Feature-specific interactions routes
router.get('/interactions/:username/:featureName/:featureId', getFeatureIdInteractions);
router.post('/interactions/:username/:featureName/:featureId', createOrUpdateFeatureIdInteraction);

// Shortened feature-specific interactions route
router.get('/int/:username/:featureName', getUserFeatureInteractions);

export default router;