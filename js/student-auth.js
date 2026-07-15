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

        if (error || !data) {

            message.style.color = "#dc2626";
            message.textContent = "パターンが違います";

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
