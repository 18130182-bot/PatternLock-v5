// ======================================
// PatternLock Secure v9
// logs.js
// ======================================

// ----------------------------
// ログインチェック
// ----------------------------

if (sessionStorage.getItem("loggedIn") !== "true") {
    location.href = "login.html";
}

const table = document.getElementById("logTable");

// ----------------------------
// ログ一覧読み込み
// ----------------------------

async function loadLogs() {

    const { data, error } = await window.db
        .from("login_logs")
        .select("*")
        .order("login_time", { ascending: false });

    if (error) {

        console.error(error);

        table.innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center;">
                読み込みに失敗しました
            </td>
        </tr>`;

        return;
    }

    if (!data || data.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center;">
                ログはありません
            </td>
        </tr>`;

        return;
    }

    table.innerHTML = "";

    data.forEach(log => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

<td>
${log.username}
</td>

<td>

<span class="status ${log.status}">

${log.status === "success"
    ? "🟢 成功"
    : "🔴 失敗"}

</span>

</td>

<td class="time">

${new Date(log.login_time).toLocaleString("ja-JP")}

</td>

<td>

<button
class="button-danger"
onclick="deleteLog('${log.id}')">

🗑 削除

</button>

</td>

`;

        table.appendChild(tr);

    });

}

// ----------------------------
// 1件削除
// ----------------------------

async function deleteLog(id) {

    if (!confirm("このログを削除しますか？")) {
        return;
    }

    const { error } = await window.db
        .from("login_logs")
        .delete()
        .eq("id", id);

    if (error) {

        console.error(error);
        alert("削除できませんでした");
        return;

    }

    loadLogs();

}

// ----------------------------
// 全削除
// ----------------------------

const deleteLogsButton = document.getElementById("deleteLogs");

if (deleteLogsButton) {

    deleteLogsButton.addEventListener("click", async () => {

        if (!confirm("ログをすべて削除しますか？")) {
            return;
        }

        const { error } = await window.db
            .from("login_logs")
            .delete()
            .neq("id", 0);

        if (error) {

            console.error(error);
            alert("削除できませんでした");
            return;

        }

        loadLogs();

    });

}

// ----------------------------
// CSVダウンロード
// ----------------------------

const csvButton = document.getElementById("downloadCsv");

if (csvButton) {

    csvButton.addEventListener("click", async () => {

        const { data, error } = await window.db
            .from("login_logs")
            .select("*")
            .order("login_time", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        let csv = "ユーザー名,状態,日時\n";

        data.forEach(log => {

            csv += `"${log.username}","${log.status}","${new Date(log.login_time).toLocaleString("ja-JP")}"\n`;

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

}

// ----------------------------
// リアルタイム検索
// ----------------------------

const searchLog = document.getElementById("searchLog");

if (searchLog) {

    searchLog.addEventListener("input", function () {

        const keyword = this.value.toLowerCase();

        document.querySelectorAll("#logTable tr").forEach(row => {

            row.style.display =
                row.innerText.toLowerCase().includes(keyword)
                    ? ""
                    : "none";

        });

    });

}

// ----------------------------
// 初回読み込み
// ----------------------------

loadLogs();
