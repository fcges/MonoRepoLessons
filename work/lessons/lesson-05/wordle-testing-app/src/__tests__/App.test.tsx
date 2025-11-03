import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from '../App';

// Create the same theme used in main.tsx for consistent testing
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6aaa64',
    },
    secondary: {
      main: '#c9b458',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
  },
});

// Helper function to render App with theme provider (like in main.tsx)
const renderAppWithTheme = () => {
  return render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

describe('Wordle App - Basic Rendering Tests', () => {
  describe('🟢 Beginner Level Tests', () => {
    test('App renders without crashing', () => {
      // This test ensures the app can mount and render without throwing errors
      renderAppWithTheme();

      // If we get here without an error, the app rendered successfully!
      // We can add a simple assertion to make sure something is in the document
      expect(document.body).toBeInTheDocument();
    });

    test('Title displays correctly', () => {
      renderAppWithTheme();

      // Look for the main title using the test ID
      const titleElement = screen.getByTestId('game-title');

      // Check that the title exists and has the correct text
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('Wordle Testing Game');
    });

    test('Game board shows 6 rows of empty cells', () => {
      renderAppWithTheme();

      // Find the game board
      const gameBoard = screen.getByTestId('game-board');
      expect(gameBoard).toBeInTheDocument();

      // Check that we have 6 rows (0-5)
      for (let row = 0; row < 6; row++) {
        // For each row, check that we have the correct number of cells
        // Default word length is 5, so we should have 5 cells per row
        for (let col = 0; col < 5; col++) {
          const cell = screen.getByTestId(`cell-${row}-${col}`);
          expect(cell).toBeInTheDocument();

          // Initially, all cells should be empty
          expect(cell).toHaveTextContent('');
        }
      }
    });

    // TODO: Add more tests here!
    // Students can continue with:
    // - Current guess display is present
    // - Virtual keyboard is present  
    // - All control buttons are present
    // - Word length selection tests
    // - Virtual keyboard functionality tests
    // - And much more!

    test('Current guess display is present', () => {
      renderAppWithTheme();

      const currentGuessDisplay = screen.getByTestId('current-guess-label');
      expect(currentGuessDisplay).toBeInTheDocument();
      expect(currentGuessDisplay).toHaveTextContent('Current Guess');
      for (let i = 0; i < 5; i++) {
        const guessCell = screen.getByTestId(`current-guess-letter-${i}`);
        expect(guessCell).toBeInTheDocument();
        expect(guessCell).toHaveTextContent('');
      }
    });

    test('Virtual keyboard is present', () => {
      renderAppWithTheme();

      const virtualKeyboard = screen.getByTestId('virtual-keyboard');
      expect(virtualKeyboard).toBeInTheDocument();

      // Check that all letter keys are present
      for (let i = 0; i < 26; i++) {
        const letterKey = String.fromCharCode(97 + i); // 'a' to 'z'
        const keyElement = screen.getByTestId(`keyboard-key-${letterKey}`);
        expect(keyElement).toBeInTheDocument();
      }
      // Check for Enter and Backspace keys
      expect(screen.getByTestId('keyboard-key-enter')).toBeInTheDocument();
      expect(screen.getByTestId('keyboard-key-backspace')).toBeInTheDocument();
    });

    test('All control buttons are present', () => {
      renderAppWithTheme();

      const newGameButton = screen.getByTestId('new-game-button');
      expect(newGameButton).toBeInTheDocument();
      expect(newGameButton).toHaveTextContent('New Game');

      const wordLengthSelect = screen.getByTestId('word-length-selector');
      expect(wordLengthSelect).toBeInTheDocument();

      const instructionsButton = screen.getByTestId('instructions-button');
      expect(instructionsButton).toBeInTheDocument();
      expect(instructionsButton).toHaveTextContent('Instructions');
    });

    // Word Length Selection Tests

    test('Can select word length', async () => {
      const user = userEvent.setup();
      renderAppWithTheme();

      const wordLengthSelect = screen.getByTestId('word-length-select');
      expect(wordLengthSelect).toBeInTheDocument();
      expect(wordLengthSelect).toHaveTextContent('5 Letters');

      expect(wordLengthSelect).toBeInTheDocument();

      await user.click(wordLengthSelect);
      await user.click(screen.getByTestId('length-4'));
      expect(wordLengthSelect).toHaveTextContent('4 Letters');
      await user.click(wordLengthSelect);
      await user.click(screen.getByTestId('length-3'));
      expect(wordLengthSelect).toHaveTextContent('3 Letters');
    });

    test('Game board updates to show correct number of columns', async () => {
      const user = userEvent.setup();
      renderAppWithTheme();

      const wordLengthSelector = screen.getByTestId('word-length-select');
      expect(wordLengthSelector).toBeInTheDocument();
      await user.selectOptions(wordLengthSelector, '3');
      expect(wordLengthSelector).toHaveTextContent('3 Letters');

      // Initially, we should have 3 columns
      for (let col = 0; col < 3; col++) {
        const cell = screen.getByTestId(`cell-0-${col}`);
        expect(cell).toBeInTheDocument();
      }
      // Change to 4-letter words
      await user.selectOptions(wordLengthSelector, '4');
      expect(wordLengthSelector).toHaveTextContent('4 Letters');
      for (let col = 0; col < 4; col++) {
        const cell = screen.getByTestId(`cell-0-${col}`);
        expect(cell).toBeInTheDocument();
      }
    });

    test('Current guess display updates to show correct number of boxes', async () => {
      const user = userEvent.setup();
      renderAppWithTheme();

      const currentGuessBoxes = screen.getAllByTestId(/current-guess-letter-\d/);
      expect(currentGuessBoxes).toHaveLength(5);
      const wordLengthSelector = screen.getByTestId('word-length-select');
      expect(wordLengthSelector).toBeInTheDocument();
      await user.selectOptions(wordLengthSelector, '4');
      expect(wordLengthSelector).toHaveTextContent('4 Letters');
      const updatedGuessBoxes = screen.getAllByTestId(/current-guess-letter-\d/);
      expect(updatedGuessBoxes).toHaveLength(4);
      await user.selectOptions(wordLengthSelector, '3');
      expect(wordLengthSelector).toHaveTextContent('3 Letters');
      const finalGuessBoxes = screen.getAllByTestId(/current-guess-letter-\d/);
      expect(finalGuessBoxes).toHaveLength(3);
    });

    test('New game starts with correct word length', async () => {
      const user = userEvent.setup();
      renderAppWithTheme();

      const wordLengthSelector = screen.getByTestId('word-length-select');
      expect(wordLengthSelector).toBeInTheDocument();
      await user.selectOptions(wordLengthSelector, '4');
      expect(wordLengthSelector).toHaveTextContent('4 Letters');
      const newGameButton = screen.getByTestId('new-game-button');
      expect(newGameButton).toBeInTheDocument();
      await user.click(newGameButton);
      expect(wordLengthSelector).toHaveTextContent('4 Letters');
    });

    // Current Guess Display Tests
    test('Current guess shows in letter boxes', async () => {
      const user = userEvent.setup();
      renderAppWithTheme();

      const aKey = screen.getByTestId('keyboard-key-a');
      const bKey = screen.getByTestId('keyboard-key-b');
      const cKey = screen.getByTestId('keyboard-key-c');

      await user.click(aKey);
      await user.click(bKey);
      await user.click(cKey);
      expect(screen.getByTestId('current-guess-letter-0')).toHaveTextContent('A');
      expect(screen.getByTestId('current-guess-letter-1')).toHaveTextContent('B');
      expect(screen.getByTestId('current-guess-letter-2')).toHaveTextContent('C');
    });
  });

  // TODO: Add more test suites here!
  // describe('🟡 Intermediate Level Tests', () => { ... });
  // describe('🔴 Advanced Level Tests', () => { ... });
  // describe('🚀 Expert Level Tests', () => { ... });

  describe('🟡 Intermediate Level Tests', () => {

  });

});

/*
 * 🎯 STUDENT INSTRUCTIONS:
 * 
 * This file contains starter tests to get you going. Your mission is to:
 * 
 * 1. Run these tests and make sure they pass: `npm test`
 * 2. Add more rendering tests (current guess display, virtual keyboard, etc.)
 * 3. Move on to interaction tests (clicking keys, submitting guesses, etc.)
 * 4. Test edge cases and complex scenarios
 * 
 * Remember:
 * - Use `screen.getByTestId()` to find elements reliably
 * - Use `userEvent` for user interactions (clicking, typing)
 * - Use `waitFor()` for async operations
 * - Check the README.md for comprehensive testing scenarios
 * 
 * Good luck! 🍀
 */
