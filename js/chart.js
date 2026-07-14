// ======================================
// PatternLock-v5
// chart.js
// ログイン統計グラフ
// ======================================

// ログインチェック
if (sessionStorage.getItem("loggedIn") !== "true") {
    location.href = "login.html";
}

async function loadChart() {

    const { data, error } = await window.db
        .from("login_logs")
        .select("status, login_time")
        .order("login_time", { ascending: true })
        .limit(20);

    if (error) {
        console.error(error);
        return;
    }

    const labels = [];
    const successData = [];
    const failedData = [];

    data.forEach((log, index) => {

        labels.push((index + 1).toString());

        successData.push(log.status === "success" ? 1 : 0);
        failedData.push(log.status === "failed" ? 1 : 0);

    });

    const ctx = document.getElementById("loginChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "成功",
                    data: successData,
                    backgroundColor: "#22c55e"
                },
                {
                    label: "失敗",
                    data: failedData,
                    backgroundColor: "#ef4444"
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true,
                    text: "直近20件のログイン結果"
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

}

loadChart();
