// ======================================
// PatternLock-v5
// draw.js
// ======================================

// --------------------
// ドット中心座標
// --------------------
function getCenter(dot) {

    const rect = dot.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    return {
        x: rect.left + rect.width / 2 - svgRect.left,
        y: rect.top + rect.height / 2 - svgRect.top
    };

}

// --------------------
// 仮線終了
// --------------------
function finishCurrentLine() {

    if (currentLine) {

        currentLine.remove();
        currentLine = null;

    }

}

// --------------------
// 仮線開始
// --------------------
function startCurrentLine(dot) {

    finishCurrentLine();

    const p = getCenter(dot);

    currentLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    currentLine.setAttribute("x1", p.x);
    currentLine.setAttribute("y1", p.y);
    currentLine.setAttribute("x2", p.x);
    currentLine.setAttribute("y2", p.y);

    currentLine.setAttribute("stroke", "#60a5fa");
    currentLine.setAttribute("stroke-width", "4");
    currentLine.setAttribute("stroke-linecap", "round");

    svg.appendChild(currentLine);

}

// --------------------
// 仮線更新
// --------------------
function updateCurrentLine(x, y) {

    if (!currentLine) return;

    currentLine.setAttribute("x2", x);
    currentLine.setAttribute("y2", y);

}

// --------------------
// 固定線描画
// --------------------
function drawLine(dot1, dot2) {

    const p1 = getCenter(dot1);
    const p2 = getCenter(dot2);

    const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute("x1", p1.x);
    line.setAttribute("y1", p1.y);
    line.setAttribute("x2", p2.x);
    line.setAttribute("y2", p2.y);

    line.setAttribute("stroke", "#2563eb");
    line.setAttribute("stroke-width", "6");
    line.setAttribute("stroke-linecap", "round");

    svg.appendChild(line);

}
