import assert from "node:assert/strict";
import test from "node:test";
import { calculate } from "../src/libs/helpers/calculate.ts";

test("calculates addition, subtraction, multiplication and division", () => {
  assert.equal(calculate(["2", "+", "3"]), "5");
  assert.equal(calculate(["9", "-", "4"]), "5");
  assert.equal(calculate(["6", "*", "7"]), "42");
  assert.equal(calculate(["8", "/", "2"]), "4");
});

test("preserves zero left operands", () => {
  assert.equal(calculate(["0", "+", "7"]), "7");
  assert.equal(calculate(["0", "-", "7"]), "-7");
  assert.equal(calculate(["0", "*", "7"]), "0");
  assert.equal(calculate(["0", "/", "7"]), "0");
});

test("preserves zero right operands and intermediate results", () => {
  assert.equal(calculate(["7", "+", "0"]), "7");
  assert.equal(calculate(["7", "*", "0"]), "0");
  assert.equal(calculate(["3", "-", "3", "+", "2"]), "2");
  assert.equal(calculate(["(", "3", "-", "3", ")", "*", "7"]), "0");
});

test("applies operator precedence and parentheses", () => {
  assert.equal(calculate(["2", "+", "3", "*", "4"]), "14");
  assert.equal(calculate(["(", "2", "+", "3", ")", "*", "4"]), "20");
});

test("evaluates equal-precedence operators from left to right", () => {
  assert.equal(calculate(["10", "-", "3", "-", "2"]), "5");
  assert.equal(calculate(["8", "/", "2", "*", "3"]), "12");
});

test("calculates negative and decimal operands", () => {
  assert.equal(calculate(["-3", "*", "2"]), "-6");
  assert.equal(calculate(["1.5", "+", "2.25"]), "3.75");
});

test("formats results exceeding the display length in exponential notation", () => {
  assert.equal(calculate(["1000000", "*", "1000000"]), "1.00000000e+12");
});
