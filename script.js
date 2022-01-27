'use strict'




var colors = ["#40a8ff","#ff4c4f","#73d13d","#af6eff","#f75aab"];
var chart = document.getElementById("chart");
var time = document.getElementById("time");
var waiting = document.getElementById("waiting");
var turn = document.getElementById("turn");

class Process {
    constructor(name,arrival,burst){
        this.name = name;
        this.arrival = Number(arrival);
        this.burst = Number(burst);
        this.color = "#fff";
        this.complete = 0;
    }

    show(total,last){

        this.complete = this.burst + last;


        let p = document.createElement("div");
        p.classList.add("p");
        p.innerHTML= this.name;
        p.style.backgroundColor = this.color;
        p.style.width = (this.burst/total)*100 + "%";
        chart.appendChild(p);

        let t = document.createElement("div");
        t.classList.add("t");
        t.innerHTML = this.complete;
        t.style.width = (this.burst/total)*100 + "%";

        time.appendChild(t);


        //Turn Around Time
        let tu = document.createElement("div");
        this.turn = this.complete-this.arrival;
        tu.innerHTML+= `${this.name} =  ${this.complete} - ${this.arrival} = ${this.turn}`;
        turn.appendChild(tu);


        //Waiting time
        //console.log(waiting);
        let w = document.createElement("div");
        this.waiting = this.turn-this.burst;
        w.innerHTML+= `${this.name} =  ${this.turn} - ${this.burst} = ${this.waiting}`;

        waiting.appendChild(w);




        return this.complete;
    }
}

var inputs = document.querySelectorAll("table tr td input");
var table = document.querySelector("table tbody");
for(let i=0;i<inputs.length;i++){
    inputs[i].classList.add("input" + i);
    inputs[i].addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          let nextClass = Number(inputs[i].classList[0].substr(5)) + 1;
            if(nextClass==3)
                nextClass+=1;
            

          let nextElem = document.querySelector(".input"+nextClass);
          if(nextElem)
            nextElem.focus();
          
        }
        checkInputs(inputs[i]);
      });
}




function checkInputs(focused){
    
    //Delete any blank table
    let IsBlank = false;
    let DelTrNo = 0;
    for(let i = 0;i<inputs.length-3;i+=3){

        let conditionForBlank = inputs[i].value.length ==0 && inputs[i+1].value.length == 0 && inputs[i+2].value.length == 0;
        // if(inputs[0].value.length == 0 )
        if(conditionForBlank){
            IsBlank = true;
            DelTrNo = i/3;
            break;
        }
        
    }
    if(IsBlank){
        document.querySelectorAll("tr")[DelTrNo+1].remove();
        inputs = document.querySelectorAll("table tr td input");
        inputs[inputs.length-3].focus();
        // inputs = document.querySelectorAll("table tr td input");
    }

    //Check if the table is full or not
    let isFull = true;
    // let newTrNo = 0;
    for(let i = 0;i<inputs.length;i++){
        if(inputs[i].value.length==0){
            isFull = false;
            break;
        }
    }
    if(isFull){
        createTableRow();
        inputs = document.querySelectorAll("table tr td input");
    }

    //Focus to previous if the field is empty
    if(focused.value.length==0){
        let prevClass = Number(focused.classList[0].substr(5)) - 1;
        let prevElem = document.querySelector(".input"+prevClass);
        if(prevElem)
            prevElem.focus();

    }
    

    showInGraphic();
}



function createTableRow(){

    var tr = document.createElement("tr");

    var input1 = document.createElement("input");
    var input2 = document.createElement("input");
    var input3 = document.createElement("input");
    input1.type = "text";
    input2.type = "number";
    input3.type = "number";
    input1.value = "P" + (Math.round(inputs.length/3)+1);

    input1.classList.add("input" + (inputs.length));
    input2.classList.add("input" + (inputs.length + 1));
    input3.classList.add("input" + (inputs.length + 2));

    input1.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          let nextClass = Number(input1.classList[0].substr(5)) + 1;
          let nextElem = document.querySelector(".input"+nextClass);
          
          if(nextElem)
            nextElem.focus();
          
        }
        checkInputs(input1);
      });
    input2.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          let nextClass = Number(input2.classList[0].substr(5)) + 1;

          let nextElem = document.querySelector(".input"+nextClass);
          if(nextElem)
            nextElem.focus();
          
        }
        checkInputs(input2);
      });
    input3.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          let nextClass = Number(input3.classList[0].substr(5)) + 2;
          let nextElem = document.querySelector(".input"+nextClass);
          if(nextElem)
            nextElem.focus();
          
        }
        checkInputs(input3);
      });

    
    var td1 = document.createElement("td")  
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    
    td1.appendChild(input1);
    td2.appendChild(input2);
    td3.appendChild(input3);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    table.appendChild(tr);    
}








var notice = document.getElementById("notice");
function showInGraphic(){
    let inputElemNo = inputs.length;
    let isNegativeBurstTime = false;
    let errRowNo = 0;

    for(let i=0;i<inputElemNo;i+=3){
        if(inputs[i+1].value<0){
            isNegativeBurstTime = true;
            errRowNo = i;
            break;
        }
    }

    if(isNegativeBurstTime){
        notice.innerHTML = "Burst Time Cannot be Negative in the row no " + errRowNo/3 + 1;
        notice.style.display = "block";
    }else{
        notice.style.display = "none";
    }

    let isBlank = false;
    //Check if blank
    for(let i=0;i<inputElemNo-3;i++){
        if(inputs[i].value.length == 0){
            isBlank = true;
            break;
        }
    }
    

    let inputOk = !isNegativeBurstTime && !isBlank;
    let process = [];
    let burstTime = [];
    let arrivalTime = [];
    if(inputOk){
        for(let i=0;i<inputElemNo-3;i+=3){
            process.push(inputs[i].value)
            burstTime.push(inputs[i+1].value)
            arrivalTime.push(inputs[i+2].value);
        }
        time.innerHTML = `<div class="zero">0</div>`;
        document.getElementsByClassName("answer")[0].style.display = "block";
    }else{
        time.innerHTML = ``;
        document.getElementsByClassName("answer")[0].style.display = "none";
    }

    //Show in the graphic
    //Make The chart Blank
    chart.innerHTML = "";

    waiting.innerHTML = "";
    turn.innerHTML = "";

    let totalTime = 0;
    var lastTime = 0;

    for(let i in burstTime){
        totalTime+=Number(burstTime[i]);
    }

    //Array of processes
    var P = [];
    for(let i=0;i<process.length;i++){
        P.push(new Process(process[i],arrivalTime[i],burstTime[i]));
    }


    //Sort P in the base of arrival time 
    for(let i=0;i<P.length;i++){
        for(let j=i+1;j<P.length;j++){
            if(P[i].arrival>P[j].arrival){
                let tmp = P[i];
                P[i] = P[j];
                P[j] = tmp;
            }
        }
    }

    //Show Processes


    for(let i=0;i<P.length;i++){
        P[i].color = colors[i%colors.length];
        lastTime = P[i].show(totalTime,lastTime);
    }
    
    let avgWtTime = 0,avgTuTime =0;
    for(let i=0;i<P.length;i++){
        avgTuTime+= P[i].turn;
        avgWtTime+= P[i].waiting;
    }
    avgWtTime/=P.length;
    avgTuTime/=P.length;

    document.getElementById("avgWt").innerHTML = "Average Waiting Time = " + avgWtTime.toFixed(3);
    document.getElementById("tut").innerHTML = "Average Turn Around Time = " + avgTuTime.toFixed(3);
}


