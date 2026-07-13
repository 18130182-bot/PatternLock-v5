// ======================================
// PatternLock-v5
// core.js
// ======================================

// ドット一覧
const dots = [...document.querySelectorAll(".dot")];

// SVG
const svg = document.getElementById("patternCanvas");

// メッセージ
const message = document.getElementById("message");

// ボタン
const loginButton = document.getElementById("loginButton");
const resetButton = document.getElementById("resetButton");
const saveButton = document.getElementById("saveButton");

// パターン
let pattern = [];

// 描画中か
let drawing = false;

// 仮線
let currentLine = null;

// --------------------
// パターン取得
// --------------------
function getPattern() {
    return [...pattern];
}

// --------------------
// パターン追加
// --------------------
function addPattern(id) {

    if (pattern.includes(id)) {
        return false;
    }

    pattern.push(id);

    return true;
}

// --------------------
// パターン初期化
// --------------------
function resetPatternData() {

    pattern = [];

    drawing = false;

}
