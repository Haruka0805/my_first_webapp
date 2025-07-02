import { setupTabs } from "./js/tabs.js";
import { setupConverter } from "./js/converter.js";
import { setupFlashcards } from "./js/flashcards.js";

window.addEventListener('load', () => {
  setupTabs();
  setupConverter();
  setupFlashcards();
});