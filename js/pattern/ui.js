// ======================================
// PatternLock-v5
// ui.js
// ======================================

// --------------------
// ドットを選択
// --------------------
function activateDot(dot) {

    const id = Number(dot.dataset.id);

    if (!addPattern(id)) {
        return;
    }

    if (pattern.length > 1) {

        const prev = document.querySelector(
            `.dot[data-id="${pattern[pattern.length - 2]}"]`
        );

        finishCurrentLine();
        drawLine(prev, dot);

    }

    dot.classList.add("active");

    startCurrentLine(dot);

}

// --------------------
// 全リセット
// --------------------
function clearPattern() {

    resetPatternData();

    finishCurrentLine();

    svg.innerHTML = "";

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    if (message) {
        message.textContent = "";
        message.style.color = "";
    }

}
