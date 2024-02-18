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

function parseExpressionWithRegExp(expression) {
  //For π (PI), expressions like: 3π, 2π etc...
  expression = expression.replace(/([0-9]+)[π]/g, "$1*3.14")
  //For expressions like: 5 (3 + 2), where there are no operators in front of the number that is outside the parentheses, in the example above it is 5. 
  expression = expression.replace(/([0-9]+)[(]/g, "$1*(")
  //Multiplication of roots (square roots)
  expression = expression.replace(/([0-9]+)[√]/g, "$1*√")
  // This converts square roots into a supported format in JavaScript
  expression = expression.replace(/√([0-9]+)[,.]([0-9]+)/g, "Math.sqrt($1.$2)").replace(/√([0-9]+)/g, "Math.sqrt($1)")
  // Factorial
  expression = expression.replace(/([0-9]+)!/g, "factorial($1)")

  return expression.toString();
}

function factorial(n) {
  for (let i = n - 1; i >= 1; i--) n *= i
  return n
}

function transcribeExpression(expression) {
  const converts = {
    "÷": "/",
    ":": "/",
    "x": "*",
    "^": "**",
    "%": "/100*",
    "π": "3.14",
    ",": "."
  }

  Object.keys(converts).forEach((value) => {
    expression = expression.replaceAll(value, converts[value])
  })
  expression = parseExpressionWithRegExp(expression)

  return expression.toString()
}

function calculate(expression) {
  var result;
  var copyOfGlobalExpression = globalExpression
  try {
    result = Number(eval(transcribeExpression(expression)))
    globalExpression = result.toString();
    updateDisplay();
  } catch (e) {
    globalExpression = "";
    updateDisplay()
    display.style.color = "red"
    updateDisplayPlaceholder("Error")
    console.log(`
      Error: ${e.message}
      Expression: ${copyOfGlobalExpression}
      ConvertedExpression: ${transcribeExpression(copyOfGlobalExpression)}
    `)
  }
}

function updateDisplay(content) {
  display.style.color = "black"
  content !== undefined ? display.value = content : display.value = globalExpression
}

function updateDisplayPlaceholder(placeholder) {
  placeholder !== undefined ? display.value = placeholder : display.value = ""
}

var parentheses = ["(", ")"]
var indexOfParentheses = 0

function applyParentheses() {
  globalExpression += parentheses[indexOfParentheses]
  updateDisplay()
  if (indexOfParentheses >= 1) indexOfParentheses = 0
  else indexOfParentheses++
}

const buttons = document.querySelectorAll("button.buttons")
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.innerHTML
    //For numbers, operators and symbols 
    if (input !== "=" && input !== "AC" && input !== "C" && input !== "( )") {
      globalExpression += input
      updateDisplay()
    } else {
      //For especial keys
      switch (input) {
        case "AC":
          globalExpression = "";
          updateDisplay()
          indexOfParentheses = 0;
          break;
        case "C":
          globalExpression = globalExpression.slice(0, globalExpression.length - 1)
          updateDisplay()
          break;
        case "( )":
          applyParentheses();
          break;
        default:
          calculate(globalExpression)
          break;
      }
    }
  })
})