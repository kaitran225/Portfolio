import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio', () => {
  render(<App />);
  const portfolioElement = screen.getByText(/Kai Tran/i);
  expect(portfolioElement).toBeInTheDocument();
});
