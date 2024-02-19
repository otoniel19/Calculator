/* Supported operations: 
     Addition: (+) 
     Subtraction: (-)
     Multiplication: (x)
     Division: (÷)
     
     Power: (^)
     Percentage: (%)
     Radiciation: (√)
     Factorial: (!)
*/
var globalExpression = "";
var display = document.getElementById("display")

function factorial(n) {
  for (let i = n - 1; i >= 1; i--) n *= i
  return n
}

function convertsExpression(expression) {
  const operatorsAndSymbolsConversions = {
    "÷": "/",
    ":": "/",
    "x": "*",
    "^": "**",
    "%": "/100*",
    ",": "."
  }
  expression = expression.replace(/[x÷:%^,]/g, (match) => operatorsAndSymbolsConversions[match])
  //Advanced Conversion
  //PI (π)
  expression = expression.replace(/([0-9])π/g, `$1*3.14`).replace(/π/g, Math.PI)
  //Square Root
  expression = expression.replace(/([0-9]+)√/g, "$1*").replace(/√([0-9]+)[.]([0-9]+)/g, "Math.sqrt($1.$2)").replace(/√([0-9]+)!/g, "Math.sqrt($1!)").replace(/√([0-9]+)/g, "Math.sqrt($1)")
  //Multiplication without operator, like 5(5+5) = 50
  expression = expression.replace(/([0-9]+)[(]/g, "$1*(")
  //Factorial
  expression = expression.replace(/([0-9]+)!/g, "factorial($1)")

  return expression
}

function updateDisplay(content) {
  content !== undefined ? display.value = content : display.value = globalExpression
}

function calculate(expression) {
  expression = convertsExpression(expression)
  var result;
  try {
    result = eval(expression)
    if (result !== Infinity)
      globalExpression = result.toString()
    else { 
      globalExpression = globalExpression
      throw new Error(`Result is Infinity`)
    }
    updateDisplay();
  } catch (e) {
    let errorMessage = `
      Error: ${e.message}
      Expression: ${globalExpression}
      ExpressionConverted: ${expression}
    `
    result = "";
    console.log(errorMessage)
  }
}

//This loop serves to turn the display red if the current mathematical expression is invalid, showing the user that they wrote their expression wrongly.
const LeaveDisplayRedIfThereIsExpressionError = () => {
  try { eval(convertsExpression(globalExpression));
    display.style.color = "black"; } catch (e) {
    display.style.color = "red"
  }
}

var parentheses = ["(", ")"]
var indexOfParentheses = 0

function applyParentheses() {
  globalExpression += parentheses[indexOfParentheses]
  indexOfParentheses++
  if (indexOfParentheses === 2) indexOfParentheses = 0;
}

document.querySelectorAll("button.buttons").forEach((button) => {
  button.addEventListener("click", () => {
    updateDisplay()
  })
})