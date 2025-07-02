import express from "express";
import path from "path";
import { readFile, writeFile } from "fs/promises";

export const app = express();

const __dirname = import.meta.dirname;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// /api/flashcards に GETリクエストが来たら "flashcards.json" の内容を返す
app.post("/api/flashcards", async (req, res) => {
  const flashcardsJsonPath = path.join(__dirname, "data", "flashcards.json");
  const data = await readFile(flashcardsJsonPath, "utf-8");
  const flashcardsList = JSON.parse(data);
  const newWord = req.body;
  flashcardsList.push(newWord);
  const newFlashcardsJson = JSON.stringify(flashcardsList, null, 2);
  await writeFile(flashcardsJsonPath, newFlashcardsJson, "utf-8");
  res.status(201).json(newWord);
});

// /api/flashcards に POSTリクエストが来たら "flashcards.json" に追加し、追加したデータを返す
app.get("/api/flashcards", async (req, res) => {
  const flashcardsJsonPath = path.join(__dirname, "data", "flashcards.json");
  const data = await readFile(flashcardsJsonPath, "utf-8");
  const flashcardsList = JSON.parse(data);
  res.json(flashcardsList);
});

// /api/flashcards/:id にPUTリクエストが来たら、特定のカードを更新する
app.put("/api/flashcards/:id", async (req, res) => {
  // 1. URLから、どのカードを更新するかのIDを取得する
  const cardId = Number(req.params.id);

  // 2. フロントエンドから送られてきた、更新後のデータを取得する
  const updatedData = req.body;

  // 3. JSONファイルを読み込んで、配列に変換する
  const flashcardsJsonPath = path.join(__dirname, "data", "flashcards.json");
  const data = await readFile(flashcardsJsonPath, "utf-8");
  const flashcardsList = JSON.parse(data);

  // 4. 配列の中から、更新したいカードが何番目にあるか探す
  const cardIndex = flashcardsList.findIndex(card => card.id === cardId);

  // 5. もしカードが見つかったら...
  if (cardIndex !== -1) {
    // 元のカード情報と、更新後のデータを合体させる
    flashcardsList[cardIndex] = { ...flashcardsList[cardIndex], ...updatedData };
    
    // 6. ファイルに、更新後の配列を丸ごと上書き保存する
    await writeFile(flashcardsJsonPath, JSON.stringify(flashcardsList, null, 2), "utf-8");
    
    // 7. 成功したことと、更新後のデータを返す
    res.json(flashcardsList[cardIndex]);
  } else {
    // もしカードが見つからなかったら、エラーを返す
    res.status(404).json({ message: "Card not found" });
  }
});