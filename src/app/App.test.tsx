import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio', () => {
  render(<App />);
  const portfolioElement = screen.getByText(/Trần Nguyên Khánh/i);
  expect(portfolioElement).toBeInTheDocument();
});
