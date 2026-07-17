import { Request, Response } from 'express';
import { questionService } from '../services/QuestionService';

export const getAllQuestions = (req: Request, res: Response) => {
  res.json(questionService.getAllQuestions());
};

export const getQuestionsByLanguage = (req: Request, res: Response) => {
  const { language } = req.params;
  res.json(questionService.getQuestionsByLanguage(language));
};

export const getQuestionsByDifficulty = (req: Request, res: Response) => {
  const { difficulty } = req.params;
  res.json(questionService.getQuestionsByDifficulty(difficulty));
};

export const getRandomQuestion = (req: Request, res: Response) => {
  const language = req.query.language as string | undefined;
  const difficulty = req.query.difficulty as string | undefined;
  const question = questionService.getRandomQuestion(language, difficulty);
  
  if (!question) {
    return res.status(404).json({ error: 'No question found matching criteria.' });
  }
  res.json(question);
};

export const getBalancedQuestions = (req: Request, res: Response) => {
  const language = req.query.language as string;
  const bestOf = parseInt(req.query.bestOf as string, 10);
  
  if (!language || isNaN(bestOf)) {
    return res.status(400).json({ error: 'Language and bestOf parameters are required.' });
  }
  
  res.json(questionService.getBalancedQuestions(language, bestOf));
};

export const getByParam = (req: Request, res: Response) => {
  const param = req.params.param.toLowerCase();
  if (['easy', 'medium', 'hard'].includes(param)) {
    return getQuestionsByDifficulty(req, res);
  }
  
  req.params.language = req.params.param;
  return getQuestionsByLanguage(req, res);
};
