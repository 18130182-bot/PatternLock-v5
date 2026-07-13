// ======================================
// PatternLock-v5
// events.js
// ======================================

// --------------------
// マウス操作
// --------------------
dots.forEach(dot => {

    dot.addEventListener("mousedown", e => {

        e.preventDefault();

        drawing = true;

        activateDot(dot);

    });

    dot.addEventListener("mouseenter", () => {

        if (drawing) {
            activateDot(dot);
        }

    });

});

// --------------------
// マウス移動
// --------------------
document.addEventListener("mousemove", e => {

    if (!drawing) return;

    const rect = svg.getBoundingClientRect();

    updateCurrentLine(
        e.clientX - rect.left,
        e.clientY - rect.top
    );

});

// --------------------
// マウス終了
// --------------------
document.addEventListener("mouseup", () => {

    if (!drawing) return;

    drawing = false;

    finishCurrentLine();

});

// --------------------
// タッチ開始
// --------------------
dots.forEach(dot => {

    dot.addEventListener("touchstart", e => {

        e.preventDefault();

        drawing = true;

        activateDot(dot);

    });

});

// --------------------
// タッチ移動
// --------------------
document.addEventListener("touchmove", e => {

    if (!drawing) return;

    e.preventDefault();

    const touch = e.touches[0];

    const rect = svg.getBoundingClientRect();

    updateCurrentLine(
        touch.clientX - rect.left,
        touch.clientY - rect.top
    );

    const element = document.elementFromPoint(
        touch.clientX,
        touch.clientY
    );

    if (element && element.classList.contains("dot")) {
        activateDot(element);
    }

}, { passive: false });

// --------------------
// タッチ終了
// --------------------
document.addEventListener("touchend", () => {

    if (!drawing) return;

    drawing = false;

    finishCurrentLine();

});

// --------------------
// ログインボタン
// --------------------
if (loginButton) {

    loginButton.addEventListener("click", () => {

        if (pattern.length < 4) {

            message.style.color = "#dc2626";
            message.textContent = "4点以上選択してください";
            return;

        }

        authenticate(getPattern());

    });

}

// --------------------
// 保存ボタン
// --------------------
if (saveButton) {

    saveButton.addEventListener("click", () => {

        if (typeof savePattern === "function") {
            savePattern(getPattern());
        }

    });

}

// --------------------
// リセットボタン
// --------------------
if (resetButton) {

    resetButton.addEventListener("click", clearPattern);

}
