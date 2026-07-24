import { useState } from 'react';
import { useQuizStore } from '../store/useQuizStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BrainCircuit, ArrowRight, Sparkles } from 'lucide-react';

export function Home() {
  const { setUserName, setCurrentScreen } = useQuizStore();
  const [inputValue, setInputValue] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUserName(inputValue);
      setCurrentScreen('modes');
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 text-neo-pink animate-bounce">
        <Sparkles size={48} />
      </div>
      <div className="absolute bottom-20 right-10 text-neo-blue">
        <Sparkles size={64} />
      </div>
      <div className="absolute top-1/4 right-20 text-neo-orange">
        <BrainCircuit size={120} opacity={0.2} />
      </div>

      <Card variant="yellow" className="w-full max-w-lg p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white border-4 border-black p-4 mb-6 shadow-neo transform -rotate-2">
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-2">
              <BrainCircuit size={40} className="text-neo-blue" />
              HIVEMIND
            </h1>
          </div>
          
          <p className="text-xl font-bold text-center">
            Ready to test your knowledge?
          </p>
        </div>

        <form onSubmit={handleStart} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="font-bold text-lg">What should we call you?</label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your nickname..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
              className="text-center"
            />
          </div>
          
          <Button type="submit" variant="primary" className="flex items-center justify-center gap-2 w-full text-xl group">
            LET'S GO! 
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
