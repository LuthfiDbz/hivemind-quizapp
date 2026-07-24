import { useQuizStore } from '../store/useQuizStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trophy, Home } from 'lucide-react';

export function PublicScore() {
  const { setUserName, setCurrentScreen } = useQuizStore();
  
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name') || 'Someone';
  const score = params.get('score') || '0';
  const mode = params.get('mode') || 'classic';

  const handlePlayNow = () => {
    // Remove query params to reset app
    window.history.replaceState({}, document.title, window.location.pathname);
    setCurrentScreen('home');
    setUserName(''); // reset so they enter their name
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-20 text-neo-pink transform -rotate-12">
        <Trophy size={100} opacity={0.2} />
      </div>
      <div className="absolute bottom-20 right-20 text-neo-blue transform rotate-12">
        <Trophy size={100} opacity={0.2} />
      </div>

      <Card variant="blue" className="w-full max-w-lg p-8 text-center relative z-10 text-white shadow-neo-lg">
        <h1 className="text-4xl font-black uppercase mb-4 tracking-tight text-neo-yellow">
          HIVEMIND CHALLENGE
        </h1>
        
        <p className="text-2xl font-bold mb-6 leading-relaxed">
          <span className="bg-white text-black px-2 py-1 border-2 border-black mr-2">{name}</span>
          just scored a massive
        </p>

        <div className="bg-neo-yellow border-4 border-black p-6 mb-8 transform -rotate-2 inline-block">
          <p className="text-sm font-bold uppercase text-black mb-1">Total Score</p>
          <p className="text-7xl font-black text-black tracking-tighter">{score}</p>
        </div>
        
        <p className="text-xl font-bold mb-8">
          in <span className="uppercase text-neo-pink bg-white px-2 py-1 border-2 border-black">{mode}</span> mode!
        </p>

        <Button variant="warning" onClick={handlePlayNow} className="w-full text-xl py-4 flex items-center justify-center gap-2 group">
          <Home className="group-hover:-translate-y-1 transition-transform" /> 
          PLAY HIVEMIND NOW
        </Button>
      </Card>
    </div>
  );
}
