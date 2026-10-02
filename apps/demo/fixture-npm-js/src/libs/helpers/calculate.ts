export const calculate = (calStack: string[]) => {
  const postfix = convertToPostfix(calStack);
  const tempStack: number[] = [];

  postfix.forEach((el) => {
    if (Number(el) || Number(el) === 0) {
      tempStack.push(Number(el));
    } else {
      const operator = el;
      const num2 = tempStack.pop() as number;
      const num1 = tempStack.pop() || num2;

      tempStack.push(operate(num1, num2, operator));
    }
  });

  const result = tempStack.reduce((acc, cur) => operate(acc, cur, "*"));

  return String(result).length > 12
    ? String(result.toExponential(8))
    : String(result);
};

const operate = (num1: number, num2: number, operator: string) => {
  if (operator === "+") return num1 + num2;
  if (operator === "-") return num1 - num2;
  if (operator === "*") return num1 * num2;
  if (operator === "/") return num1 / num2;

  throw new Error("calculation error");
};

const convertToPostfix = (calStack: string[]) => {
  const operatorBracketStack: string[] = [];
  const postfixStack: string[] = [];

  calStack.forEach((el) => {
    if (Number(el) || Number(el) === 0) {
      postfixStack.push(el);
    } else {
      if (el === "(") operatorBracketStack.push("(");
      if (el === "*" || el === "/") {
        while (
          operatorBracketStack[operatorBracketStack.length - 1] === "*" ||
          operatorBracketStack[operatorBracketStack.length - 1] === "/"
        ) {
          postfixStack.push(operatorBracketStack.pop() as string);
        }
        operatorBracketStack.push(el);
      }
      if (el === "+" || el === "-") {
        while (
          operatorBracketStack[operatorBracketStack.length - 1] === "*" ||
          operatorBracketStack[operatorBracketStack.length - 1] === "/" ||
          operatorBracketStack[operatorBracketStack.length - 1] === "+" ||
          operatorBracketStack[operatorBracketStack.length - 1] === "-"
        ) {
          postfixStack.push(operatorBracketStack.pop() as string);
        }
        operatorBracketStack.push(el);
      }
      if (el === ")") {
        while (operatorBracketStack[operatorBracketStack.length - 1] !== "(") {
          postfixStack.push(operatorBracketStack.pop() as string);
        }
        operatorBracketStack.pop();
      }
    }
  });

  while (operatorBracketStack.length !== 0) {
    postfixStack.push(operatorBracketStack.pop() as string);
  }

  return postfixStack;
};
