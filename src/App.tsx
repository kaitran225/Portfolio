import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PortfolioRouter from './components/PortfolioRouter';
import LaTeXCV from './components/LaTeXCV';
import './App.css';

function App(): React.ReactElement {
  // Check if we're in simple mode (now LaTeX CV mode)
  const urlParams = new URLSearchParams(window.location.search);
  const isSimpleMode = urlParams.get('view') === 'simple';

  if (isSimpleMode) {
    return <LaTeXCV />;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <PortfolioRouter />
      </div>
    </BrowserRouter>
  );
}

export default App;
