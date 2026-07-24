import { useQuizStore } from './store/useQuizStore';
import { Home } from './screens/Home';
import { ModeSelection } from './screens/ModeSelection';
import { QuizPlayer } from './screens/QuizPlayer';
import { QuizResult } from './screens/QuizResult';
import { PublicScore } from './screens/PublicScore';

function App() {
  const currentScreen = useQuizStore((state) => state.currentScreen);

  // Intercept shared links before rendering regular screens
  if (window.location.search.includes('share=true')) {
    return <PublicScore />;
  }

  switch (currentScreen) {
    case 'home':
      return <Home />;
    case 'modes':
      return <ModeSelection />;
    case 'quiz':
      return <QuizPlayer />;
    case 'result':
      return <QuizResult />;
    default:
      return <Home />;
  }
}

export default App;
