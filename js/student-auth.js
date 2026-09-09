// ======================================
// ログインロック設定
// ======================================

let failedCount = Number(localStorage.getItem("failedCount")) || 0;
let lockUntil = Number(localStorage.getItem("lockUntil")) || 0;


// ======================================
// ロック中か確認
// ======================================

if (Date.now() < lockUntil) {

    const remain = Math.ceil(
        (lockUntil - Date.now()) / 1000
    );

    message.style.color = "#dc2626";
    message.textContent =
        `🔒 ロック中です (${remain}秒)`;

    const loginButton =
        document.getElementById("loginButton");

    if (loginButton) {
        loginButton.disabled = true;
    }

    const timer = setInterval(() => {

        const left = Math.ceil(
            (lockUntil - Date.now()) / 1000
        );

        if (left <= 0) {

            clearInterval(timer);

            localStorage.removeItem("failedCount");
            localStorage.removeItem("lockUntil");

            failedCount = 0;
            lockUntil = 0;

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


        // ======================================
        // パターンが一致するユーザーを検索
        // ======================================

        const { data, error } = await window.db
            .from("users")
            .select(
                "username, pattern_hash, redirect_url, role"
            )
            .eq("pattern_hash", patternString)
            .single();


        console.log("pattern =", patternString);
        console.log("data =", data);
        console.log("error =", error);


        // ======================================
        // 認証失敗
        // ======================================

        if (error || !data) {

            // 失敗回数を増やす
            failedCount++;

            localStorage.setItem(
                "failedCount",
                failedCount
            );


            // ======================================
            // 失敗ログを保存
            // ======================================

            await window.db
                .from("login_logs")
                .insert([
                    {
                        username: "unknown",
                        status: "failed"
                    }
                ]);


            // ======================================
            // 5回失敗した場合
            // ======================================

            if (failedCount >= 5) {

                const until =
                    Date.now() + 30000;

                lockUntil = until;

                localStorage.setItem(
                    "lockUntil",
                    until
                );

                message.style.color = "#dc2626";

                message.textContent =
                    "🔒 30秒間ロックされました";

                const loginButton =
                    document.getElementById("loginButton");

                if (loginButton) {
                    loginButton.disabled = true;
                }

                return;
            }


            // ======================================
            // 1〜4回目の失敗
            // ======================================

            message.style.color = "#dc2626";

            message.textContent =
                `パターンが違います（${failedCount}/5）`;

            clearPattern();

            return;
        }


        // ======================================
        // 認証成功
        // ======================================

        await window.db
            .from("login_logs")
            .insert([
                {
                    username: data.username,
                    status: "success"
                }
            ]);


        // ======================================
        // 成功したので失敗回数をリセット
        // ======================================

        failedCount = 0;
        lockUntil = 0;

        localStorage.removeItem("failedCount");
        localStorage.removeItem("lockUntil");


        message.style.color = "#16a34a";
        message.textContent = "認証成功";


        // ======================================
        // リダイレクト
        // ======================================

        setTimeout(() => {

            // 管理者なら管理画面へ
            if (data.role === "admin") {

                sessionStorage.setItem(
                    "loggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "username",
                    data.username
                );

                location.href = "home.html";

                return;
            }


            // 生徒なら登録されたURLへ
            if (data.redirect_url) {

                location.href =
                    data.redirect_url;

            } else {

                message.style.color = "#dc2626";

                message.textContent =
                    "移動先URLが設定されていません";
            }

        }, 800);


    } catch (e) {

        console.error(e);

        message.style.color = "#dc2626";

        message.textContent =
            "予期しないエラー";

    }

}
変更したポイント

失敗時にこれを追加しています。

await window.db
    .from("login_logs")
    .insert([
        {
            username: "unknown",
            status: "failed"
        }
    ]);
