import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const flashcardsPath = path.resolve(__dirname, '../../data/flashcards.json');
const wordId = 123;
const newWord = {
  id: wordId,
  word: 'test',
  meaning: 'this is test'
};

describe('POST /api/flashcards', () => {
  test('Adding New word Check', async () => {
    const response = await fetch(`${global.TARGET_PAGE_URL}/api/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newWord),
    });
    expect(response.status).toBe(201);

    const responseData = await response.json();
    expect(responseData).toHaveProperty('id');
    expect(responseData.word).toBe(newWord.word);
    expect(responseData.meaning).toBe(newWord.meaning);
  });

  afterEach(() => {
    // テスト終了後にデータを削除
    const flashcards = JSON.parse(fs.readFileSync(flashcardsPath, 'utf-8'));
    const updatedFlashcards = flashcards.filter(card => card.id !== wordId);
    fs.writeFileSync(flashcardsPath, JSON.stringify(updatedFlashcards, null, 2));
  });
});

