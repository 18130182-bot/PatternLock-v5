// ======================================
// ログインロック設定
// ======================================

let failedCount = Number(localStorage.getItem("failedCount")) || 0;
let lockUntil = Number(localStorage.getItem("lockUntil")) || 0;

// ロック中か確認
if (Date.now() < lockUntil) {

    const remain = Math.ceil((lockUntil - Date.now()) / 1000);

    message.style.color = "#dc2626";
    message.textContent =
        `🔒 ロック中です (${remain}秒)`;

    const loginButton = document.getElementById("loginButton");

    if (loginButton) {
        loginButton.disabled = true;
    }

    const timer = setInterval(() => {

        const left = Math.ceil((lockUntil - Date.now()) / 1000);

        if (left <= 0) {

            clearInterval(timer);

            localStorage.removeItem("failedCount");
            localStorage.removeItem("lockUntil");

            if (loginButton) {
                loginButton.disabled = false;
            }

            message.style.color = "#16a34a";
            message.textContent =
                "もう一度ログインできます";

        } else {

            message.textContent =
                `🔒 ロック中です (${left}秒)`;

        }

    }, 1000);

}

// ======================================
// PatternLock Secure v8
// student-auth.js
// ======================================

async function authenticate(pattern) {

    try {

        const patternString = pattern.join("-");

        message.style.color = "#2563eb";
        message.textContent = "認証中...";

        // パターンが一致するユーザーを検索
        const { data, error } = await window.db
    .from("users")
    .select("username, pattern_hash, redirect_url, role")
    .eq("pattern_hash", patternString)
    .single();

console.log("pattern =", patternString);
console.log("data =", data);
console.log("error =", error);

        if (error || !data) {

           failedCount++;

localStorage.setItem("failedCount", failedCount);

if (failedCount >= 5) {

    const until = Date.now() + 30000;

    localStorage.setItem("lockUntil", until);

    message.style.color = "#dc2626";
    message.textContent = "🔒 30秒間ロックされました";

    document.getElementById("loginButton").disabled = true;

    return;
}

message.style.color = "#dc2626";
message.textContent =
    `パターンが違います（${failedCount}/5）`;

clearPattern();

return;
        }

        // ログ保存
        await window.db
            .from("login_logs")
            .insert([
                {
                    username: data.username,
                    status: "success"
                }
            ]);

        message.style.color = "#16a34a";
        message.textContent = "認証成功";

        setTimeout(() => {

            // 管理者なら管理画面へ
            if (data.role === "admin") {

                sessionStorage.setItem("loggedIn", "true");
                sessionStorage.setItem("username", data.username);

                location.href = "home.html";
                return;
            }

            // 生徒なら登録されたURLへ
            if (data.redirect_url) {
                location.href = data.redirect_url;
            } else {
                message.style.color = "#dc2626";
                message.textContent = "移動先URLが設定されていません";
            }

        }, 800);

    } catch (e) {

        console.error(e);

        message.style.color = "#dc2626";
        message.textContent = "予期しないエラー";

    }

}
