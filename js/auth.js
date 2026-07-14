// ======================================
// PatternLock-v5
// auth.js
// Supabase Login
// ======================================

async function authenticate(pattern) {

    try {

        const patternString = pattern.join("-");

        message.style.color = "#2563eb";
        message.textContent = "認証中...";

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

        if (data.pattern_hash === patternString) {

            message.style.color = "#16a34a";
            message.textContent = "ログイン成功";

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

            sessionStorage.setItem("loggedIn", "true");
            sessionStorage.setItem("username", data.username);

            setTimeout(() => {
                location.href = "home.html";
            }, 800);

        } else {

            message.style.color = "#dc2626";
            message.textContent = "パターンが違います";

            clearPattern();

        }

    } catch (e) {

        console.error(e);

        message.style.color = "#dc2626";
        message.textContent = "予期しないエラー";

    }

}
