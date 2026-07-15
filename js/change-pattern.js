const dots = [...document.querySelectorAll(".dot")];

const message = document.getElementById("message");

const saveButton = document.getElementById("saveButton");

const resetButton = document.getElementById("resetButton");

const svg = document.getElementById("lineCanvas");


let pattern = [];

let drawing = false;



function getCenter(dot){

    const rect = dot.getBoundingClientRect();

    const parent = svg.getBoundingClientRect();


    return {

        x: rect.left - parent.left + rect.width / 2,

        y: rect.top - parent.top + rect.height / 2

    };

}




function drawLine(){


    svg.innerHTML="";


    for(let i=0;i<pattern.length-1;i++){


        const a =
        document.querySelector(
            `.dot[data-id="${pattern[i]}"]`
        );


        const b =
        document.querySelector(
            `.dot[data-id="${pattern[i+1]}"]`
        );


        const p1=getCenter(a);

        const p2=getCenter(b);



        const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


        line.setAttribute("x1",p1.x);

        line.setAttribute("y1",p1.y);

        line.setAttribute("x2",p2.x);

        line.setAttribute("y2",p2.y);


        line.setAttribute(
            "stroke",
            "#4285f4"
        );


        line.setAttribute(
            "stroke-width",
            "8"
        );


        line.setAttribute(
            "stroke-linecap",
            "round"
        );


        svg.appendChild(line);

    }

}




function addDot(dot){


    const id=dot.dataset.id;


    if(pattern.includes(id)){
        return;
    }


    pattern.push(id);


    dot.classList.add("active");


    drawLine();

}





dots.forEach(dot=>{


    dot.addEventListener(
        "mousedown",
        ()=>{

            drawing=true;

            addDot(dot);

        }
    );


    dot.addEventListener(
        "mouseover",
        ()=>{

            if(drawing){

                addDot(dot);

            }

        }
    );


    dot.addEventListener(
        "touchstart",
        e=>{

            e.preventDefault();

            drawing=true;

            addDot(dot);

        }
    );


});



document.addEventListener(
"mouseup",
()=>{

    drawing=false;

});





resetButton.onclick=()=>{


    pattern=[];


    dots.forEach(dot=>{

        dot.classList.remove("active");

    });


    svg.innerHTML="";


    message.textContent=
    "新しいパターンを入力してください";


};





saveButton.onclick=()=>{


    if(pattern.length<3){


        message.textContent=
        "3つ以上選択してください";


        return;

    }



    localStorage.setItem(

        "patternLockPassword",

        JSON.stringify(pattern)

    );



    message.textContent=
    "パターンを変更しました";


};
