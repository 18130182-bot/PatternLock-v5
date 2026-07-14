// ======================================
// PatternLock-v5
// users.js
// ユーザー管理
// ======================================

// ログインチェック
if (sessionStorage.getItem("loggedIn") !== "true") {
    location.href = "login.html";
}

const table = document.getElementById("userTable");
const message = document.getElementById("message");

// ----------------------
// ユーザー一覧表示
// ----------------------
async function loadUsers() {

    const { data, error } = await window.db
        .from("users")
        .select("id, username, pattern_hash")
        .order("username");

    if (error) {
        console.error(error);
        table.innerHTML = `
            <tr>
                <td colspan="3">読み込み失敗</td>
            </tr>
        `;
        return;
    }

    if (!data || data.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="3">ユーザーがありません</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = "";

    data.forEach(user => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${user.username}</td>
            <td>${user.pattern_hash}</td>
            <td>
                <button class="danger" onclick="deleteUser('${user.id}')">
                    削除
                </button>
            </td>
        `;

        table.appendChild(tr);

    });

}

// ----------------------
// ユーザー追加
// ----------------------
document.getElementById("addUser").addEventListener("click", async () => {

    const username = document.getElementById("newUsername").value.trim();
    const pattern = document.getElementById("newPattern").value.trim();

    if (!username || !pattern) {
        message.style.color = "red";
        message.textContent = "入力してください";
        return;
    }

    const { error } = await window.db
        .from("users")
        .insert([
            {
                username: username,
                pattern_hash: pattern
            }
        ]);

    if (error) {
        console.error(error);
        message.style.color = "red";
        message.textContent = "追加失敗";
        return;
    }

    message.style.color = "green";
    message.textContent = "追加しました";

    document.getElementById("newUsername").value = "";
    document.getElementById("newPattern").value = "";

    loadUsers();

});

// ----------------------
// ユーザー削除
// ----------------------
async function deleteUser(id) {

    if (!confirm("削除しますか？")) return;

    const { error } = await window.db
        .from("users")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("削除できませんでした");
        return;
    }

    loadUsers();

}

// 初回読み込み
loadUsers();
