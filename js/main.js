import { Game } from './game.js';
import { InputHandler } from './input.js';

const canvas = document.getElementById('gameCanvas');
const input = new InputHandler(canvas);
const game = new Game(canvas, input);

// Start the game loop
requestAnimationFrame((ts) => game.loop(ts));
