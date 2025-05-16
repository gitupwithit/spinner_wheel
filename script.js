
document.addEventListener('DOMContentLoaded', function() {
  const spinSound = document.getElementById('spin-sound');
  const successSound = document.getElementById('success-sound');
  const numberSubmitButton = document.getElementById('number-choice-button');
  
  numberSubmitButton.addEventListener('click', () => {
    console.log("click") 
    const numberSelected = document.querySelector('#number-choice-box').value.trim();
    // console.log("number chosen:", numberSelected)
    populateNumbers(numberSelected)
    populateCSS(numberSelected)
  })
  
  let accumulatedRotation = 0; // Initialize accumulated rotation

  function spin() {
    const numberSelected = document.querySelector('#number-choice-box').value.trim();
    var rotateAmt = 360 / numberSelected;
    spinSound.play(); 
    let additionalRotation = anime.random(5000, 7000); 
    accumulatedRotation += additionalRotation; 
    let duration = 4000 + Math.floor(Math.random() * 1000);
    anime({
      targets: '#dewey',
      rotate: accumulatedRotation,
      duration: duration,
      loop: false,
      easing: 'cubicBezier(.5, 0, 0, 1)',
      begin: function() {
        spinSound.play(); 
        resetNumberColors(); 
      },
      update: function(anim) {
        // Changes number colors dynamically
        let currentRotationValue = String(anim.animations[0].currentValue);
        let numericValue = currentRotationValue.replace(/[^0-9.]/g, ''); 
        let currentAngle = parseFloat(numericValue);
        // console.log("currentAngle:", currentAngle)
        currentAngle = currentAngle % 360
        highlightCurrentNumber(currentAngle,numberSelected);
      },
      complete: function(anim) {
        spinSound.pause();
        spinSound.currentTime = 0;
        successSound.play();
        let finalNumber = getHighlightedNumber(); // Get the number highlighted
        console.log("finalNumber:",finalNumber)
        showModal(finalNumber, chosenNumber); // Show result modal with the final number
      }
    });
  }

function resetNumberColors() {
  const numbers = document.querySelectorAll('.number');
  numbers.forEach(number => {
    number.style.backgroundColor = 'transparent';
  });
}
  
function getHighlightedNumber() {
  const numbers = document.querySelectorAll('.number');
  for (let number of numbers) {
    // Get computed style of the element
    const style = window.getComputedStyle(number);
    // Normalize color value and compare
    if (style.backgroundColor.toLowerCase() === "deeppink" || style.backgroundColor === "rgb(255, 20, 147)") {
      // console.log("final number:", number.textContent)
      return number.textContent;
    }
  }
  return null;
}

function highlightCurrentNumber(currentAngle, chosenNumber) {
  const divisor = 360 / chosenNumber;
  const index = Math.floor(((currentAngle)) / divisor) + 1;
  // console.log("currentAngle:",currentAngle,"index:",index);
  resetNumberColors();
  const numbers = document.querySelectorAll('.number');
  // console.log("numbers:", numbers)
  if (numbers[index -1]) {
    numbers[index -1].style.backgroundColor = 'DeepPink';
    numbers[index -1].style.borderRadius = '10px';
    numbers[index -1].style.padding = '2px';
  }
}

function showModal(finalNumber, chosenNumber) {
  // determine number from highlighted number 
  if (finalNumber == null) {
    finalNumber = " .. nothing! Please pick a number"
  }
  if (finalNumber == 1) {
    finalNumber = " .. 1! Because of course I did!"
  } 
  if (finalNumber == 2) {
    finalNumber = " .. finalNumber! Just flip a coin next time!"
  } 
  if (finalNumber == 2) {
    finalNumber = " .. finalNumber! Just flip a coin next time!"
  } 
  document.getElementById('result-text').innerText = "I got " + finalNumber + "!";
  const modal = document.getElementById('result-modal');
  modal.style.display = "block";
  // modal.style.opacity = 0;
  // modal.style.transform = 'scale(0.5)';
  anime({
    targets: '.modal-content',
    scale: [0, 1],
    opacity: [0, 1],
    elasticity: 600,
    duration: 800,
    translateY: [0, 0]
  });
}

document.getElementById('dewey').addEventListener('click', spin);

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('result-modal').style.display = "none";
  });
});

function populateNumbers(numberSelected) {
  const numbersCircle = document.getElementById('numbers-circle');
  // Remove existing numbers
  numbersCircle.querySelectorAll('.number').forEach(el => el.remove());

  // Add new numbers
  for (let i = 1; i <= numberSelected; i++) {
    const numberDiv = document.createElement('div');
    numberDiv.className = 'number';
    numberDiv.textContent = i;
    numbersCircle.appendChild(numberDiv);
  }
}


function populateCSS(numberSelected) {
  var existingStyle = document.querySelector('#dynamic-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  var style = document.createElement('style');
  style.id = 'dynamic-styles';  // Assign an ID for easy reference and removal
  document.head.appendChild(style);
  let rotateAmt = 360 / numberSelected;  // rotation amount for each number
  console.log("rotateAmt", rotateAmt)
  
  // console.log("numberSelected:",numberSelected)

  for (let i = 1; i <= numberSelected; i++) {
    // console.log("index:", i)
    let initialRotate = (((i -1) * rotateAmt)); 
    // Adjust the rotation
    initialRotate += 270;
    
    var rule = `.number:nth-child(${i}) {
      font-family: "Audiowide", sans-serif;
      transform: rotate(${initialRotate}deg) translate(40vh) rotate(-${initialRotate}deg);
      position: absolute;
      transform-origin: 50% 50%;
      z-index: 6;
      opacity: 1;
      color: black;
      border: 10px;
      font-size: 10vh;
    }`;
  
    console.log("index:", i, "rule", rule)

    style.sheet.insertRule(rule, style.sheet.cssRules.length);
    
  }
}
