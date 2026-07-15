// ======================================
// PatternLock Secure v7
// settings.js
// ======================================

// ログインチェック
if (sessionStorage.getItem("loggedIn") !== "true") {
    location.href = "login.html";
}

// ユーザー名表示
const username = sessionStorage.getItem("username") || "admin";

document.getElementById("username").textContent = username;
document.getElementById("accountName").textContent = username;

// ======================================
// ダークモード
// ======================================

const themeButton = document.getElementById("themeButton");
const toggleTheme = document.getElementById("toggleTheme");

// 現在のテーマを反映
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if (themeButton) themeButton.textContent = "☀️";
}

// テーマ切替関数
function changeTheme() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        if (themeButton) themeButton.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        if (themeButton) themeButton.textContent = "🌙";
    }

}

// 両方のボタンで切替
if (themeButton) {
    themeButton.addEventListener("click", changeTheme);
}

if (toggleTheme) {
    toggleTheme.addEventListener("click", changeTheme);
}

// ======================================
// ログアウト
// ======================================

document.getElementById("logoutButton").addEventListener("click", () => {

    if (!confirm("ログアウトしますか？")) {
        return;
    }

    sessionStorage.clear();

    location.href = "login.html";

});
