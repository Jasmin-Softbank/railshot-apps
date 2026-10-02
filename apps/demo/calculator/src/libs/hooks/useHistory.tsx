import React from "react";
import type { HistoryData } from "@/libs/types/main";

const useHistory = () => {
  const [history, setHistory] = React.useState<HistoryData[]>([]);
  const [isHistoryOn, setIsHistoryOn] = React.useState(false);

  const resetHistory = () => {
    localStorage.setItem("calhistory", JSON.stringify([]));
    setHistory([]);
  };

  const toggleHistoryOn = () => {
    setIsHistoryOn((prev) => !prev);
  };

  React.useEffect(() => {
    const calHistory = localStorage.getItem("calhistory") || "[]";
    setHistory(JSON.parse(calHistory));
  }, [isHistoryOn]);

  return { history, resetHistory, isHistoryOn, toggleHistoryOn };
};

export default useHistory;
