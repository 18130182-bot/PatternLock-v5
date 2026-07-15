// ======================================
// PatternLock Secure v7
// home.js
// ======================================

// ログインチェック
if (sessionStorage.getItem("loggedIn") !== "true") {
    location.href = "login.html";
}

const username = sessionStorage.getItem("username") || "admin";

// ユーザー名表示
const username1 = document.getElementById("username");
const username2 = document.getElementById("userNameCard");

if (username1) username1.textContent = username;
if (username2) username2.textContent = username;

// -------------------------
// ダークモード
// -------------------------
const themeButton = document.getElementById("themeButton");

if (themeButton) {

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        themeButton.textContent = "☀";
    }

    themeButton.onclick = () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            themeButton.textContent = "☀";
        } else {
            localStorage.setItem("theme", "light");
            themeButton.textContent = "🌙";
        }

    };

}

// -------------------------
// ダッシュボード読込
// -------------------------
async function loadDashboard() {

    try {

        // ログ件数
        const { count: logCount } = await window.db
            .from("login_logs")
            .select("*", {
                count: "exact",
                head: true
            });

        document.getElementById("logCount").textContent = logCount;

        // 成功件数
        const { count: successCount } = await window.db
            .from("login_logs")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("status", "success");

        // 失敗件数
        const { count: failedCount } = await window.db
            .from("login_logs")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("status", "failed");

        const total = successCount + failedCount;

        const rate =
            total === 0
            ? 0
            : Math.round(successCount / total * 100);

        document.getElementById("successRate").textContent =
            rate + "%";

        // 今日の失敗
        const today = new Date().toISOString().slice(0,10);

        const { count: failedToday } = await window.db
            .from("login_logs")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("status","failed")
            .gte("login_time", today);

        document.getElementById("failedToday").textContent =
            failedToday;

    } catch(e){

        console.error(e);

    }

}

loadDashboard();

// -------------------------
// ログアウト
// -------------------------
function logout(){

    sessionStorage.clear();

    location.href = "login.html";

}
