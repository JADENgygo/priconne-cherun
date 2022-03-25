import ReactTestUtils from "react-dom/test-utils";
import { render, screen, act } from "@testing-library/react";
import Home from "../pages/index";

jest.useFakeTimers();

beforeAll(() => {
  jest.spyOn(global, "setTimeout");
});

test("初期状態", () => {
  render(<Home />);
  const run = document.querySelector("[data-jest='run']") as Element;
  ReactTestUtils.Simulate.click(run);
  const step = document.querySelector("[data-jest='step']") as Element;
  ReactTestUtils.Simulate.click(step);
  const resume = document.querySelector("[data-jest='resume']") as Element;
  ReactTestUtils.Simulate.click(resume);
  const stop = document.querySelector("[data-jest='stop']") as Element;
  ReactTestUtils.Simulate.click(stop);

  expect(document.querySelector("[data-jest='cheru']")?.textContent).toBe("");
  expect(document.querySelector("[data-jest='brainf']")?.textContent).toBe("");
  expect(
    document.querySelector("[data-jest='position']")?.textContent?.trim(),
  ).toBe("");
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe("000"),
  );
  expect(
    document.querySelector("[data-jest='result']")?.textContent?.trim(),
  ).toBe("");
  expect(
    document.querySelector("[data-jest='encodedResult']")?.textContent?.trim(),
  ).toBe("");
  expect(
    document.querySelector("[data-jest='error']")?.textContent?.trim(),
  ).toBe("");
});

test("基本命令", () => {
  render(<Home />);
  const cheru = document.querySelector(
    "[data-jest='cheru']",
  ) as HTMLTextAreaElement;
  const source =
    "ちぇるちぇるちぇるちぇるちぇっちぇぽちぇるちぇるちぇるちぇるちぇぱちぇらちぇちぇぽちぇっちぇぽちぇるちぇるちぇぱちぇらちぇちぇぽちぇるちぇるーん";
  cheru.value = source;
  ReactTestUtils.Simulate.change(cheru);
  act(() => {
    const run = document.querySelector("[data-jest='run']") as Element;
    ReactTestUtils.Simulate.click(run);
    jest.runAllTimers();
  });

  expect(document.querySelector("[data-jest='cheru']")?.textContent).toBe(
    source,
  );
  const brainf = "++++[>++++<-]>[>++<-]>+.";
  expect(document.querySelector("[data-jest='brainf']")?.textContent).toBe(
    brainf,
  );
  expect(
    document.querySelector("[data-jest='position']")?.textContent?.trim(),
  ).toBe(brainf);
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 2 ? "033" : "000"),
  );
  expect(
    document.querySelector("[data-jest='result']")?.textContent?.trim(),
  ).toBe("!");
  expect(
    document.querySelector("[data-jest='encodedResult']")?.textContent?.trim(),
  ).toBe("33");
  expect(
    document.querySelector("[data-jest='error']")?.textContent?.trim(),
  ).toBe("");
});
