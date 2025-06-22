import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle, XCircle } from 'lucide-react';

const QuizComponent = ({ onClose }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  const questions = {
    '2': [
      {
        subject: 'Mathematics',
        question: 'What is 5 + 3?',
        options: ['6', '7', '8', '9'],
        correct: '8'
      },
      {
        subject: 'Mathematics',
        question: 'How many sides does a triangle have?',
        options: ['2', '3', '4', '5'],
        correct: '3'
      },
      {
        subject: 'Science',
        question: 'What color do you get when you mix red and yellow?',
        options: ['Purple', 'Orange', 'Green', 'Blue'],
        correct: 'Orange'
      },
      {
        subject: 'Mathematics',
        question: 'What is 10 - 4?',
        options: ['5', '6', '7', '8'],
        correct: '6'
      },
      {
        subject: 'Science',
        question: 'How many legs does a spider have?',
        options: ['6', '8', '10', '12'],
        correct: '8'
      },
      {
        subject: 'Mathematics',
        question: 'What comes after 19?',
        options: ['18', '20', '21', '22'],
        correct: '20'
      },
      {
        subject: 'Science',
        question: 'What do plants need to grow?',
        options: ['Only water', 'Only sunlight', 'Water and sunlight', 'Nothing'],
        correct: 'Water and sunlight'
      },
      {
        subject: 'Mathematics',
        question: 'How many minutes are in one hour?',
        options: ['50', '60', '70', '80'],
        correct: '60'
      },
      {
        subject: 'Science',
        question: 'Which is the hottest season?',
        options: ['Winter', 'Spring', 'Summer', 'Fall'],
        correct: 'Summer'
      },
      {
        subject: 'Mathematics',
        question: 'What is half of 10?',
        options: ['3', '4', '5', '6'],
        correct: '5'
      }
    ],
    '5': [
      {
        subject: 'Mathematics',
        question: 'What is 15 × 4?',
        options: ['56', '60', '64', '58'],
        correct: '60'
      },
      {
        subject: 'Science',
        question: 'What is the process by which plants make their food called?',
        options: ['Respiration', 'Photosynthesis', 'Digestion', 'Circulation'],
        correct: 'Photosynthesis'
      },
      {
        subject: 'Mathematics',
        question: 'What is the area of a rectangle with length 8 cm and width 5 cm?',
        options: ['40 sq cm', '35 sq cm', '30 sq cm', '45 sq cm'],
        correct: '40 sq cm'
      },
      {
        subject: 'Science',
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correct: 'Mars'
      },
      {
        subject: 'Mathematics',
        question: 'What is 144 ÷ 12?',
        options: ['11', '12', '13', '14'],
        correct: '12'
      },
      {
        subject: 'Science',
        question: 'What is the hardest natural substance on Earth?',
        options: ['Gold', 'Iron', 'Diamond', 'Silver'],
        correct: 'Diamond'
      },
      {
        subject: 'Mathematics',
        question: 'Convert 2.5 hours to minutes:',
        options: ['120 minutes', '150 minutes', '180 minutes', '200 minutes'],
        correct: '150 minutes'
      },
      {
        subject: 'Science',
        question: 'What gas do plants absorb from the atmosphere during photosynthesis?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
        correct: 'Carbon Dioxide'
      },
      {
        subject: 'Mathematics',
        question: 'What is the perimeter of a square with each side 7 cm?',
        options: ['21 cm', '28 cm', '35 cm', '42 cm'],
        correct: '28 cm'
      },
      {
        subject: 'Science',
        question: 'How many bones are there in an adult human body?',
        options: ['196', '206', '216', '226'],
        correct: '206'
      }
    ],
    '10': [
      {
        subject: 'Mathematics',
        question: 'Solve: 2x + 5 = 15. What is x?',
        options: ['5', '10', '15', '20'],
        correct: '5'
      },
      {
        subject: 'Science',
        question: 'What is the chemical formula for water?',
        options: ['H2O', 'CO2', 'NaCl', 'CH4'],
        correct: 'H2O'
      },
      {
        subject: 'Mathematics',
        question: 'What is the value of sin 30°?',
        options: ['1/2', '√3/2', '1', '0'],
        correct: '1/2'
      },
      {
        subject: 'Science',
        question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
        correct: 'Mitochondria'
      },
      {
        subject: 'Mathematics',
        question: 'If log₁₀(100) = x, what is x?',
        options: ['1', '2', '10', '100'],
        correct: '2'
      },
      {
        subject: 'Science',
        question: 'What is the atomic number of Carbon?',
        options: ['4', '6', '8', '12'],
        correct: '6'
      },
      {
        subject: 'Mathematics',
        question: 'Find the derivative of x²:',
        options: ['x', '2x', 'x²', '2x²'],
        correct: '2x'
      },
      {
        subject: 'Science',
        question: 'What type of bond is formed between Na and Cl in NaCl?',
        options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
        correct: 'Ionic'
      },
      {
        subject: 'Mathematics',
        question: 'What is the sum of angles in a triangle?',
        options: ['90°', '180°', '270°', '360°'],
        correct: '180°'
      },
      {
        subject: 'Science',
        question: 'Which law states that force equals mass times acceleration?',
        options: ['Newton\'s First Law', 'Newton\'s Second Law', 'Newton\'s Third Law', 'Law of Gravitation'],
        correct: 'Newton\'s Second Law'
      }
    ]
  };

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      setShowResult(true);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, showResult]);

  const startQuiz = () => {
    if (selectedClass) {
      setQuizStarted(true);
      setCurrentQuestion(0);
      setScore(0);
      setTimeLeft(300);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    if (selectedAnswer === questions[selectedClass][currentQuestion].correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion + 1 < questions[selectedClass].length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setSelectedClass('');
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setShowResult(false);
    setTimeLeft(300);
    setQuizStarted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">LearnED Quiz</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {!quizStarted && !showResult && (
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Select Your Class</h3>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {['2', '5', '10'].map((classNum) => (
                  <button
                    key={classNum}
                    onClick={() => setSelectedClass(classNum)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedClass === classNum
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-300 hover:border-red-300'
                    }`}
                  >
                    <div className="text-2xl font-bold">Class {classNum}</div>
                    <div className="text-sm text-gray-600">Math & Science</div>
                  </button>
                ))}
              </div>
              <button
                onClick={startQuiz}
                disabled={!selectedClass}
                className={`btn-primary ${!selectedClass ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Start Quiz (10 Questions)
              </button>
            </div>
          )}

          {quizStarted && !showResult && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions[selectedClass].length}
                </div>
                <div className="flex items-center gap-2 text-red-600">
                  <Clock size={16} />
                  <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="mb-4">
                <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {questions[selectedClass][currentQuestion].subject}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {questions[selectedClass][currentQuestion].question}
                </h3>
              </div>

              <div className="space-y-3 mb-8">
                {questions[selectedClass][currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === option
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                onClick={nextQuestion}
                disabled={!selectedAnswer}
                className={`btn-primary w-full ${!selectedAnswer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {currentQuestion === questions[selectedClass].length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          )}

          {showResult && (
            <div className="text-center">
              <div className="mb-6">
                {score >= 7 ? (
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                <p className="text-lg text-gray-600">
                  You scored <span className="font-bold text-red-600">{score}</span> out of{' '}
                  <span className="font-bold">{questions[selectedClass].length}</span>
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {Math.round((score / questions[selectedClass].length) * 100)}%
                </div>
                <p className="text-gray-600">
                  {score >= 8 ? 'Excellent work!' : score >= 6 ? 'Good job!' : 'Keep practicing!'}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={restartQuiz} className="btn-secondary">
                  Take Another Quiz
                </button>
                <button onClick={onClose} className="btn-primary">
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizComponent;