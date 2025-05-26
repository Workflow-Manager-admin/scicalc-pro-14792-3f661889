import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '../Calculator';

describe('Calculator Component Unit Tests', () => {
  // Basic Rendering Tests
  describe('Rendering', () => {
    test('renders calculator display', () => {
      render(<Calculator />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('renders number buttons', () => {
      render(<Calculator />);
      for (let i = 0; i <= 9; i++) {
        expect(screen.getByRole('button', { name: i.toString() })).toBeInTheDocument();
      }
    });

    test('renders operator buttons', () => {
      render(<Calculator />);
      const operators = ['+', '-', '×', '÷'];
      operators.forEach(operator => {
        expect(screen.getByRole('button', { name: operator })).toBeInTheDocument();
      });
    });

    test('renders scientific function buttons', () => {
      render(<Calculator />);
      const sciButtons = ['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²'];
      sciButtons.forEach(btn => {
        expect(screen.getByRole('button', { name: btn })).toBeInTheDocument();
      });
    });

    test('renders memory operation buttons', () => {
      render(<Calculator />);
      const memoryButtons = ['MC', 'MR', 'M+', 'M-'];
      memoryButtons.forEach(btn => {
        expect(screen.getByRole('button', { name: btn })).toBeInTheDocument();
      });
    });
  });

  // Number Input Tests
  describe('Number Input', () => {
    test('handles number button clicks', () => {
      render(<Calculator />);
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    test('handles decimal point', () => {
      render(<Calculator />);
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '.' }));
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      expect(screen.getByText('1.5')).toBeInTheDocument();
    });
  });

  // Basic Operations Tests
  describe('Basic Operations', () => {
    test('performs addition', () => {
      render(<Calculator />);
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('performs multiplication', () => {
      render(<Calculator />);
      fireEvent.click(screen.getByRole('button', { name: '4' }));
      fireEvent.click(screen.getByRole('button', { name: '×' }));
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      expect(screen.getByText('20')).toBeInTheDocument();
    });
  });

  // Scientific Functions Tests
  describe('Scientific Functions', () => {
    test('calculates square', () => {
      render(<Calculator />);
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: 'x²' }));
      expect(screen.getByText('9')).toBeInTheDocument();
    });

    test('calculates square root', () => {
      render(<Calculator />);
      fireEvent.click(screen.getByRole('button', { name: '9' }));
      fireEvent.click(screen.getByRole('button', { name: '√' }));
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('calculates sine', () => {
      render(<Calculator />);
      fireEvent.click(screen.getByRole('button', { name: '9' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: 'sin' }));
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  // Memory Operations Tests
  describe('Memory Operations', () => {
    test('stores and recalls value from memory', () => {
      render(<Calculator />);
      // Enter 5
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      // Store in memory
      fireEvent.click(screen.getByRole('button', { name: 'M+' }));
      // Clear display
      fireEvent.click(screen.getByRole('button', { name: 'C' }));
      // Recall memory
      fireEvent.click(screen.getByRole('button', { name: 'MR' }));
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('clears memory', () => {
      render(<Calculator />);
      // Enter 5 and store in memory
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: 'M+' }));
      // Clear memory
      fireEvent.click(screen.getByRole('button', { name: 'MC' }));
      // Clear display
      fireEvent.click(screen.getByRole('button', { name: 'C' }));
      // Try to recall memory (should show 0)
      fireEvent.click(screen.getByRole('button', { name: 'MR' }));
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    test('handles division by zero', () => {
      render(<Calculator />);
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '÷' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    test('handles invalid expressions', () => {
      render(<Calculator />);
      fireEvent.click(screen.getByRole('button', { name: '(' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  // Clear and Backspace Tests
  describe('Clear and Backspace', () => {
    test('clears display', () => {
      render(<Calculator />);
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: 'C' }));
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('handles backspace', () => {
      render(<Calculator />);
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '⌫' }));
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });
});
