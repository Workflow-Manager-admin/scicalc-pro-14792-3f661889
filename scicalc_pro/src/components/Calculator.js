import React, { useState } from 'react';
import '../styles/Calculator.css';

/*
  PUBLIC_INTERFACE
  Main container for SciCalc Pro - a full-featured scientific calculator UI and logic.
  Features:
    - Basic operations: +, -, ×, ÷, .
    - Scientific functions: sin, cos, tan, log, ln, sqrt, x²
    - Parentheses, memory (MC, MR, M+, M-)
    - Clear, Backspace, parens
    - Keyboard-like layout and color scheme (dark w/ orange accent) per spec
*/
const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [memory, setMemory] = useState(0);

  // Append number or dot to input
  // PUBLIC_INTERFACE
  const handleNumber = (num) => {
    if (display === 'Error' || isNewNumber) {
      setDisplay(num === '.' ? '0.' : num);
      setExpression(isNewNumber
        ? (expression ? expression + num : num)
        : num
      );
      setIsNewNumber(false);
    } else {
      // Prevent multiple decimals
      if (num === '.' && display.includes('.')) return;
      setDisplay(display === '0' && num !== '.' ? num : display + num);
      setExpression(expression + num);
    }
  };

  // Handle operator input (+, -, ×, ÷, parens)
  // PUBLIC_INTERFACE
  const handleOperator = (op) => {
    // Prevent consecutive operators
    if (
      expression &&
      /[\+\-\×\÷] $/.test(expression.trim())
      && op !== '(' && op !== ')'
    ) {
      setExpression(expression.trim().slice(0, -1) + op + ' ');
      return;
    }
    // If new open paren, append with space if after number
    if (op === '(' && /\d$/.test(expression)) {
      setExpression(expression + ' × (');
      setDisplay('(');
    } else {
      setExpression(expression + ' ' + op + ' ');
      setDisplay(op);
    }
    setIsNewNumber(true);
  };

  // Handle scientific functions (sin, cos, tan, log, ln, sqrt, x²)
  // PUBLIC_INTERFACE
  const handleScientific = (fn) => {
    let val = parseFloat(display);
    if (isNaN(val)) return;
    let result = '';
    switch (fn) {
      case 'sin':
        result = Math.sin(val * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(val * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(val * Math.PI / 180);
        break;
      case 'log':
        result = val <= 0 ? 'Error' : Math.log10(val);
        break;
      case 'ln':
        result = val <= 0 ? 'Error' : Math.log(val);
        break;
      case 'sqrt':
        result = val < 0 ? 'Error' : Math.sqrt(val);
        break;
      case 'square':
        result = Math.pow(val, 2);
        break;
      default: return;
    }
    if (Number.isFinite(result)) {
      // Remove trailing .0
      let txt = (+result).toPrecision(10).replace(/(\.[0-9]*[1-9])0+$|\.0+$/, '$1');
      setDisplay(txt);
      setExpression(txt);
    } else {
      setDisplay('Error');
      setExpression('');
    }
    setIsNewNumber(true);
  };

  // Handle memory (MC, MR, M+, M-)
  // PUBLIC_INTERFACE
  const handleMemory = (fn) => {
    const val = parseFloat(display);
    switch (fn) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(memory.toString());
        setIsNewNumber(true);
        break;
      case 'M+':
        if (!isNaN(val)) setMemory(memory + val);
        setIsNewNumber(true);
        break;
      case 'M-':
        if (!isNaN(val)) setMemory(memory - val);
        setIsNewNumber(true);
        break;
      default: break;
    }
  };

  // PUBLIC_INTERFACE
  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setIsNewNumber(true);
  };

  // PUBLIC_INTERFACE
  const handleBackspace = () => {
    if (display.length === 1 || display === 'Error') {
      setDisplay('0');
      setIsNewNumber(true);
    } else {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    }
  };

  // PUBLIC_INTERFACE
  function toEvalExpr(expr) {
    // Replace ops, remove repeated spaces, force multiplication with '(' if needed
    return expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/([0-9])\s*\(/g, '$1*(')
      .replace(/(\))\s*(\d)/g, ')*$2')
      .replace(/\s+/g, '');
  }

  // PUBLIC_INTERFACE
  const calculateResult = () => {
    try {
      let evalExpr = toEvalExpr(expression);
      // eslint-disable-next-line no-new-func
      let res = Function(`"use strict";return (${evalExpr})`)();
      if (!isFinite(res)) throw new Error('Non-finite');
      // Remove trailing .0s
      let txt = (+res).toPrecision(10).replace(/(\.[0-9]*[1-9])0+$|\.0+$/, '$1');
      setDisplay(txt);
      setExpression(txt);
    } catch {
      setDisplay('Error');
      setExpression('');
    }
    setIsNewNumber(true);
  };

  // Button grid map for easy layout
  const sciRow = [
    { key: 'sin', label: 'sin' },
    { key: 'cos', label: 'cos' },
    { key: 'tan', label: 'tan' },
    { key: 'log', label: 'log' },
    { key: 'ln', label: 'ln' },
    { key: 'sqrt', label: '√' },
    { key: 'square', label: 'x²' }
  ];
  const mainGrid = [
    [ { label: 'C', fn: handleClear, className: 'clear' }, { label: '⌫', fn: handleBackspace, className: 'backspace' }, { label: '(', fn: () => handleOperator('(') }, { label: ')', fn: () => handleOperator(')') } ],
    [ { label: '7', fn: () => handleNumber('7') }, { label: '8', fn: () => handleNumber('8') }, { label: '9', fn: () => handleNumber('9') }, { label: '÷', fn: () => handleOperator('÷'), className:'operator' } ],
    [ { label: '4', fn: () => handleNumber('4') }, { label: '5', fn: () => handleNumber('5') }, { label: '6', fn: () => handleNumber('6') }, { label: '×', fn: () => handleOperator('×'), className:'operator' } ],
    [ { label: '1', fn: () => handleNumber('1') }, { label: '2', fn: () => handleNumber('2') }, { label: '3', fn: () => handleNumber('3') }, { label: '-', fn: () => handleOperator('-'), className:'operator' } ],
    [ { label: '0', fn: () => handleNumber('0') }, { label: '.', fn: () => handleNumber('.') }, { label: '=', fn: calculateResult, className:'equals' }, { label: '+', fn: () => handleOperator('+'), className:'operator' } ],
  ];

  const memBtns = [
    { key: 'MC', label: 'MC' },
    { key: 'MR', label: 'MR' },
    { key: 'M+', label: 'M+' },
    { key: 'M-', label: 'M-' }
  ];

  return (
    <div className="calculator">
      <div className="calculator-display">
        <div className="expression">{expression || '0'}</div>
        <div className="result">{display}</div>
      </div>
      <div className="calculator-buttons">
        <div className="memory-functions">
          {memBtns.map(btn =>
            <button key={btn.key} onClick={() => handleMemory(btn.key)}>{btn.label}</button>
          )}
        </div>
        <div className="scientific-functions">
          {sciRow.map(btn =>
            <button
              key={btn.key}
              onClick={() => handleScientific(btn.key)}
              className="scientific"
              style={btn.key === 'square' ? { gridColumn: 'span 2' } : {}}
            >
              {btn.label}
            </button>
          )}
        </div>
        <div className="main-buttons">
          {mainGrid.flat().map((btn, i) =>
            <button
              key={i}
              onClick={btn.fn}
              className={btn.className || ''}
            >
              {btn.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
