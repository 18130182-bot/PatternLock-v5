// ======================================
// PatternLock-v5
// logs.js
// ログイン履歴表示
// ======================================

// ログインしていない場合はログイン画面へ
if (sessionStorage.getItem("loggedIn") !== "true") {
    location.href = "login.html";
}

async function loadLogs() {

    const table = document.getElementById("logTable");

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

        tr.innerHTML = `
            <td>${log.username}</td>
            <td>
    ${
        log.status === "success"
        ? '<span style="color:#16a34a;font-weight:bold;">🟢 success</span>'
        : '<span style="color:#dc2626;font-weight:bold;">🔴 failed</span>'
    }
</td>
            <td>${new Date(log.login_time).toLocaleString("ja-JP")}</td>
        `;

        table.appendChild(tr);

    });

}

loadLogs();
