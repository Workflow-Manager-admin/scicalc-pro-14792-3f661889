import React from 'react';
import Calculator from './components/Calculator';
import './App.css';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <span className="logo-symbol">∑</span> SciCalc Pro
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <div className="calculator-container">
            <Calculator />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
