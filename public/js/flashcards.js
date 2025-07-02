

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

// 暗記カードを追加するデータをサーバーに送る関数
async function createFlashcardData(wordData) {
  try {
    const url = "/api/flashcards";
    const response = await fetch(url, {
      method: "POST", // 今回はデータを「作成」するので、POSTメソッドを使う
      headers: { "Content-Type": "application/json" }, // 送るデータはJSON形式ですよ、と伝える
      body: JSON.stringify(wordData), // JavaScriptオブジェクトをJSON文字列に変換して送る
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function updateFlashcardData(id, cardData) {
  try {
    const url = `/api/flashcards/${id}`; 
    const response = await fetch(url, {
      method: 'PUT', // データを「更新」するので、PUTメソッドを使う
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData),
    });
    return await response.json();
  } catch (error) {
    console.error('Update failed:', error);
  }
} 

export async function setupFlashcards() {
 
  // --- 操作するHTML部品を、ここで変数に格納する ---
  const flashcardsList = document.getElementById("flashcards-list");
  const addWordBtn = document.querySelector(".add-word");
  const wordModal = document.getElementById("word-modal");
  const wordForm = document.getElementById("word-form");
  const cancelBtn = document.querySelector(".cancel-word");

  let editingCardId = null;
   let wordList = [];
  
  // --- モーダルを操作するための関数を定義する ---
  function showModal() {
    wordModal.classList.remove("hidden");
    document.getElementById("word-input").focus();
  }
  function hideModal() {
    wordModal.classList.add("hidden");
    wordForm.reset();
  }

  // --- ボタンに「聞き耳」を立てさせる（イベントリスナーの設定） ---
  addWordBtn.addEventListener("click", () => {
    editingCardId = null;
    showModal();
  });

  cancelBtn.addEventListener("click", hideModal);

  wordModal.addEventListener("click", (event) => {
    if (event.target === wordModal) {
      hideModal();
    }
  });
  
  flashcardsList.addEventListener("click", (event) => {
    const meaningBtn = event.target.closest(".flashcard-meaning");
    if (meaningBtn) {
      const id = meaningBtn.getAttribute("data-toggle");
      toggleMeaning(id);
      return;
    }

    const editBtn = event.target.closest(".flashcard-edit");
    if (editBtn) {
      const id = Number(editBtn.getAttribute("data-edit-id"));
      const cardToEdit = wordList.find((word) => word.id === id);

      //編集ボタンが押されたら「編集モード」にする ↓↓↓
      // どのカードを編集中か、IDを覚えておく
      editingCardId = cardToEdit.id;

      document.getElementById("word-input").value = cardToEdit.word;
      document.getElementById("meaning-input").value = cardToEdit.meaning;
      showModal();
    }
  });
  async function save(event) {
    event.preventDefault(); 

    const wordInput = document.getElementById("word-input").value;
    const meaningInput = document.getElementById("meaning-input").value;

   if (editingCardId) {
    // 【編集モードの処理】
    const updatedCard ={
     word: wordInput.trim(),
     meaning: meaningInput.trim(),
    };
    await updateFlashcardData(editingCardId, updatedCard);

  } else {
    // 【新規作成モードの処理】
    const word = {
      id: Date.now(),
      word: wordInput.trim(),
      meaning: meaningInput.trim(),
    };
    await createFlashcardData(word);
    hideModal();
  }

  // 最後に、カード一覧を更新し、モーダルを閉じる
  await readFlashcards();
  hideModal();
  }
  
  // --- フォームの送信イベントに、「save」関数を関連付ける ---
  wordForm.addEventListener("submit", save);

  function toggleMeaning(id) {
    const meaningElement = document.querySelector(`[data-meaning="${id}"]`);
    if (meaningElement.classList.contains("hidden")) {
      meaningElement.classList.remove("hidden");
    } else {
      meaningElement.classList.add("hidden");
    }
  }

  async function readFlashcards() {
    wordList = await fetchFlashcards();
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
              <button data-edit-id="${word.id}" class="flashcard-edit">
              <span class="ri-pencil-line"></span>
              </button>
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
    //意味をみるボタンが押されたとき
    const meaningBtn = event.target.closest(".flashcard-meaning");
    if(meaningBtn){
    const id = meaningBtn.getAttribute("data-toggle");
    toggleMeaning(id);
    return;
    }

    // 「編集」ボタンが押された場合
  const editBtn = event.target.closest(".flashcard-edit");
  if (editBtn) {
    // 1. どのカードが押されたか、IDを取得する
    const id = Number(editBtn.getAttribute("data-edit-id"));

    // 2. IDを元に、カードの完全な情報を見つけ出す
    const cardToEdit = wordList.find(word => word.id === id);

    // 3. 見つけ出した情報で、モーダルの入力欄を埋める
    document.getElementById("word-input").value = cardToEdit.word;
    document.getElementById("meaning-input").value = cardToEdit.meaning;
    
    // 4. モーダルを表示する
    showModal();
  }
  });

  await readFlashcards();
}
