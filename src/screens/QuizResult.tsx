import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useQuizStore } from '../store/useQuizStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Trophy, RefreshCw, Home, Share2, Link, Image as ImageIcon, Check } from 'lucide-react';

export function QuizResult() {
  const { score, userName, activeMode, resetGame, setCurrentScreen } = useQuizStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  let message = "Good effort!";
  if (score >= 800) message = "Incredible Job! You're a genius!";
  else if (score >= 500) message = "Great Work!";
  
  const handleCopyLink = () => {
    const url = new URL(window.location.origin);
    url.searchParams.set('share', 'true');
    url.searchParams.set('name', userName);
    url.searchParams.set('score', score.toString());
    url.searchParams.set('mode', activeMode || 'classic');

    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      // Temporarily ensure the element is visible in the viewport and formatted correctly
      const element = printRef.current;
      element.style.display = 'block'; // Ensure it's shown for the canvas
      
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        backgroundColor: '#fefce8', // neo-bg
      });
      
      // Hide it back if we want, but it's positioned absolute off-screen anyway
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `hivemind-score-${userName}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4 relative">
      <Card variant="green" className="w-full max-w-md p-8 text-center relative z-10">
        <div className="bg-white border-4 border-black inline-block p-4 mb-6 transform rotate-3 shadow-neo">
          <Trophy size={64} className="text-neo-orange" />
        </div>
        
        <h1 className="text-4xl font-black uppercase mb-2">Quiz Completed!</h1>
        <p className="text-xl font-bold mb-6">{message}</p>
        
        <div className="bg-white border-4 border-black p-6 mb-8 transform -rotate-1">
          <p className="text-sm font-bold uppercase text-gray-500 mb-1">Final Score for {userName}</p>
          <p className="text-6xl font-black text-neo-blue">{score}</p>
        </div>

        <div className="flex flex-col gap-4">
          <Button variant="primary" onClick={() => setShowShareModal(true)} className="flex items-center justify-center gap-2">
            <Share2 /> Share Score
          </Button>
          <Button variant="warning" onClick={() => setCurrentScreen('quiz')} className="flex items-center justify-center gap-2">
            <RefreshCw /> Play Again
          </Button>
          <Button variant="secondary" onClick={resetGame} className="flex items-center justify-center gap-2">
            <Home /> Back to Modes
          </Button>
        </div>
      </Card>

      <Modal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)}
        title="Share Your Score"
      >
        <div className="flex flex-col gap-4">
          <Button variant="primary" onClick={handleCopyLink} className="flex items-center justify-center gap-2 text-white">
            {copied ? <Check /> : <Link />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button 
            variant="warning" 
            onClick={handleDownloadImage} 
            className="flex items-center justify-center gap-2"
            disabled={downloading}
          >
            <ImageIcon />
            {downloading ? "Generating..." : "Download Image"}
          </Button>
        </div>
      </Modal>

      {/* Hidden element just for html2canvas rendering */}
      <div 
        ref={printRef} 
        className="absolute top-[-9999px] left-[-9999px] w-[400px] h-[700px] bg-neo-bg flex flex-col items-center justify-center p-8 border-8 border-black z-[-1]"
      >
        <h1 className="text-4xl font-black uppercase mb-8 flex items-center gap-2">
          <Trophy className="text-neo-blue" size={40} />
          HIVEMIND
        </h1>
        <Card variant="green" className="w-full text-center p-8 transform rotate-2">
          <p className="text-2xl font-bold mb-2">{userName}</p>
          <p className="text-lg font-bold mb-4 uppercase">Scored in {activeMode}</p>
          <div className="bg-white border-4 border-black p-6 transform -rotate-3">
            <p className="text-7xl font-black text-neo-blue">{score}</p>
          </div>
        </Card>
        <p className="mt-12 font-bold text-xl uppercase">Can you beat my score?</p>
      </div>
    </div>
  );
}
