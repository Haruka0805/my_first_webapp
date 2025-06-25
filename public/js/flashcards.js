// get flashcards list
async function fetchFlashcards() {
  try {
    const response = await fetch("/api/flashcards");
    return response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// 暗記カードを追加するデータをサーバーに送る関数を作成してください


export async function setupFlashcards() {
  const flashcardsList = document.getElementById("flashcards-list");
  function toggleMeaning(id) {
    const meaningElement = document.querySelector(`[data-meaning="${id}"]`);

    if (meaningElement.classList.contains("hidden")) {
      meaningElement.classList.remove("hidden");
    } else {
      meaningElement.classList.add("hidden");
    }
  }

  async function readFlashcards() {
    const wordList = await fetchFlashcards();
    renderFlashcards(wordList);
  }

  async function renderFlashcards(wordList) {
    flashcardsList.innerHTML = "";
    wordList.forEach((word) => {
      const flashcard = `
      <div class="flashcard">
        <div class="flashcard-content">
          <p class="flashcard-title">${word.word}</p>
          <div class="flashcard-icons">
            <button data-toggle="${word.id}" class="flashcard-meaning">
              <span class="ri-eye-line"></span>
            </button>
          </div>
        </div>
        <div data-meaning="${word.id}" class="hidden">
          <p class="flashcard-toggle">${word.meaning}</p>
        </div>
      </div>
      `;
      flashcardsList.innerHTML += flashcard;
    });
  }


  flashcardsList.addEventListener("click", event => {
    const btn = event.target.closest(".flashcard-meaning");
    if(btn){
      const id = btn.getAttribute("data-toggle");
      toggleMeaning(id);
    }else{
      return;
    }
  })

  await readFlashcards();
}
