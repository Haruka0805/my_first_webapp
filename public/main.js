import { setupTabs } from "./js/tabs.js";
import { setupConverter } from "./js/converter.js";
import { setupFlashcards } from "./js/flashcards.js";

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupConverter();
  setupFlashcards();
});
