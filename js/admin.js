// ======================================
// PatternLock Secure
// admin.js
// 管理者ダッシュボード
// ======================================

// ログインチェック
if (sessionStorage.getItem("loggedIn") !== "true") {
    location.href = "login.html";
}

document.getElementById("adminName").textContent =
    "👤 " + sessionStorage.getItem("username");

// =====================
// ダッシュボード読込
// =====================
async function loadDashboard() {

    try {

        // ユーザー数
        const { count: userCount } = await window.db
            .from("users")
            .select("*", { count: "exact", head: true });

        document.getElementById("userCount").textContent = userCount;

        // ログ件数
        const { count: logCount } = await window.db
            .from("login_logs")
            .select("*", { count: "exact", head: true });

        document.getElementById("logCount").textContent = logCount;

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

        const total = successCount + failedCount;

        const rate =
            total === 0
                ? 0
                : Math.round(successCount / total * 100);

        document.getElementById("successRate").textContent =
            rate + "%";

        // 今日の失敗
        const today = new Date().toISOString().slice(0, 10);

        const { count: failedToday } = await window.db
            .from("login_logs")
            .select("*", { count: "exact", head: true })
            .eq("status", "failed")
            .gte("login_time", today);

        document.getElementById("failedToday").textContent =
            failedToday;

        // ==========
        // グラフ
        // ==========
        const ctx = document.getElementById("adminChart");

        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: [
                    "成功",
                    "失敗"
                ],
                datasets: [{
                    data: [
                        successCount,
                        failedCount
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "ログイン成功率"
                    }
                }
            }
        });

    } catch (e) {

        console.error(e);

        alert("管理画面の読み込みに失敗しました。");

    }

}

loadDashboard();
