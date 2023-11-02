const COLS =26;
const ROWS = 100;

const transparent = 'transparent';
const transparentBlue = "#ddddff";
const arrMatrix = "arrMatrix";

const tHeadRow = document.getElementById("table-heading-row");
const tBody = document.getElementById("table-body");
const currentCellHeading = document.getElementById("current-cell");
const sheetNo = document.getElementById("sheet-no");
const buttonContainer = document.getElementById("button-container");

const boldBtn = document.getElementById("bold-btn");
const italicsBtn = document.getElementById("italics-btn");
const underlineBtn = document.getElementById("underline-btn");
const leftBtn = document.getElementById("left-btn");
const centerBtn = document.getElementById("center-btn");
const rightBtn = document.getElementById("right-btn");
const cutBtn = document.getElementById("cut-btn");
const copyBtn = document.getElementById("copy-btn");
const pasteBtn = document.getElementById("paste-btn");
const uploadInput = document.getElementById("upload-input");
const addSheetBtn = document.getElementById("add-sheet-btn");
const saveSheetBtn = document.getElementById("save-sheet-btn");

const fontStyleDropdown = document.getElementById("font-style-dropdown");
const fontSizeDropdown = document.getElementById("font-size-dropdown");

const bgColorInput = document.getElementById("bgColor");
const fontColorInput = document.getElementById("fontColor");

let currentCell;
let previousCell;
let cutCell;
let lastPressBtn;
let matrix =  new Array(ROWS);
let numSheets = 1;
let currentSheet = 1;
let prevSheet;

function createNewMatrix(){
    for(let row =0; row<ROWS ; row++){
        matrix[row] = new Array(COLS);
        for(let col=0;col<COLS;col++){
            matrix[row][col]= {};
        }
    }
}

createNewMatrix();

function colGen(typeOfCell,tableRow,isInnerText,rowNumber){
    for(let col=0; col<COLS;col++){
        const cell = document.createElement(typeOfCell);
        if(isInnerText){
            cell.innerText = String.fromCharCode(col+65);
            cell.setAttribute("id",String.fromCharCode(col+65));
        } 
        else{
            cell.setAttribute("id",`${String.fromCharCode(col+65)}${rowNumber}`);
            cell.setAttribute("contenteditable", true);
            cell.addEventListener('input',updateObjectInMatrix);
            cell.addEventListener("focus", (event)=>focusHandler(event.target));
        }
        tableRow.append(cell);
    }
}

colGen("th",tHeadRow,true);

function updateObjectInMatrix(){
    let id = currentCell.id;

    let col = id[0].charCodeAt(0) - 65;
    let row = id.substring(1) - 1;
    matrix[row][col] = {
        text : currentCell.innerText,
        style : currentCell.style.cssText,
        id : id,
    };
}

function setHeaderColor(colId,rowId,color){
    const colHead = document.getElementById(colId);
    const rowHead = document.getElementById(rowId);
    colHead.style.backgroundColor = color;
    rowHead.style.backgroundColor = color;
}

function downloadMatrix(){
    const matrixString = JSON.stringify(matrix);
    const blob = new Blob([matrixString],{ type: 'appication/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table.json';
    link.click();
}

function uploadMatrix(event){
    const file = event.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event){
            const fileContent = JSON.parse(event.target.result);
            // console.log(fileContent)
            matrix = fileContent;
            renderMatrix();
        }
    }
}

uploadInput.addEventListener("input" , uploadMatrix);

// if(localStorage.getItem(arrMatrix)){

// }

function buttonHighlighter(button,styleProperty,style){
    if(currentCell.style[styleProperty]===style){
        button.style.backgroundColor = transparentBlue;
    }
    else{
        button.style.backgroundColor = transparent;
    }
}

function focusHandler(cell){
    currentCell = cell;
    if(previousCell){
        setHeaderColor(previousCell.id[0], previousCell.id.substring(1),transparent);
    }

    buttonHighlighter(boldBtn,"fontWeight","bold");
    buttonHighlighter(italicsBtn,"fontStyle","italic");
    buttonHighlighter(underlineBtn,"textDecoration","underline");


    setHeaderColor(cell.id[0], cell.id.substring(1),transparentBlue);
    currentCellHeading.innerText = cell.id+" "+"Selected";
    previousCell=currentCell;
}

function tableBodyGen(){
    tBody.innerHTML='';

    for(let row =1;row<=ROWS;row++){
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.innerText=row;
        th.setAttribute("id",row);
        tr.append(th);
        // for(let col=0;col<COLS;col++){
        //     const td = document.createElement("td");
        //     tr.append(td);
        // }
        colGen("td",tr,false,row);
        tBody.append(tr);
    }
}
tableBodyGen();

if(localStorage.getItem(arrMatrix)){
    matrix=JSON.parse(localStorage.getItem(arrMatrix))[0];
    renderMatrix();
}


boldBtn.addEventListener("click",()=>{
    if(currentCell.style.fontWeight === "bold"){
        currentCell.style.fontWeight = "normal";
        boldBtn.style.backgroundColor = transparent;
    }
    else{
        currentCell.style.fontWeight = "bold";
        boldBtn.style.backgroundColor = transparentBlue;
    }
    updateObjectInMatrix();
});

italicsBtn.addEventListener("click",()=>{
    if(currentCell.style.fontStyle === "italic"){
        currentCell.style.fontStyle = "normal";
        italicsBtn.style.backgroundColor = transparent;
    }
    else{
        currentCell.style.fontStyle = "italic";
        italicsBtn.style.backgroundColor = transparentBlue;
    }
    updateObjectInMatrix();
});

underlineBtn.addEventListener("click" ,()=>{
    if(currentCell.style.textDecoration === "underline"){
        currentCell.style.textDecoration = "none";
        underlineBtn.style.backgroundColor = transparent;
    }
    else{
        currentCell.style.textDecoration= "underline";
        underlineBtn.style.backgroundColor = transparentBlue;
    } 
    updateObjectInMatrix();
});

leftBtn.addEventListener("click", ()=>{
    currentCell.style.textAlign = "left";
    updateObjectInMatrix();
});
centerBtn.addEventListener("click", ()=>{
    currentCell.style.textAlign = "center";
    updateObjectInMatrix();
});
rightBtn.addEventListener("click", ()=>{
    currentCell.style.textAlign = 'right';
    updateObjectInMatrix();
});

fontStyleDropdown.addEventListener("change",()=>{
    currentCell.style.fontFamily = fontStyleDropdown.value;
    updateObjectInMatrix();
});

fontSizeDropdown.addEventListener("change" ,()=>{
    currentCell.style.fontSize = fontSizeDropdown.value;
    updateObjectInMatrix();
});

bgColorInput.addEventListener("input", ()=>{
    currentCell.style.backgroundColor = bgColorInput.value;
    updateObjectInMatrix();
});

fontColorInput.addEventListener("input" , ()=>{
    currentCell.style.color = fontColorInput.value;
    updateObjectInMatrix();
});

cutBtn.addEventListener("click",()=>{
    lastPressBtn="cut";
    cutCell = {
        text : currentCell.innerText,
        style : currentCell.style.cssText,
    }
    currentCell.innerText="";
    currentCell.style.cssText="";
    updateObjectInMatrix();
});

copyBtn.addEventListener("click", ()=>{
    lastPressBtn="copy";
    cutCell= {
        text : currentCell.innerText,
        style : currentCell.style.cssText
    };
});

pasteBtn.addEventListener("click" , ()=>{
    currentCell.innerText = cutCell.text;
    currentCell.style = cutCell.style;

    if(lastPressBtn==="cut"){
        cutCell = undefined;
    }
    updateObjectInMatrix();
});

function genNextSheetButton(){
    const btn = document.createElement('button');
    numSheets++;
    currentSheet=numSheets;
    btn.innerText=`Sheet ${currentSheet}`;
    btn.setAttribute("id",`sheet-${currentSheet}`);
    btn.setAttribute("onclick","viewSheet(event)");
    buttonContainer.append(btn);
}

addSheetBtn.addEventListener("click" , ()=>{
    genNextSheetButton();
    sheetNo.innerText=`sheet No - ${currentSheet}`;

    saveMatrix();
    createNewMatrix();
    tableBodyGen();

});

function saveMatrix(){
    if(localStorage.getItem(arrMatrix)){
        let tempArrMatrix = JSON.parse(localStorage.getItem(arrMatrix));
        tempArrMatrix.push(matrix);
        localStorage.setItem(arrMatrix,JSON.stringify(tempArrMatrix));
    } else{
        let tempArrMatrix = [matrix];
        localStorage.setItem(arrMatrix,JSON.stringify(tempArrMatrix));
    }
}

function renderMatrix(){
    matrix.forEach((row)=>{
        row.forEach((cellObj)=>{
            if(cellObj.id){
                let currentCell = document.getElementById(cellObj.id);
                currentCell.innerText = cellObj.text;
                currentCell.style = cellObj.style;
            }
        });
    });
}

function viewSheet(event){
    prevSheet = currentSheet;
    currentSheet = event.target.id.split("-")[1];
    let matrixArr = JSON.parse(localStorage.getItem(arrMatrix));
    matrixArr[prevSheet-1] = matrix;
    localStorage.setItem(arrMatrix,JSON.stringify(matrixArr));
    matrix = matrixArr[currentSheet-1];
    tableBodyGen();
    renderMatrix();
}