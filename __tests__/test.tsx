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

test("アンダー/オーバーフロー", () => {
  render(<Home />);
  const cheru = document.querySelector(
    "[data-jest='cheru']",
  ) as HTMLTextAreaElement;
  cheru.value = "ちぇぱちぇぽちぇらちぇるちぇら";
  ReactTestUtils.Simulate.change(cheru);
  act(() => {
    const run = document.querySelector("[data-jest='run']") as Element;
    ReactTestUtils.Simulate.click(run);
    jest.runAllTimers();
  });

  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 0 ? "255" : "000"),
  );
});

test("実行", () => {
  render(<Home />);
  const cheru = document.querySelector(
    "[data-jest='cheru']",
  ) as HTMLTextAreaElement;
  cheru.value = "ちぇる？ちぇるちぇる";
  ReactTestUtils.Simulate.change(cheru);

  // 実行
  const run = document.querySelector("[data-jest='run']") as Element;
  act(() => {
    ReactTestUtils.Simulate.click(run);
    jest.runAllTimers();
  });
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 0 ? "001" : "000"),
  );

  // ブレークポイントから実行
  act(() => {
    ReactTestUtils.Simulate.click(run);
    jest.runAllTimers();
  });
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 0 ? "001" : "000"),
  );

  // ステップから実行
  const step = document.querySelector("[data-jest='step']") as Element;
  act(() => {
    ReactTestUtils.Simulate.click(step);
    ReactTestUtils.Simulate.click(run);
    jest.runAllTimers();
  });
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 0 ? "001" : "000"),
  );

  // 再開から実行
  const resume = document.querySelector("[data-jest='resume']") as Element;
  act(() => {
    ReactTestUtils.Simulate.click(resume);
    ReactTestUtils.Simulate.click(run);
    jest.runAllTimers();
  });
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 0 ? "001" : "000"),
  );

  // 終了状態から実行(実行から実行)
  cheru.value = "ちぇる";
  ReactTestUtils.Simulate.change(cheru);
  act(() => {
    ReactTestUtils.Simulate.click(run);
    jest.runAllTimers();
    ReactTestUtils.Simulate.click(run);
    jest.runAllTimers();
  });
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 0 ? "001" : "000"),
  );
});

test("ステップ", () => {
  render(<Home />);
  const cheru = document.querySelector(
    "[data-jest='cheru']",
  ) as HTMLTextAreaElement;
  cheru.value = "ちぇる？ちぇるちぇる";
  ReactTestUtils.Simulate.change(cheru);

  // ステップ
  const step = document.querySelector("[data-jest='step']") as Element;
  act(() => {
    ReactTestUtils.Simulate.click(step);
    jest.runAllTimers();
  });
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 0 ? "001" : "000"),
  );

  // ブレークポイントをステップ
  act(() => {
    ReactTestUtils.Simulate.click(step);
    jest.runAllTimers();
  });
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 0 ? "001" : "000"),
  );

  // 終了状態からステップ
  const resume = document.querySelector("[data-jest='resume']") as Element;
  act(() => {
    ReactTestUtils.Simulate.click(resume);
    jest.runAllTimers();
    ReactTestUtils.Simulate.click(step);
    jest.runAllTimers();
  });
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe("000"),
  );
});

test("再開", () => {
  render(<Home />);
  const cheru = document.querySelector(
    "[data-jest='cheru']",
  ) as HTMLTextAreaElement;
  cheru.value = "ちぇるちぇる？ちぇるちぇる";
  ReactTestUtils.Simulate.change(cheru);

  // ブレークポイントから再開
  const run = document.querySelector("[data-jest='run']") as Element;
  const resume = document.querySelector("[data-jest='resume']") as Element;
  act(() => {
    ReactTestUtils.Simulate.click(run);
    jest.runAllTimers();
    ReactTestUtils.Simulate.click(resume);
    jest.runAllTimers();
  });
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 0 ? "004" : "000"),
  );

  // ステップから再開
  const step = document.querySelector("[data-jest='step']") as Element;
  act(() => {
    ReactTestUtils.Simulate.click(step); // 終了状態からのステップで初期状態に戻る
    jest.runAllTimers();
    ReactTestUtils.Simulate.click(step);
    jest.runAllTimers();
    ReactTestUtils.Simulate.click(resume);
    jest.runAllTimers();
  });
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 0 ? "002" : "000"),
  );

  // 終了状態から再開
  act(() => {
    ReactTestUtils.Simulate.click(resume); // 終了状態になる
    jest.runAllTimers();
    ReactTestUtils.Simulate.click(resume);
    jest.runAllTimers();
  });
  [...Array(30)].forEach((_, index) =>
    expect(
      document.querySelector("[data-jest='memory" + index + "']")?.textContent,
    ).toBe(index === 0 ? "004" : "000"),
  );
});

test("停止", () => {
  render(<Home />);
  const cheru = document.querySelector(
    "[data-jest='cheru']",
  ) as HTMLTextAreaElement;
  cheru.value = "ちぇるちぇっちぇるちぇ";
  ReactTestUtils.Simulate.change(cheru);

  // 停止
  const run = document.querySelector("[data-jest='run']") as Element;
  const stop = document.querySelector("[data-jest='stop']") as Element;
  let before;
  let after;
  act(() => {
    ReactTestUtils.Simulate.click(run);
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    before = document.querySelector("[data-jest='memory0']")?.textContent;
    ReactTestUtils.Simulate.click(stop);
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    after = document.querySelector("[data-jest='memory0']")?.textContent;
  });
  expect(before).toBe("002");
  expect(after).toBe("002");

  // 停止から実行して停止
  act(() => {
    ReactTestUtils.Simulate.click(run);
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    before = document.querySelector("[data-jest='memory0']")?.textContent;
    ReactTestUtils.Simulate.click(stop);
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    after = document.querySelector("[data-jest='memory0']")?.textContent;
  });
  expect(before).toBe("002");
  expect(after).toBe("002");

  // 停止からステップ
  const step = document.querySelector("[data-jest='step']") as Element;
  act(() => {
    ReactTestUtils.Simulate.click(run);
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    ReactTestUtils.Simulate.click(stop);
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    before = document.querySelector("[data-jest='memory0']")?.textContent;
    ReactTestUtils.Simulate.click(step);
    jest.runOnlyPendingTimers();
    ReactTestUtils.Simulate.click(step);
    jest.runOnlyPendingTimers();
    ReactTestUtils.Simulate.click(step);
    jest.runOnlyPendingTimers();
    after = document.querySelector("[data-jest='memory0']")?.textContent;
  });
  expect(before).toBe("002");
  expect(after).toBe("003");
});
