import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle, XCircle, Trophy, Star, BookOpen } from 'lucide-react';

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
    '8': [
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
        question: 'What is the value of √64?',
        options: ['6', '7', '8', '9'],
        correct: '8'
      },
      {
        subject: 'Science',
        question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
        correct: 'Mitochondria'
      },
      {
        subject: 'Mathematics',
        question: 'If a triangle has angles 60°, 60°, what is the third angle?',
        options: ['30°', '60°', '90°', '120°'],
        correct: '60°'
      },
      {
        subject: 'Science',
        question: 'What is the atomic number of Carbon?',
        options: ['4', '6', '8', '12'],
        correct: '6'
      },
      {
        subject: 'Mathematics',
        question: 'What is 25% of 80?',
        options: ['15', '20', '25', '30'],
        correct: '20'
      },
      {
        subject: 'Science',
        question: 'Which gas is most abundant in Earth\'s atmosphere?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
        correct: 'Nitrogen'
      },
      {
        subject: 'Mathematics',
        question: 'What is the sum of angles in a triangle?',
        options: ['90°', '180°', '270°', '360°'],
        correct: '180°'
      },
      {
        subject: 'Science',
        question: 'What type of energy is stored in food?',
        options: ['Kinetic', 'Potential', 'Chemical', 'Thermal'],
        correct: 'Chemical'
      }
    ]
  };

  const getScoreMessage = (score, total) => {
    const percentage = (score / total) * 100;
    
    if (percentage >= 90) {
      return {
        title: "Outstanding! 🌟",
        message: "You're a true champion! Your dedication to learning shines through. You have excellent conceptual understanding and are ready for more advanced challenges!",
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: <Trophy className="w-12 h-12 text-yellow-500" />
      };
    } else if (percentage >= 80) {
      return {
        title: "Excellent Work! 🎉",
        message: "You've shown great understanding of the concepts! With a little more practice, you'll be mastering these topics completely. Keep up the fantastic effort!",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        icon: <Star className="w-12 h-12 text-blue-500" />
      };
    } else if (percentage >= 70) {
      return {
        title: "Good Job! 👏",
        message: "You're on the right track! You understand most concepts well. A bit more focus on the areas you missed will help you excel even further!",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        icon: <BookOpen className="w-12 h-12 text-indigo-500" />
      };
    } else if (percentage >= 60) {
      return {
        title: "Keep Learning! 📚",
        message: "You've got the basics down! With more practice and revision, you'll see significant improvement. Remember, every expert was once a beginner!",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        icon: <BookOpen className="w-12 h-12 text-orange-500" />
      };
    } else {
      return {
        title: "Practice Makes Perfect! 💪",
        message: "Don't worry - learning is a journey! Focus on understanding the fundamentals, and you'll see amazing progress. Our teachers are here to help you succeed!",
        color: "text-red-600",
        bgColor: "bg-red-50",
        icon: <BookOpen className="w-12 h-12 text-red-500" />
      };
    }
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

  const availableClasses = ['2', '3', '4', '5', '6', '7', '8'];
  const scoreMessage = showResult ? getScoreMessage(score, questions[selectedClass]?.length || 10) : null;

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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">LearnED Assessment</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {!quizStarted && !showResult && (
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Select Your Class Level</h3>
              <div className="grid grid-cols-4 gap-3 mb-8">
                {availableClasses.map((classNum) => (
                  <button
                    key={classNum}
                    onClick={() => setSelectedClass(classNum)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedClass === classNum
                        ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 text-red-600'
                        : 'border-gray-300 hover:border-red-300 hover:bg-red-25'
                    }`}
                  >
                    <div className="text-lg font-bold">Class {classNum}</div>
                    <div className="text-xs text-gray-600">Math & Science</div>
                  </button>
                ))}
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl mb-6">
                <p className="text-blue-800 text-sm">
                  📝 This assessment will help us understand your current level and customize learning for you!
                </p>
              </div>
              <button
                onClick={startQuiz}
                disabled={!selectedClass}
                className={`bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all ${
                  !selectedClass ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-800 transform hover:scale-105'
                }`}
              >
                Start Assessment (10 Questions)
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
                  <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="mb-4">
                <span className="inline-block bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
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
                        ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                onClick={nextQuestion}
                disabled={!selectedAnswer}
                className={`bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold w-full transition-all ${
                  !selectedAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-800 transform hover:scale-105'
                }`}
              >
                {currentQuestion === questions[selectedClass].length - 1 ? 'Complete Assessment' : 'Next Question'}
              </button>
            </div>
          )}

          {showResult && scoreMessage && (
            <div className="text-center">
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  {scoreMessage.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${scoreMessage.color}`}>{scoreMessage.title}</h3>
                <div className={`${scoreMessage.bgColor} rounded-2xl p-6 mb-6`}>
                  <p className={`text-lg ${scoreMessage.color} mb-4`}>
                    You scored <span className="font-bold text-2xl">{score}</span> out of{' '}
                    <span className="font-bold text-2xl">{questions[selectedClass].length}</span>
                  </p>
                  <div className={`text-4xl font-bold mb-4 ${scoreMessage.color}`}>
                    {Math.round((score / questions[selectedClass].length) * 100)}%
                  </div>
                  <p className={`${scoreMessage.color} leading-relaxed`}>
                    {scoreMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={restartQuiz} 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Try Another Class
                </button>
                <button 
                  onClick={onClose} 
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all"
                >
                  Book Free Demo
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