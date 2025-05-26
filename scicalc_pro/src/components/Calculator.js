import React, { useState } from 'react';
import '../styles/Calculator.css';

// PUBLIC_INTERFACE
const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const [expression, setExpression] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [isNewNumber, setIsNewNumber] = useState(true);

  // Handle numeric input
  const handleNumber = (num) => {
    if (isNewNumber) {
      setDisplay(num);
      setExpression(expression + num);
      setIsNewNumber(false);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  // Handle basic operations
  const handleOperator = (operator) => {
    setExpression(expression + ' ' + operator + ' ');
    setIsNewNumber(true);
  };

  // Handle scientific functions
  const handleScientific = (func) => {
    let result;
    const number = parseFloat(display);

    switch (func) {
      case 'sin':
        result = Math.sin(number * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(number * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(number * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(number);
        break;
      case 'ln':
        result = Math.log(number);
        break;
      case 'sqrt':
        result = Math.sqrt(number);
        break;
      case 'square':
        result = number * number;
        break;
      default:
        return;
    }

    setDisplay(result.toString());
    setLastResult(result);
    setIsNewNumber(true);
  };

  // Handle memory operations
  const handleMemory = (operation) => {
    const currentValue = parseFloat(display);
    
    switch (operation) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(memory.toString());
        setIsNewNumber(true);
        break;
      case 'M+':
        setMemory(memory + currentValue);
        setIsNewNumber(true);
        break;
      case 'M-':
        setMemory(memory - currentValue);
        setIsNewNumber(true);
        break;
      default:
        break;
    }
  };

  // Clear all
  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setLastResult(null);
    setIsNewNumber(true);
  };

  // Backspace
  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  };

  // Calculate result
  const calculateResult = () => {
    try {
      // Replace scientific notation and handle parentheses
      const sanitizedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
      
      const result = Function('"use strict";return (' + sanitizedExpression + ')')();
      setDisplay(result.toString());
      setLastResult(result);
      setExpression(result.toString());
      setIsNewNumber(true);
    } catch (error) {
      setDisplay('Error');
      setIsNewNumber(true);
    }
  };

  return (
    <div className="calculator">
      <div className="calculator-display">
        <div className="expression">{expression || '0'}</div>
        <div className="result">{display}</div>
      </div>
      
      <div className="calculator-buttons">
        <div className="memory-functions">
          <button onClick={() => handleMemory('MC')}>MC</button>
          <button onClick={() => handleMemory('MR')}>MR</button>
          <button onClick={() => handleMemory('M+')}>M+</button>
          <button onClick={() => handleMemory('M-')}>M-</button>
        </div>

        <div className="scientific-functions">
          <button onClick={() => handleScientific('sin')}>sin</button>
          <button onClick={() => handleScientific('cos')}>cos</button>
          <button onClick={() => handleScientific('tan')}>tan</button>
          <button onClick={() => handleScientific('log')}>log</button>
          <button onClick={() => handleScientific('ln')}>ln</button>
          <button onClick={() => handleScientific('sqrt')}>√</button>
          <button onClick={() => handleScientific('square')}>x²</button>
        </div>

        <div className="main-buttons">
          <button onClick={handleClear} className="clear">C</button>
          <button onClick={handleBackspace} className="backspace">⌫</button>
          <button onClick={() => handleOperator('(')}>(</button>
          <button onClick={() => handleOperator(')')}>)</button>
          
          <button onClick={() => handleNumber('7')}>7</button>
          <button onClick={() => handleNumber('8')}>8</button>
          <button onClick={() => handleNumber('9')}>9</button>
          <button onClick={() => handleOperator('÷')} className="operator">÷</button>
          
          <button onClick={() => handleNumber('4')}>4</button>
          <button onClick={() => handleNumber('5')}>5</button>
          <button onClick={() => handleNumber('6')}>6</button>
          <button onClick={() => handleOperator('×')} className="operator">×</button>
          
          <button onClick={() => handleNumber('1')}>1</button>
          <button onClick={() => handleNumber('2')}>2</button>
          <button onClick={() => handleNumber('3')}>3</button>
          <button onClick={() => handleOperator('-')} className="operator">-</button>
          
          <button onClick={() => handleNumber('0')}>0</button>
          <button onClick={() => handleNumber('.')}>.</button>
          <button onClick={calculateResult} className="equals">=</button>
          <button onClick={() => handleOperator('+')} className="operator">+</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
