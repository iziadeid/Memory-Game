// General var
let gameHolder = document.querySelector(".game-holder");
let duration = 1000;
let blocks = 8;
let i = 1;
let level = document.querySelector(".details #level");
let bLevel = document.querySelector(".details #b-level");
if (window.localStorage.level) {
  bLevel.innerHTML = `Best Level :${window.localStorage.level}`;
} else {
  window.localStorage.level = i;
  bLevel.innerHTML = `Best Level :${window.localStorage.level}`;
}
let turn = document.querySelector("#turn");
let turns = 10;
let turnsCount = 0;

//aduio
let aduio = document.querySelector(".aduio");
let aduioCheck = document.querySelector(".aduio input");
let icon = document.querySelector(".aduio i");
aduio.onclick = () => {
  aduioCheck.checked
    ? (icon.className = "fa-solid fa-volume-xmark")
    : (icon.className = "fa-solid fa-volume-high");
};
let won = new Audio("audio/won.wav");
let bigWon = new Audio("audio/mixkit-video-game-win-2016.wav");
let lose = new Audio("audio/losing.wav");
let bigLose = new Audio("audio/mixkit-negative-answer-lose-2032.wav");

//Game btns
let againBtn = document.querySelectorAll(".again");
let startBtn = document.querySelector(".start");
startBtn.onclick = () => {
  Array.from(gameHolder.children).forEach((ele) => {
    ele.classList.add("flipped");
    setTimeout(() => ele.classList.remove("flipped"), duration);
  });
  startBtn.parentElement.remove();
};

//Create array range
let finalArray = Array.from(Array(blocks).keys()).concat(
  Array.from(Array(blocks).keys())
);
//add Blocks to game Holder
shuffle(finalArray);
finalArray.forEach((ele) => createBlock(ele));

//shuffle function
function shuffle(arr) {
  let current = arr.length,
    random;

  while (current > 0) {
    //get random Number
    random = Math.floor(Math.random() * current);
    current--;
    //shuffle array
    [arr[random], arr[current]] = [arr[current], arr[random]];
  }
  return arr;
}

// Create img Blocks function
function createBlock(src) {
  //main Divs
  let imgBlock = document.createElement("div");
  imgBlock.className = "img-block";

  let front = imgBlock.cloneNode(true);
  front.className = "front face";
  let back = imgBlock.cloneNode(true);
  back.className = "back face";
  //the image
  let img = document.createElement("img");
  img.className = "front-img";
  img.src = `image/img (${src}).png`;
  //append all items to game holder
  front.appendChild(img);
  imgBlock.appendChild(front);
  imgBlock.appendChild(back);
  gameHolder.appendChild(imgBlock);

  imgBlock.onclick = () => flipImage(imgBlock);

  turn.innerHTML = `tryings: ${turnsCount}/${turns}`;
}
// flipped image function
function flipImage(image) {
  //add flipped class
  image.classList.add("flipped");

  let Blocks = Array.from(document.querySelectorAll(".img-block"));

  //colect flipped image
  let flippedImages = Blocks.filter((flipImg) =>
    flipImg.classList.contains("flipped")
  );

  if (flippedImages.length === 2) {
    //Stop Clicking
    stopClicking();
    //check match image
    matchImage(flippedImages[0], flippedImages[1]);
  }

  //colect match image
  let matchImages = Blocks.filter((matchImg) =>
    matchImg.classList.contains("match")
  );

  //When WON
  if (matchImages.length == Blocks.length) {
    //won message
    setTimeout(() => {
      let wonContainer = document.querySelector(".won");
      wonContainer.style.display = "flex";

      if (!aduioCheck.checked) {
        bigWon.play();
      }

      level.innerHTML = `Level :${++i}`;
      turns != 1 ? turns-- : turns;

      if (i > window.localStorage.level) {
        window.localStorage.level = i;
        console.log(i);
        console.log(window.localStorage.level);
        bLevel.innerHTML = `Best Level :${window.localStorage.level}`;
      }
    }, duration / 2);
  }
}

//Stop clicking function
function stopClicking() {
  //stop clicking
  gameHolder.classList.add("no-clicking");
  //return clicking again
  setTimeout(() => gameHolder.classList.remove("no-clicking"), duration);
}
//check match image
function matchImage(fristEle, secondEle) {
  if (
    fristEle.children[0].children[0].src ==
    secondEle.children[0].children[0].src
  ) {
    fristEle.classList.remove("flipped");
    secondEle.classList.remove("flipped");

    //add match class
    fristEle.classList.add("match");
    secondEle.classList.add("match");

    function wonFun() {
      if (!aduioCheck.checked) {
        won.play();
      }
      won = new Audio("audio/won.wav");
    }
    wonFun();
  } else {
    setTimeout(() => {
      fristEle.classList.remove("flipped");
      secondEle.classList.remove("flipped");
    }, duration);

    function loseFun() {
      if (!aduioCheck.checked) {
        lose.play();
      }
      lose = new Audio("audio/losing.wav");
    }
    loseFun();
    if (turnsCount === turns - 1) {
      i = 1;
      turn.innerHTML = `Turns: ${++turnsCount}/${turns}`;

      //lose message
      setTimeout(() => {
        let wonContainer = document.querySelector(".lose");
        wonContainer.style.display = "flex";

        if (!aduioCheck.checked) {
          bigLose.play();
        }

        turnsCount = 0;
        turns = 10;
        turn.innerHTML = `Turns: ${turnsCount}/${turns}`;
        level.innerHTML = `Level :${i}`;
      }, duration / 2);
    } else {
      turn.innerHTML = `tryings: ${++turnsCount}/${turns}`;
    }
  }
}
//again btn
againBtn.forEach((ele) => {
  ele.onclick = () => {
    let Blocks = Array.from(document.querySelectorAll(".img-block"));
    //delete current game
    Blocks.forEach((ele) => ele.remove());

    //add Blocks to game Holder
    shuffle(finalArray);
    finalArray.forEach((ele) => createBlock(ele));

    ele.parentElement.style.display = "none";
    Blocks = Array.from(document.querySelectorAll(".img-block"));
    setTimeout(() => {
      Blocks.forEach((ele) => ele.classList.add("flipped"));
    }, duration / 2);

    setTimeout(() => {
      Blocks.forEach((ele) => ele.classList.remove("flipped"));
    }, (duration * 3) / 2);
  };
});
