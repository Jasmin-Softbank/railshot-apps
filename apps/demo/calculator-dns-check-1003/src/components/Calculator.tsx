import React from "react";
import { NUMPAD } from "@/libs/constants/numpad";
import useCalculator from "@/libs/hooks/useCalculator";
import "./Calculator.css";

function Calculator() {
  const { expression, result, operateCalc } = useCalculator();
  const exDisplay = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const display = exDisplay.current;
    const parent = display?.parentElement;
    if (!display || !parent) return;

    const pWidth = parent.offsetWidth;
    const cWidth = display.offsetWidth;
    const cFontSize = Number.parseFloat(
      window.getComputedStyle(display).fontSize
    );

    if (cWidth >= pWidth * 0.85 && cFontSize > 14) {
      display.style.fontSize = `${cFontSize - 5}px`;
    }

    if (cWidth < pWidth * 0.5 && cFontSize < 24) {
      display.style.fontSize = `${cFontSize + 5}px`;
    }
  }, [expression]);

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
