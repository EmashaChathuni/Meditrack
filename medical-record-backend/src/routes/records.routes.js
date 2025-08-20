import { Router } from 'express';
import { createRecord, getRecords, deleteRecord } from '../controllers/record.controller.js';
import auth from '../middleware/auth.js'; // Protect routes with authentication

const router = Router();

// Get all records
router.get('/', auth, getRecords);

// Create a new record
router.post('/', auth, createRecord);

// Delete a record by ID
router.delete('/:id', auth, deleteRecord);

export default router;
