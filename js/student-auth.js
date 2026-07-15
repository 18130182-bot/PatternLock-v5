// ======================================
// PatternLock Secure
// student-auth.js
// 生徒用認証
// ======================================

async function authenticate(pattern) {

    try {

        const patternString = pattern.join("-");

        message.style.color = "#2563eb";
        message.textContent = "認証中...";

        // users テーブルから student ユーザーを取得
        const { data, error } = await window.db
            .from("users")
            .select("username, pattern_hash")
            .eq("username", "student")
            .single();

        if (error || !data) {
            message.style.color = "#dc2626";
            message.textContent = "認証できません";
            return;
        }

        // パターン一致
        if (data.pattern_hash === patternString) {

            message.style.color = "#16a34a";
            message.textContent = "認証成功";

            // ログ保存（任意）
            await window.db
                .from("login_logs")
                .insert([
                    {
                        username: data.username,
                        status: "success"
                    }
                ]);

            // ★ここを好きなサイトに変更してください
            setTimeout(() => {
                location.href = "https://example.com";
            }, 800);

        } else {

            message.style.color = "#dc2626";
            message.textContent = "パターンが違います";

            clearPattern();

        }

    } catch (e) {

        console.error(e);

        message.style.color = "#dc2626";
        message.textContent = "エラーが発生しました";

    }

}
