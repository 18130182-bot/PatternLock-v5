// ======================================
// PatternLock Secure v8
// users.js
// ======================================

// ログインチェック
if (sessionStorage.getItem("loggedIn") !== "true") {
    location.href = "login.html";
}

const table = document.getElementById("userTable");

// ------------------------
// ユーザー一覧
// ------------------------
async function loadUsers() {

    const { data, error } = await window.db
        .from("users")
        .select("*")
        .order("username");

    if (error) {
        console.error(error);
        return;
    }

    table.innerHTML = "";

    data.forEach(user => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.redirect_url ?? "-"}</td>
            <td>
                <button
                onclick="deleteUser('${user.username}')"
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

// ------------------------
// ユーザー追加
// ------------------------
document.getElementById("addUserButton").addEventListener("click", async () => {

    const username = document.getElementById("newUsername").value.trim();
    const pattern = document.getElementById("newPattern").value.trim();
    const redirect = document.getElementById("newRedirect").value.trim();
    const role = document.getElementById("newRole").value;

    if (!username || !pattern) {
        alert("ユーザー名とパターンを入力してください");
        return;
    }

    const { error } = await window.db
        .from("users")
        .insert([
            {
                username: username,
                pattern_hash: pattern,
                redirect_url: redirect,
                role: role
            }
        ]);

    if (error) {
        console.error(error);
        alert("追加できませんでした");
        return;
    }

    alert("ユーザーを追加しました");

    document.getElementById("newUsername").value = "";
    document.getElementById("newPattern").value = "";
    document.getElementById("newRedirect").value = "";
    document.getElementById("newRole").value = "student";

    loadUsers();

});

// ------------------------
// ユーザー削除
// ------------------------
async function deleteUser(username) {

    if (username === "admin") {
        alert("adminは削除できません");
        return;
    }

    if (!confirm(`${username} を削除しますか？`)) {
        return;
    }

    const { error } = await window.db
        .from("users")
        .delete()
        .eq("username", username);

    if (error) {
        console.error(error);
        alert("削除できませんでした");
        return;
    }

    loadUsers();

}

// 初回読込
loadUsers();
