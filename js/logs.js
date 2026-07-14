// ======================================
// PatternLock-v5
// logs.js
// ログイン履歴表示
// ======================================

// ログインチェック
if (sessionStorage.getItem("loggedIn") !== "true") {
    location.href = "login.html";
}

const table = document.getElementById("logTable");

// ----------------------
// ログイン履歴読み込み
// ----------------------
async function loadLogs() {

    const { data, error } = await window.db
        .from("login_logs")
        .select("*")
        .order("login_time", { ascending: false });

    if (error) {
        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="3">読み込みに失敗しました</td>
            </tr>
        `;
        return;
    }

    if (!data || data.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="3">ログイン履歴はありません</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = "";

    data.forEach(log => {

        const tr = document.createElement("tr");

        const statusHtml =
            log.status === "success"
            ? '<span style="color:#16a34a;font-weight:bold;">🟢 success</span>'
            : '<span style="color:#dc2626;font-weight:bold;">🔴 failed</span>';

        tr.innerHTML = `
            <td>${log.username}</td>
            <td>${statusHtml}</td>
            <td>${new Date(log.login_time).toLocaleString("ja-JP")}</td>
        `;

        table.appendChild(tr);

    });

}

// ----------------------
// CSVダウンロード
// ----------------------
document.getElementById("downloadCsv").addEventListener("click", async () => {

    const { data, error } = await window.db
        .from("login_logs")
        .select("*")
        .order("login_time", { ascending: false });

    if (error) {
        alert("CSVを作成できませんでした");
        return;
    }

    let csv = "ユーザー名,状態,ログイン日時\n";

    data.forEach(log => {
        csv += `${log.username},${log.status},${log.login_time}\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "login_logs.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

});

// 初回読み込み
loadLogs();
