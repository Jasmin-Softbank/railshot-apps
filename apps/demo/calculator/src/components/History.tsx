import type { HistoryData } from "@/libs/types/main";
import "./History.css";

type Props = {
  history: HistoryData[];
  resetHistory: () => void;
};

const History = (props: Props) => {
  return (
    <div className="history">
      <div className="history__header">
        <h3 className="history__headline">히스토리</h3>
        <button className="history__reset" onClick={props.resetHistory}>
          초기화
        </button>
      </div>
      <div className="history__content">
        {history.length === 0 ? (
          <div className="history__nocontent">
            <span>기록이 없습니다</span>
          </div>
        ) : (
          props.history.map((el: HistoryData, idx: number) => (
            <div className="history__item" key={idx}>
              <span className="history__expression">{el.expression}</span>
              <span className="history__result">{el.result}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
