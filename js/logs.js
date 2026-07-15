// ======================================
// PatternLock Secure v7
// logs.js
// ======================================

// ログインチェック
if (sessionStorage.getItem("loggedIn") !== "true") {
    location.href = "login.html";
}

const table = document.getElementById("logTable");

// ======================================
// ログ読み込み
// ======================================
async function loadLogs() {

    const { data, error } = await window.db
        .from("login_logs")
        .select("*")
        .order("login_time", { ascending: false });

    if (error) {
        console.error(error);
        table.innerHTML =
            `<tr><td colspan="4">読み込み失敗</td></tr>`;
        return;
    }

    if (!data || data.length === 0) {
        table.innerHTML =
            `<tr><td colspan="4">ログはありません</td></tr>`;
        return;
    }

    table.innerHTML = "";

    data.forEach(log => {

        const status =
            log.status === "success"
                ? '<span style="color:#16a34a;font-weight:bold;">🟢 success</span>'
                : '<span style="color:#dc2626;font-weight:bold;">🔴 failed</span>';

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${log.username}</td>
            <td>${status}</td>
            <td>${new Date(log.login_time).toLocaleString("ja-JP")}</td>
            <td>
                <button onclick="deleteLog('${log.id}')"
                style="
                background:#dc2626;
                color:white;
                border:none;
                padding:8px 12px;
                border-radius:8px;
                cursor:pointer;">
                🗑 削除
                </button>
            </td>
        `;

        table.appendChild(tr);

    });

}

// ======================================
// 1件削除
// ======================================
async function deleteLog(id){

    if(!confirm("このログを削除しますか？")){
        return;
    }

    const { error } = await window.db
        .from("login_logs")
        .delete()
        .eq("id", id);

    if(error){
        console.error(error);
        alert("削除できませんでした");
        return;
    }

    loadLogs();

}

// ======================================
// 全件削除
// ======================================
document.getElementById("deleteAllLogs").addEventListener("click", async()=>{

    if(!confirm("ログをすべて削除しますか？")){
        return;
    }

    const { error } = await window.db
        .from("login_logs")
        .delete()
        .neq("id", 0);

    if(error){
        console.error(error);
        alert("削除できませんでした");
        return;
    }

    loadLogs();

});

// ======================================
// CSV
// ======================================
document.getElementById("downloadCsv").addEventListener("click", async()=>{

    const { data } = await window.db
        .from("login_logs")
        .select("*")
        .order("login_time",{ascending:false});

    let csv="ユーザー名,状態,日時\n";

    data.forEach(log=>{
        csv+=`${log.username},${log.status},${log.login_time}\n`;
    });

    const blob=new Blob([csv],{
        type:"text/csv;charset=utf-8;"
    });

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;
    a.download="login_logs.csv";
    a.click();

    URL.revokeObjectURL(url);

});

// 初回読込
loadLogs();
// ======================================
// 検索機能
// ======================================

document.getElementById("searchButton").addEventListener("click", searchLogs);
document.getElementById("resetSearch").addEventListener("click", resetSearch);

async function searchLogs() {

    const user = document.getElementById("searchUser").value.trim();
    const status = document.getElementById("searchStatus").value;

    let query = window.db
        .from("login_logs")
        .select("*")
        .order("login_time", { ascending: false });

    if (user !== "") {
        query = query.ilike("username", `%${user}%`);
    }

    if (status !== "") {
        query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        return;
    }

    table.innerHTML = "";

    if (data.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4">検索結果はありません。</td>
            </tr>
        `;
        return;
    }

    data.forEach(log => {

        const statusHtml =
            log.status === "success"
                ? '<span style="color:#16a34a;font-weight:bold;">🟢 success</span>'
                : '<span style="color:#dc2626;font-weight:bold;">🔴 failed</span>';

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${log.username}</td>
            <td>${statusHtml}</td>
            <td>${new Date(log.login_time).toLocaleString("ja-JP")}</td>
            <td>
                <button onclick="deleteLog('${log.id}')"
                style="
                background:#dc2626;
                color:white;
                border:none;
                padding:8px 12px;
                border-radius:8px;
                cursor:pointer;">
                🗑 削除
                </button>
            </td>
        `;

        table.appendChild(tr);

    });

}

function resetSearch() {

    document.getElementById("searchUser").value = "";
    document.getElementById("searchStatus").value = "";

    loadLogs();

}
