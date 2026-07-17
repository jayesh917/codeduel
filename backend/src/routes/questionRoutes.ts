import { Router } from 'express';
import {
  getAllQuestions,
  getRandomQuestion,
  getBalancedQuestions,
  getByParam
} from '../controllers/questionController';

const router = Router();

router.get('/', getAllQuestions);
router.get('/random', getRandomQuestion);
router.get('/balanced', getBalancedQuestions);
router.get('/:param', getByParam); // Handles both /:language and /:difficulty

export default router;
