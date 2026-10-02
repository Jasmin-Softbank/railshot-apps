import useTheme from "@/libs/hooks/useTheme";
import useHistory from "./libs/hooks/useHistory";
import Calculator from "@/components/Calculator";
import History from "@/components/History";
import "./App.css";

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const { history, resetHistory, isHistoryOn, toggleHistoryOn } = useHistory();

  return (
    <div className="wrap">
      <div className="app">
        <header className="header">
          <div className="header__logo">🤔 calculator</div>
          <div className="header__tool">
            <button className="header__history" onClick={toggleHistoryOn}>
              📜
            </button>
            <button className="header__theme" onClick={toggleTheme}>
              {theme === "dark" ? "🌜" : "🌞"}
            </button>
          </div>
        </header>
        {isHistoryOn ? (
          <History history={history} resetHistory={resetHistory} />
        ) : (
          <Calculator />
        )}
      </div>
    </div>
  );
};

export default App;
