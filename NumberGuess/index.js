window.onload = initialize;

let target = 0;
let counter = 10;
let maxLimit = 100;
let minLimit = 0;

function initialize(){
  getNewNumber();
  const keys = document.querySelectorAll(".key")
  const inputBox = document.querySelector("#inputBox");

  keys.forEach(function(key){
    key.addEventListener('click', e => {
      if(key.dataset.key === "*"){
        inputBox.value = '';
        return;
      }else if(key.dataset.key === "#"){
        submit(inputBox.value);
        inputBox.value = '';
        return;
      }
      if(inputBox.value.length >= 9){
        return;
      }
      if(inputBox.value==="0" && key.dataset.key==="0"){
        return;
      }
      inputBox.value += key.dataset.key;
    });
  });

  const levelButtons = document.querySelectorAll('.level-button');
  levelButtons.forEach(levelButton => {
    levelButton.addEventListener('click', function(e){
      levelButtons.forEach(button => button.classList.remove('level-button-selected'));
      this.classList.add('level-button-selected');
      minLimit = Number(this.dataset.min);
      maxLimit = Number(this.dataset.max);
      reset();
    });
  });

}

function submit(value){
  if(value==='') return;
  counter--;
  if(Number(value) === target){
    success();
  }else{
    failure(value);
  }
  if(counter<=0){
    endGame();
  }
}

function failure(val){
  if(target < val){
    const lesserGroup = document.querySelector('.lesser-guessed');
    lesserGroup.innerHTML += `<li class="guessed">${val}</li>`;
  }else{
    const greaterGroup = document.querySelector('.greater-guessed');
    greaterGroup.innerHTML += `<li class="guessed">${val}</li>`;
  }
}

function getNewNumber(){
  target = Math.floor((Math.random() * (maxLimit-minLimit)) + minLimit);
}

function endGame(){
  alert(`You finished your moves. The correct answer is ${target}`);
  reset();
}

function success(){
  alert(`You guessed right. Right answer is ${target}. You took ${10-counter} turns.`);
  reset();
}

function reset(){
  counter = 10;
  document.querySelector('.lesser-guessed').innerHTML = "";
  document.querySelector('.greater-guessed').innerHTML = "";
  getNewNumber();
  console.log(target);
}