import React from "react";
import { NUMPAD } from "@/libs/constants/numpad";
import useCalculator from "@/libs/hooks/useCalculator";
import "./Calculator.css";

function Calculator() {
  const { expression, result, operateCalc } = useCalculator();
  const exDisplay = React.useRef() as React.MutableRefObject<HTMLElement>;

  const changeFontSize = () => {
    const pNode = exDisplay.current.parentNode as HTMLElement;
    const pWidth = pNode.offsetWidth;
    const cWidth = exDisplay.current.offsetWidth;
    const cFontSize = +window
      .getComputedStyle(exDisplay.current)
      .fontSize.slice(0, -2);

    if (cWidth >= pWidth * 0.85 && cFontSize > 14) {
      exDisplay.current.style.fontSize = `${cFontSize - 5}px`;
    }

    if (cWidth < pWidth * 0.5 && cFontSize < 24) {
      exDisplay.current.style.fontSize = `${cFontSize + 5}px`;
    }
  };

  React.useEffect(() => {
    changeFontSize();
  }, [exDisplay.current?.offsetWidth]);

  return (
    <main className="calc">
      <section className="calc__result">
        <span>{result}</span>
      </section>
      <section className="calc__display">
        <span ref={exDisplay}>{expression}</span>
      </section>
      <section className="calc__pad">
        {NUMPAD.map((el) => (
          <div
            className="calc__paditem"
            key={el.command}
            onClick={() => {
              operateCalc(el);
            }}
          >
            {el.command}
          </div>
        ))}
      </section>
    </main>
  );
}

export default Calculator;
