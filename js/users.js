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
        .select("username, role, redirect_url")
        .order("username");

    if (error) {
        console.error(error);
        table.innerHTML =
            "<tr><td colspan='4'>読み込み失敗</td></tr>";
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
                <button class="editButton"
                    onclick="editUser('${user.username}')">
                    ✏️ 編集
                </button>

                <button class="deleteButton"
                    onclick="deleteUser('${user.username}')">
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

    const username =
        document.getElementById("newUsername").value.trim();

    const pattern =
        document.getElementById("newPattern").value.trim();

    const redirect =
        document.getElementById("newRedirect").value.trim();

    const role =
        document.getElementById("newRole").value;

    if (!username || !pattern) {
        alert("ユーザー名とパターンを入力してください");
        return;
    }

    const { error } = await window.db
        .from("users")
        .insert([{
            username: username,
            pattern_hash: pattern,
            redirect_url: redirect,
            role: role
        }]);

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
// 編集
// ------------------------
async function editUser(username) {

    const { data, error } = await window.db
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

    if (error) {
        alert("取得できませんでした");
        return;
    }

    const pattern =
        prompt("パターン", data.pattern_hash);

    if (pattern === null) return;

    const redirect =
        prompt("移動先URL", data.redirect_url ?? "");

    if (redirect === null) return;

    const role =
        prompt("権限(admin/student)", data.role);

    if (role === null) return;

    const { error:updateError } = await window.db
        .from("users")
        .update({
            pattern_hash: pattern,
            redirect_url: redirect,
            role: role
        })
        .eq("username", username);

    if (updateError) {
        console.error(updateError);
        alert("更新できませんでした");
        return;
    }

    alert("更新しました");

    loadUsers();

}

// ------------------------
// 削除
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

// 初回読み込み
loadUsers();
