const dots = document.querySelectorAll(".dot");
const message = document.getElementById("message");
const saveButton = document.getElementById("saveButton");
const resetButton = document.getElementById("resetButton");

let pattern = [];
let isDrawing = false;


// ドット取得
dots.forEach(dot => {

    dot.addEventListener("mousedown", () => {
        isDrawing = true;
        addDot(dot);
    });


    dot.addEventListener("mouseover", () => {

        if(isDrawing){
            addDot(dot);
        }

    });


    dot.addEventListener("mouseup", () => {
        isDrawing = false;
    });


    // スマホ対応
    dot.addEventListener("touchstart", (e)=>{

        e.preventDefault();

        isDrawing = true;
        addDot(dot);

    });

});


document.addEventListener("mouseup", ()=>{

    isDrawing = false;

});



function addDot(dot){

    const id = dot.dataset.id;


    if(pattern.includes(id)){
        return;
    }


    pattern.push(id);

    dot.classList.add("active");

}



resetButton.addEventListener("click", ()=>{

    clearPattern();

});



function clearPattern(){

    pattern = [];

    dots.forEach(dot=>{
        dot.classList.remove("active");
    });


    message.textContent =
    "新しいパターンを入力してください";

}




saveButton.addEventListener("click", ()=>{


    if(pattern.length < 3){

        message.textContent =
        "3つ以上のドットを選択してください";

        return;

    }


    localStorage.setItem(
        "patternLockPassword",
        JSON.stringify(pattern)
    );


    message.textContent =
    "パターンを変更しました";


    clearPattern();


});
