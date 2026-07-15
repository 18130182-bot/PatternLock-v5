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
document.getElementById("username").textContent = username;
document.getElementById("userNameCard").textContent = username;

// ダークモード
const themeButton = document.getElementById("themeButton");

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

// ダッシュボード情報取得
async function loadDashboard() {

    try {

        // ログ総数
        const { count: logCount } = await window.db
            .from("login_logs")
            .select("*", { count: "exact", head: true });

        document.getElementById("logCount").textContent = logCount ?? 0;

        // 成功数
        const { count: successCount } = await window.db
            .from("login_logs")
            .select("*", { count: "exact", head: true })
            .eq("status", "success");

        // 失敗数
        const { count: failedCount } = await window.db
            .from("login_logs")
            .select("*", { count: "exact", head: true })
            .eq("status", "failed");

        const success = successCount ?? 0;
        const failed = failedCount ?? 0;
        const total = success + failed;

        const rate = total === 0
            ? 0
            : Math.round(success / total * 100);

        document.getElementById("successRate").textContent = rate + "%";

        // 今日の失敗件数
        const today = new Date().toISOString().split("T")[0];

        const { count: failedToday } = await window.db
            .from("login_logs")
            .select("*", { count: "exact", head: true })
            .eq("status", "failed")
            .gte("login_time", today);

        document.getElementById("failedToday").textContent =
            failedToday ?? 0;

        // 最新ログイン通知
        const { data: latest } = await window.db
            .from("login_logs")
            .select("*")
            .order("login_time", { ascending: false })
            .limit(1);

        const notice = document.getElementById("latestNotice");

        if (notice && latest && latest.length > 0) {
            notice.innerHTML =
                `👤 ${latest[0].username} が ${latest[0].status} (${latest[0].login_time})`;
        }

    } catch (e) {

        console.error("Dashboard Error:", e);

    }

}

loadDashboard();

// ログアウト
function logout() {

    sessionStorage.clear();

    location.href = "login.html";

}
