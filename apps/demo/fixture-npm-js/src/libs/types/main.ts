export type PadKey = {
  command: string;
  type: string;
};

export type CalcData = {
  result: string;
  type: string;
  command: null | string;
};

export type HistoryData = { expression: string; result: string };
