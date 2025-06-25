import express from "express";
import path from "path";
import { readFile, writeFile } from "fs/promises";

export const app = express();

const __dirname = import.meta.dirname;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// /api/flashcards に GETリクエストが来たら "flashcards.json" の内容を返す



// /api/flashcards に POSTリクエストが来たら "flashcards.json" に追加し、追加したデータを返す


