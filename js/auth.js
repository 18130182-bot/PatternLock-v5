// ======================================
// PatternLock-v5
// auth.js
// Supabase Login
// ======================================

async function authenticate(pattern) {

    try {

        // 入力したパターンを文字列へ
        const patternString = pattern.join("-");

        if (message) {
            message.style.color = "#2563eb";
            message.textContent = "認証中...";
        }

        // admin を取得
        const { data, error } = await window.db
            .from("users")
            .select("username, pattern_hash")
            .eq("username", "admin")
            .single();

        if (error) {

            console.error(error);

            message.style.color = "#dc2626";
            message.textContent = "サーバー接続エラー";

            return;
        }

        if (!data) {

            message.style.color = "#dc2626";
            message.textContent = "ユーザーが見つかりません";

            return;
        }

     // パターン一致
if (data.pattern_hash === patternString) {

    message.style.color = "#16a34a";
    message.textContent = "ログイン成功";

    // ログイン履歴を保存
    const { error: logError } = await window.db
        .from("login_logs")
        .insert([
            {
                username: data.username,
                status: "success"
            }
        ]);

    if (logError) {
        console.error("ログ保存エラー:", logError);
    }

    // ログイン状態を保存
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("username", data.username);

    // 少し待って画面遷移
    setTimeout(() => {
        location.href = "home.html";
    }, 800);

}

        } else {

            message.style.color = "#dc2626";
            message.textContent = "パターンが違います";

            // 入力をリセット
            clearPattern();

        }

    } catch (e) {

        console.error(e);

        message.style.color = "#dc2626";
        message.textContent = "予期しないエラー";

    }

}
