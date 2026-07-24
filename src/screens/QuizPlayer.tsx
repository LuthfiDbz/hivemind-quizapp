import { useState, useEffect } from 'react';
import { fetchQuestions, type QuizQuestion } from '../services/api';
import { useQuizStore } from '../store/useQuizStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Loader2, Timer, AlertCircle, Home, ArrowRight } from 'lucide-react';

export function QuizPlayer() {
  const { 
    addScore, setCurrentScreen, selectedCategory 
  } = useQuizStore();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isInitializing) return;

    async function initQuestions() {
      const bank = useQuizStore.getState().questionBank[selectedCategory] || [];
      
      if (bank.length >= 10) {
        const shuffled = [...bank].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        
        setQuestions(selected);
        const remaining = bank.filter(q => !selected.find(s => s.id === q.id));
        useQuizStore.setState(state => ({
          questionBank: {
            ...state.questionBank,
            [selectedCategory]: remaining
          }
        }));
        
        setIsInitializing(false);
      } else {
        try {
          const fetched = await fetchQuestions(100, selectedCategory);
          const shuffled = [...fetched].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 10);
          const remaining = shuffled.slice(10);
          
          setQuestions(selected);
          useQuizStore.getState().addQuestionsToBank(selectedCategory, remaining);
          setIsInitializing(false);
        } catch (err: any) {
          setFetchError(err.message || 'Failed to fetch');
          setIsInitializing(false);
        }
      }
    }
    
    initQuestions();
  }, [isInitializing, selectedCategory]);

  useEffect(() => {
    // If not ready, answered, time ran out, or no questions, don't tick
    if (!isReady || selectedAnswer || timeLeft <= 0 || questions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isReady, timeLeft, selectedAnswer, questions]);

  const handleAnswerClick = (answerId: string, isCorrect: boolean) => {
    if (selectedAnswer) return; // Prevent multiple clicks
    setSelectedAnswer(answerId);

    if (isCorrect) {
      let points = 100;
      if (timeLeft <= 0) points = 25;
      else if (timeLeft <= 10) points = 50;
      else if (timeLeft <= 20) points = 75;
      addScore(points);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(30);
      setSelectedAnswer(null);
    } else {
      setCurrentScreen('result');
    }
  };

  const quitGame = () => {
    setShowQuitModal(false);
    setCurrentScreen('modes');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-neo-bg flex items-center justify-center">
        <Card variant="yellow" className="p-8 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-neo-blue" size={48} />
          <p className="font-bold text-xl uppercase">Connecting to Hivemind...</p>
        </Card>
      </div>
    );
  }

  if (fetchError || questions.length === 0) {
    return (
      <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
        <Card variant="pink" className="p-8 max-w-lg w-full text-center">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-4">Error loading questions!</h2>
          <p className="font-bold mb-6">{fetchError || 'Not enough questions found for this category.'}</p>
          <Button onClick={() => setCurrentScreen('modes')} variant="secondary">Go Back</Button>
        </Card>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
        <Card variant="green" className="p-8 max-w-lg w-full text-center">
          <h2 className="text-4xl font-black mb-4 uppercase">Quiz is Ready!</h2>
          <p className="font-bold text-lg mb-8">
            You will face 10 questions from the 
            <span className="bg-neo-yellow px-2 py-1 border-2 border-black mx-2 uppercase inline-block my-2">{selectedCategory}</span> 
            category. Answer as fast as you can!
          </p>
          <Button onClick={() => setIsReady(true)} variant="warning" className="w-full text-xl py-4 uppercase">
            Start Quiz
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const getButtonVariant = (ansId: string, isCorrect: boolean) => {
    if (!selectedAnswer) return 'secondary';
    if (ansId === selectedAnswer) {
      return isCorrect ? 'success' : 'danger';
    }
    // Highlight correct answer if user got it wrong
    if (isCorrect) return 'success';
    return 'secondary';
  };

  return (
    <div className="min-h-screen bg-neo-bg p-4 flex flex-col items-center pb-24">
      <header className="w-full max-w-3xl flex justify-between items-center mb-8 bg-white border-4 border-black p-4 shadow-neo">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowQuitModal(true)}
            className="w-10 h-10 flex items-center justify-center bg-neo-pink border-2 border-black hover:-translate-y-1 hover:shadow-neo transition-all cursor-pointer"
            aria-label="Quit game"
          >
            <Home size={20} />
          </button>
          <div className="font-bold text-xl hidden sm:block">Q {currentIndex + 1}/{questions.length}</div>
        </div>
        
        <div className="flex items-center gap-2 font-black text-2xl text-neo-blue">
          <Timer size={28} />
          {timeLeft > 0 ? `${timeLeft}s` : 'TIME OUT!'}
        </div>
      </header>

      <Card variant="default" className="w-full max-w-3xl p-8 mb-8">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block bg-neo-yellow px-2 py-1 border-2 border-black font-bold text-sm uppercase">
            {currentQuestion.category || selectedCategory}
          </span>
          <span className="inline-block bg-white px-2 py-1 border-2 border-black font-bold text-sm uppercase">
            {currentQuestion.difficulty}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black leading-tight">
          {currentQuestion.text}
        </h2>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {currentQuestion.answers.map((ans) => {
          if (!ans.text) return null; // API sometimes has null answers
          return (
            <Button 
              key={ans.id}
              variant={getButtonVariant(ans.id, ans.isCorrect)}
              className={`w-full text-left justify-start min-h-20 p-4 text-lg sm:text-xl ${!selectedAnswer ? 'hover:-translate-y-1 hover:shadow-neo' : 'pointer-events-none'}`}
              onClick={() => handleAnswerClick(ans.id, ans.isCorrect)}
            >
              {ans.text}
            </Button>
          )
        })}
      </div>

      {selectedAnswer && (
        <div className="w-full max-w-3xl mt-8 animate-in slide-in-from-bottom-4">
          {currentQuestion.explanation && (
            <Card variant="blue" className="w-full p-6 text-white mb-6">
              <h3 className="font-black text-xl mb-2">Explanation:</h3>
              <p className="font-bold text-lg">{currentQuestion.explanation}</p>
            </Card>
          )}
          
          <Button 
            variant="warning" 
            onClick={handleNextQuestion} 
            className="w-full text-xl py-4 flex justify-center items-center gap-2"
          >
            {currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}
            <ArrowRight />
          </Button>
        </div>
      )}

      {/* Quit Modal */}
      <Modal
        isOpen={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        title="Quit Game?"
        className="bg-white"
      >
        <p className="font-bold text-lg mb-6">Are you sure you want to quit? Your progress will be lost!</p>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setShowQuitModal(false)} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={quitGame} className="flex-1">
            Quit
          </Button>
        </div>
      </Modal>
    </div>
  );
}
