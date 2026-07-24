import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders the HIVEMIND logo/title', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /HIVEMIND/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the name input field', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Enter your nickname.../i);
    expect(input).toBeInTheDocument();
  });
});
