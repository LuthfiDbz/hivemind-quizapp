import { useState } from 'react';
import { useQuizStore, type QuizMode } from '../store/useQuizStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { Brain, HelpCircle, Flame, Target } from 'lucide-react';

export function ModeSelection() {
  const { userName, setActiveMode, setCurrentScreen } = useQuizStore();
  const [selectedMode, setSelectedMode] = useState<QuizMode>(null);

  const handleStartQuiz = () => {
    setActiveMode(selectedMode);
    setCurrentScreen('quiz');
  };

  const getModeDetails = (mode: QuizMode) => {
    switch(mode) {
      case 'classic':
        return {
          title: 'Classic Trivia',
          desc: 'Test your general knowledge with a time limit of 15 seconds per question. Score decreases the longer you take!',
          available: true
        };
      case 'hangman':
        return {
          title: 'Hangmind',
          desc: 'Guess the word based on the clue. Each wrong letter hurts your chances. Can you survive?',
          available: false
        };
      case 'survival':
        return {
          title: 'Sudden Death',
          desc: 'One strike and you are out! Answer as many hard questions as you can without failing.',
          available: false
        };
      case 'true-false':
        return {
          title: 'Rapid Fire (T/F)',
          desc: 'True or False. Make quick decisions before the clock runs out!',
          available: false
        };
      default:
        return { title: '', desc: '', available: false };
    }
  };

  const activeModeDetails = getModeDetails(selectedMode);

  return (
    <div className="min-h-screen bg-neo-bg p-8 pt-10">
      <div className=" space-y-8">
        <header className="max-w-5xl mx-auto flex justify-between items-center bg-white p-4 border-4 border-black shadow-neo">
          <h1 className="text-2xl font-black">HIVEMIND</h1>
          <p className="font-bold text-lg text-neo-blue">Hi, {userName}!</p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8 mt-12">
          <div className="flex justify-center">
            <h2 className="text-4xl md:text-3xl font-black uppercase text-center transform -rotate-2 bg-neo-yellow border-4 border-black px-8 py-4 shadow-neo-lg inline-block">
              Select Quiz Mode
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <Card 
              variant="blue" 
              className="p-6 cursor-pointer hover:-translate-y-1 hover:shadow-neo-lg transition-all"
              onClick={() => setSelectedMode('classic')}
            >
              <Brain size={48} className="mb-4 text-white" />
              <h3 className="text-2xl font-bold text-white uppercase">Classic Trivia</h3>
              <p className="text-white/90 font-medium">30s Timer, Dynamic Scoring</p>
            </Card>

            <Card 
              variant="pink" 
              className="p-6 cursor-pointer hover:-translate-y-1 hover:shadow-neo-lg transition-all opacity-80"
              onClick={() => setSelectedMode('hangman')}
            >
              <HelpCircle size={48} className="mb-4 text-black" />
              <h3 className="text-2xl font-bold text-black uppercase">Hangmind</h3>
              <p className="text-black/80 font-medium">Guess the word</p>
            </Card>

            <Card 
              variant="orange" 
              className="p-6 cursor-pointer hover:-translate-y-1 hover:shadow-neo-lg transition-all opacity-80"
              onClick={() => setSelectedMode('survival')}
            >
              <Flame size={48} className="mb-4 text-black" />
              <h3 className="text-2xl font-bold text-black uppercase">Sudden Death</h3>
              <p className="text-black/80 font-medium">1 Strike = Out</p>
            </Card>

            <Card 
              variant="green" 
              className="p-6 cursor-pointer hover:-translate-y-1 hover:shadow-neo-lg transition-all opacity-80"
              onClick={() => setSelectedMode('true-false')}
            >
              <Target size={48} className="mb-4 text-black" />
              <h3 className="text-2xl font-bold text-black uppercase">Rapid Fire</h3>
              <p className="text-black/80 font-medium">True or False</p>
            </Card>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={selectedMode !== null} 
        onClose={() => setSelectedMode(null)}
        title={activeModeDetails.title}
        className={selectedMode === 'classic' ? 'bg-neo-blue text-white' : 'bg-neo-bg text-black'}
      >
        <p className="font-bold text-lg mb-6 leading-relaxed">
          {activeModeDetails.desc}
        </p>

        {selectedMode === 'classic' && (
          <div className="mb-6 space-y-4">
            <div className="space-y-2">
              <label className="font-bold block text-lg">Select Topic:</label>
              <Select 
                options={[
                  { value: 'Random', label: 'Random' },
                  ...useQuizStore.getState().topics.map(t => ({ value: t.name, label: t.name }))
                ]}
                value={useQuizStore.getState().selectedTopic}
                onChange={(val) => {
                  useQuizStore.getState().setSelectedTopic(val);
                  useQuizStore.getState().setSelectedCategory('Random');
                }}
              />
            </div>

            {useQuizStore.getState().selectedTopic !== 'Random' && (() => {
              const currentTopic = useQuizStore.getState().topics.find(t => t.name === useQuizStore.getState().selectedTopic);
              if (currentTopic && currentTopic.categories.length > 0) {
                return (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="font-bold block text-lg">Select Category:</label>
                    <Select 
                      options={[
                        { value: 'Random', label: `All ${currentTopic.name}` },
                        ...currentTopic.categories.map(c => ({ value: c.name, label: c.name }))
                      ]}
                      value={useQuizStore.getState().selectedCategory}
                      onChange={(val) => useQuizStore.getState().setSelectedCategory(val)}
                    />
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
        
        <div className="flex justify-end">
          {activeModeDetails.available ? (
            <Button variant="warning" onClick={handleStartQuiz} className="w-full uppercase">
              Start Quiz!
            </Button>
          ) : (
            <Button variant="secondary" disabled className="w-full opacity-50 cursor-not-allowed uppercase">
              Coming Soon
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
}
