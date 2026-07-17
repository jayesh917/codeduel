import fs from 'fs';
import path from 'path';
import { Question } from '../../../shared/types';

const DEFAULT_QUESTIONS: Question[] = [
  // Python Easy
  {
    id: 'py-easy-1',
    language: 'Python',
    difficulty: 'Easy',
    type: 'Single Correct',
    title: 'Exponentiation Operator',
    description: 'Calculate the value of print(2 ** 3) in Python.',
    question: 'What is the output of print(2 ** 3)?',
    options: ['6', '8', '9', '16'],
    correctAnswer: '8',
    explanation: '** is the exponentiation operator in Python. 2 raised to power 3 is 8.',
    points: 10,
    timeLimit: 30,
    tags: ['operators'],
    createdAt: Date.now()
  },
  // Python Medium
  {
    id: 'py-med-1',
    language: 'Python',
    difficulty: 'Medium',
    type: 'Single Correct',
    title: 'List Comprehension Filtering',
    description: 'Evaluate the following list comprehension: [x for x in range(5) if x % 2 == 0]',
    question: 'What is the result of [x for x in range(5) if x % 2 == 0] in Python?',
    options: ['[0, 2, 4]', '[2, 4]', '[1, 3]', '[0, 1, 2, 3, 4]'],
    correctAnswer: '[0, 2, 4]',
    explanation: 'range(5) generates integers from 0 to 4. The condition x % 2 == 0 filters out odd numbers, keeping 0, 2, and 4.',
    points: 20,
    timeLimit: 45,
    tags: ['lists', 'comprehension'],
    createdAt: Date.now()
  },
  // Python Hard
  {
    id: 'py-hard-1',
    language: 'Python',
    difficulty: 'Hard',
    type: 'Single Correct',
    title: 'Mutable Default Arguments',
    description: 'def append_to(num, target=[]):\n    target.append(num)\n    return target\n\nprint(append_to(1))\nprint(append_to(2))',
    question: 'What is the output of calling append_to(1) followed by append_to(2)?',
    options: ['[1] and [2]', '[1] and [1, 2]', '[1, 2] and [1, 2]', 'Error'],
    correctAnswer: '[1] and [1, 2]',
    explanation: 'In Python, default arguments are evaluated once when the function is defined, not each time the function is called. Thus, the same list is reused across calls.',
    points: 30,
    timeLimit: 90,
    tags: ['functions', 'gotchas'],
    createdAt: Date.now()
  },
  // JavaScript Easy
  {
    id: 'js-easy-1',
    language: 'JavaScript',
    difficulty: 'Easy',
    type: 'Single Correct',
    title: 'Array Type Check',
    description: 'Check the return value of typeof operator on an empty array [] in JavaScript.',
    question: 'What does the expression "typeof []" evaluate to?',
    options: ['"array"', '"object"', '"null"', '"undefined"'],
    correctAnswer: '"object"',
    explanation: 'In JavaScript, arrays are technically objects, so typeof [] returns "object".',
    points: 10,
    timeLimit: 30,
    tags: ['types'],
    createdAt: Date.now()
  },
  // JavaScript Medium
  {
    id: 'js-med-1',
    language: 'JavaScript',
    difficulty: 'Medium',
    type: 'Single Correct',
    title: 'Type Coercion Concatenation',
    description: 'Evaluate the output of: console.log(1 + "2" + 3)',
    question: 'What is printed by console.log(1 + "2" + 3) in JavaScript?',
    options: ['"6"', '"123"', '"33"', '"15"'],
    correctAnswer: '"123"',
    explanation: 'First, 1 + "2" performs string concatenation resulting in "12". Then "12" + 3 results in "123".',
    points: 20,
    timeLimit: 45,
    tags: ['coercion'],
    createdAt: Date.now()
  },
  // JavaScript Hard
  {
    id: 'js-hard-1',
    language: 'JavaScript',
    difficulty: 'Hard',
    type: 'Single Correct',
    title: 'Event Loop Microtasks',
    description: 'console.log("Start");\nsetTimeout(() => console.log("Timeout"), 0);\nPromise.resolve().then(() => console.log("Promise"));\nconsole.log("End");',
    question: 'What is the correct order of output for the code snippet?',
    options: [
      'Start, End, Timeout, Promise',
      'Start, End, Promise, Timeout',
      'Start, Promise, End, Timeout',
      'Start, Timeout, Promise, End'
    ],
    correctAnswer: 'Start, End, Promise, Timeout',
    explanation: 'Microtasks (Promises) are executed before macrotasks (setTimeout) after the current execution stack finishes.',
    points: 30,
    timeLimit: 90,
    tags: ['event-loop', 'async'],
    createdAt: Date.now()
  },
  // Java Easy
  {
    id: 'java-easy-1',
    language: 'Java',
    difficulty: 'Easy',
    type: 'Single Correct',
    title: 'Inheritance Keyword',
    description: 'Choose the keyword used for subclassing in Java.',
    question: 'Which keyword is used to create a subclass of a class in Java?',
    options: ['implements', 'extends', 'inherits', 'subclass'],
    correctAnswer: 'extends',
    explanation: 'The "extends" keyword is used to inherit from a class in Java.',
    points: 10,
    timeLimit: 30,
    tags: ['oop', 'inheritance'],
    createdAt: Date.now()
  },
  // Java Medium
  {
    id: 'java-med-1',
    language: 'Java',
    difficulty: 'Medium',
    type: 'Single Correct',
    title: 'String Constant Pool Comparison',
    description: 'String s1 = "hello";\nString s2 = new String("hello");\nSystem.out.println(s1 == s2);',
    question: 'What is the output of the comparisons?',
    options: ['true', 'false', 'compile error', 'NullPointerException'],
    correctAnswer: 'false',
    explanation: '== compares memory references. s1 points to the String Constant Pool, while s2 points to a new object on the heap, so they are not equal.',
    points: 20,
    timeLimit: 45,
    tags: ['strings', 'memory'],
    createdAt: Date.now()
  },
  // Java Hard
  {
    id: 'java-hard-1',
    language: 'Java',
    difficulty: 'Hard',
    type: 'Single Correct',
    title: 'Garbage Collection Finalize',
    description: 'Which method is called by the Garbage Collector before destroying an object?',
    question: 'What method of the Object class is invoked by GC before reclaiming memory?',
    options: ['destroy()', 'finalize()', 'gc()', 'cleanup()'],
    correctAnswer: 'finalize()',
    explanation: 'Java Object class has a finalize() method which is called by the Garbage Collector just before the object is destroyed.',
    points: 30,
    timeLimit: 90,
    tags: ['gc', 'memory'],
    createdAt: Date.now()
  },
  // C++ Easy
  {
    id: 'cpp-easy-1',
    language: 'C++',
    difficulty: 'Easy',
    type: 'Single Correct',
    title: 'Standard Console Output',
    description: 'Identify the operator/stream used to output text to console in C++.',
    question: 'Which standard stream is used to print text to the console in C++?',
    options: ['cin', 'cout', 'print', 'printf'],
    correctAnswer: 'cout',
    explanation: 'std::cout (character output) is the standard output stream in C++.',
    points: 10,
    timeLimit: 30,
    tags: ['io'],
    createdAt: Date.now()
  },
  // C++ Medium
  {
    id: 'cpp-med-1',
    language: 'C++',
    difficulty: 'Medium',
    type: 'Single Correct',
    title: 'Pointer Address Arithmetic',
    description: 'int arr[] = {10, 20, 30};\nint* p = arr;\np++;\ncout << *p;',
    question: 'What does this print in C++?',
    options: ['10', '20', '30', 'Address of arr'],
    correctAnswer: '20',
    explanation: 'arr acts as a pointer to the first element. p++ advances p to point to the next integer in memory, which is 20.',
    points: 20,
    timeLimit: 45,
    tags: ['pointers'],
    createdAt: Date.now()
  },
  // C++ Hard
  {
    id: 'cpp-hard-1',
    language: 'C++',
    difficulty: 'Hard',
    type: 'Single Correct',
    title: 'Virtual Destructors Purpose',
    description: 'Why should a base class destructor be declared virtual?',
    question: 'What is the main reason to use a virtual destructor in C++ base classes?',
    options: [
      'To prevent memory leaks when deleting derived class objects via a base class pointer',
      'To speed up garbage collection',
      'To allow private destructors',
      'To force classes to be abstract'
    ],
    correctAnswer: 'To prevent memory leaks when deleting derived class objects via a base class pointer',
    explanation: 'If a derived class object is deleted using a base class pointer, a virtual destructor ensures the derived class destructor is called, preventing leaks.',
    points: 30,
    timeLimit: 90,
    tags: ['oop', 'destructors'],
    createdAt: Date.now()
  }
];

class QuestionService {
  private questions: Question[] = [];
  private byLanguage: Map<string, Question[]> = new Map();
  private byLangAndDiff: Map<string, Question[]> = new Map();

  constructor() {
    this.loadQuestions();
  }

  private indexQuestions() {
    this.byLanguage.clear();
    this.byLangAndDiff.clear();
    for (const q of this.questions) {
      const lang = q.language.toLowerCase();
      if (!this.byLanguage.has(lang)) this.byLanguage.set(lang, []);
      this.byLanguage.get(lang)!.push(q);
      
      const langDiff = `${lang}-${q.difficulty.toLowerCase()}`;
      if (!this.byLangAndDiff.has(langDiff)) this.byLangAndDiff.set(langDiff, []);
      this.byLangAndDiff.get(langDiff)!.push(q);
    }
  }

  private loadQuestions() {
    // Add default questions
    this.questions.push(...DEFAULT_QUESTIONS);

    const dir = path.join(process.cwd(), 'backend/src/data/questions');
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const content = fs.readFileSync(path.join(dir, file), 'utf-8');
            try {
              const parsed = JSON.parse(content);
              if (Array.isArray(parsed)) {
                this.questions.push(...parsed);
              }
            } catch {
              console.error(`Error parsing ${file}`);
            }
          }
        }
      } catch (err) {
        console.error('Error reading questions folder:', err);
      }
    }
    
    // Remove duplicates by id
    const uniqueMap = new Map<string, Question>();
    for (const q of this.questions) {
      uniqueMap.set(q.id, q);
    }
    this.questions = Array.from(uniqueMap.values());
    this.indexQuestions();
  }

  public getAllQuestions(): Question[] {
    return this.questions;
  }

  public getQuestionsByLanguage(language: string): Question[] {
    return this.byLanguage.get(language.toLowerCase()) || [];
  }

  public getQuestionsByDifficulty(difficulty: string): Question[] {
    return this.questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  public getRandomQuestion(language?: string, difficulty?: string): Question | null {
    let pool = this.questions;
    if (language && difficulty) {
      pool = this.byLangAndDiff.get(`${language.toLowerCase()}-${difficulty.toLowerCase()}`) || [];
    } else if (language) {
      pool = this.byLanguage.get(language.toLowerCase()) || [];
    } else if (difficulty) {
      pool = pool.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  public getBalancedQuestions(language: string, bestOf: number): Question[] {
    const lang = language.toLowerCase();
    const easy = this.byLangAndDiff.get(`${lang}-easy`) || [];
    const medium = this.byLangAndDiff.get(`${lang}-medium`) || [];
    const hard = this.byLangAndDiff.get(`${lang}-hard`) || [];

    const shuffle = (array: Question[]) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const shuffledEasy = shuffle(easy);
    const shuffledMedium = shuffle(medium);
    const shuffledHard = shuffle(hard);

    let eCount: number, mCount: number, hCount: number;
    if (bestOf === 3) { eCount = 1; mCount = 1; hCount = 1; }
    else if (bestOf === 5) { eCount = 2; mCount = 2; hCount = 1; }
    else if (bestOf === 10) { eCount = 3; mCount = 4; hCount = 3; }
    else if (bestOf === 15) { eCount = 5; mCount = 5; hCount = 5; }
    else { eCount = 1; mCount = 1; hCount = 1; } // fallback

    const selected = [
      ...shuffledEasy.slice(0, eCount),
      ...shuffledMedium.slice(0, mCount),
      ...shuffledHard.slice(0, hCount)
    ];

    const shuffledSelected = shuffle(selected);

    // Padding fallback if there are not enough questions in the selected list
    if (shuffledSelected.length < bestOf) {
      const langPool = this.getQuestionsByLanguage(language);
      if (langPool.length > 0) {
        while (shuffledSelected.length < bestOf) {
          shuffledSelected.push(langPool[Math.floor(Math.random() * langPool.length)]);
        }
      } else {
        // Ultimate fallback if the pool for the language has literally 0 questions
        while (shuffledSelected.length < bestOf) {
          shuffledSelected.push({
            id: `fallback-${shuffledSelected.length}`,
            language,
            difficulty: 'Easy',
            type: 'Single Correct',
            title: 'Sample Coding Question',
            description: 'What is the return value of a function that has no return statement?',
            question: 'What does a Python function return by default when there is no return statement?',
            options: ['None', 'Null', 'void', 'undefined'],
            correctAnswer: 'None',
            explanation: 'In Python, functions return None by default if no return statement is specified.',
            points: 10,
            timeLimit: 30,
            tags: ['basics'],
            createdAt: Date.now()
          });
        }
      }
    }

    return shuffledSelected;
  }
}

export const questionService = new QuestionService();
