import type { NextPage } from "next";
import { useState, useRef } from "react";
import { Form, Table, Accordion } from "react-bootstrap";

const Home: NextPage = () => {
  const [state, setState] = useState({
    cheru: "",
    source: "",
    memories: [...Array(30)].map((_) => 0),
    pointer: 0,
    programCounter: 0,
    result: [] as number[],
    error: "",
    stopped: false,

    runDisabled: false,
    stepDisabled: false,
    resumeDisabled: true,
    stopDisabled: true,
    radix: 10,
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const cheruKeywords = [
    "ちぇるーん",
    "ちぇる",
    "ちぇら",
    "ちぇぱ",
    "ちぇぽ",
    "ちぇっ",
    "ちぇ",
    "？",
  ];
  const brainfKeywords = [".", "+", "-", "<", ">", "[", "]", "#"];

  const validateStatically = (): boolean => {
    let index = 0;
    outerLoop: while (index < stateRef.current.cheru.length) {
      const token = stateRef.current.cheru.substring(index);
      for (let i = 0; i < cheruKeywords.length; ++i) {
        if (token.startsWith(cheruKeywords[i])) {
          index += cheruKeywords[i].length;
          continue outerLoop;
        }
      }
      const c = token.substring(0, 1);
      switch (c) {
        case " ":
        case "\n":
        case "\t":
          index++;
          break;
        default:
          setState((prevState) => ({
            ...prevState,
            error:
              "不正な文字が含まれています: " +
              c +
              " (" +
              (index + 1) +
              "文字目付近)",
          }));
          return false;
      }
    }

    let count = 0;
    for (let i = 0; i < stateRef.current.source.length; ++i) {
      if (stateRef.current.source.substring(i, i + 1) === "[") {
        count++;
      }
      if (stateRef.current.source.substring(i, i + 1) === "]") {
        count--;
      }
      if (count < 0) {
        setState((prevState) => ({
          ...prevState,
          error: "ちぇっ/ちぇの対応が不正です",
        }));
        break;
      }
    }
    if (count !== 0) {
      setState((prevState) => ({
        ...prevState,
        error: "ちぇっ/ちぇの対応が不正です",
      }));
      return false;
    }

    setState((prevState) => ({ ...prevState, error: "" }));
    return true;
  };

  const run = (stepped: boolean, resumed: boolean): void => {
    if (!validateStatically()) {
      return;
    }
    let memories = stateRef.current.memories;
    let pointer = stateRef.current.pointer;
    let programCounter = stateRef.current.programCounter;
    let result = stateRef.current.result;
    if (!stepped && !resumed) {
      memories = [...Array(30)].map((_) => 0);
      pointer = 0;
      programCounter = 0;
      result = [];
    }
    setState((prevState) => ({
      ...prevState,
      runDisabled: true,
      stepDisabled: true,
      resumeDisabled: true,
    }));
    if ((!stepped && !resumed) || resumed) {
      setState((prevState) => ({ ...prevState, stopDisabled: false }));
    }
    if (stepped) {
      setState((prevState) => ({ ...prevState, stopDisabled: true }));
    }
    const interpret = () => {
      if (stateRef.current.stopped) {
        setState((prevState) => ({
          ...prevState,
          stopped: false,
          stopDisabled: true,
        }));
        return;
      }
      if (stateRef.current.source.length <= programCounter) {
        setState((prevState) => ({
          ...prevState,
          runDisabled: false,
          stepDisabled: false,
          resumeDisabled: true,
          stopDisabled: true,
        }));
        if (stepped) {
          setState((prevState) => ({
            ...prevState,
            memories: [...Array(30)].map((_) => 0),
            pointer: 0,
            programCounter: 0,
            result: [],
          }));
        }
        return;
      }
      const code = stateRef.current.source.substring(
        programCounter,
        programCounter + 1,
      );
      programCounter++;
      switch (code) {
        case ">":
          if (pointer === memories.length - 1) {
            pointer = 0;
            break;
          }
          pointer++;
          break;
        case "<":
          if (pointer === 0) {
            pointer = memories.length - 1;
            break;
          }
          pointer--;
          break;
        case "+": {
          if (memories[pointer] === 255) {
            memories[pointer] = 0;
            break;
          }
          memories[pointer]++;
          break;
        }
        case "-": {
          if (memories[pointer] === 0) {
            memories[pointer] = 255;
            break;
          }
          memories[pointer]--;
          break;
        }
        case ".":
          result.push(memories[pointer]);
          break;
        case "[": {
          if (memories[pointer] !== 0) {
            break;
          }
          let count = 0;
          for (
            let i = programCounter;
            i < stateRef.current.source.length;
            ++i
          ) {
            const code = stateRef.current.source.substring(i, i + 1);
            if (code === "[") {
              count++;
            }
            if (code === "]") {
              if (count === 0) {
                programCounter = i + 1;
                break;
              }
              count--;
            }
          }
          break;
        }
        case "]": {
          if (memories[pointer] === 0) {
            break;
          }
          let count = 0;
          for (let i = programCounter - 2; 0 <= i; --i) {
            const code = stateRef.current.source.substring(i, i + 1);
            if (code === "]") {
              count++;
            }
            if (code === "[") {
              if (count === 0) {
                programCounter = i;
                break;
              }
              count--;
            }
          }
          break;
        }
        case "#": {
          setState((prevState) => ({
            ...prevState,
            memories,
            pointer,
            programCounter,
            result,
            runDisabled: false,
            stepDisabled: false,
            resumeDisabled: false,
            stopDisabled: true,
          }));
          return;
        }
        default:
          break;
      }
      setState((prevState) => ({
        ...prevState,
        memories,
        pointer,
        programCounter,
        result,
      }));
      if (stepped) {
        setState((prevState) => ({
          ...prevState,
          runDisabled: false,
          stepDisabled: false,
          resumeDisabled: false,
        }));
      } else {
        setTimeout(interpret, 0);
      }
    };
    interpret();
  };

  const stop = () => {
    setState((prevState) => ({
      ...prevState,
      stopped: true,
      runDisabled: false,
      stepDisabled: false,
      resumeDisabled: false,
    }));
  };

  const updateCheru = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setState((prevState) => ({
      ...prevState,
      cheru: event.target.value,
      source: convertToBrainf(event.target.value),
    }));
  };

  const changeRadix = () => {
    setState((prevState) => ({ ...prevState, radix: 26 - prevState.radix }));
  };

  const decode = (sources: number[]): string => {
    // ref.: https://qiita.com/t-yama-3/items/07e9fbba7db73eca8c6f
    const masks = [0x80, 0xe0, 0xf0, 0xf8, 0xfc, 0xfe, 0xc0];
    const results = [0x00, 0xc0, 0xe0, 0xf0, 0xf8, 0xfc, 0x80];
    let result = "";
    outerLoop: for (let s = 0; s < sources.length; ++s) {
      for (let m = 0; m < masks.length; ++m) {
        if ((sources[s] & masks[m]) === results[m]) {
          if (m === 0) {
            result += String.fromCharCode(sources[s]);
            continue outerLoop;
          }
          if (m === masks.length - 1) {
            continue outerLoop;
          }
          let code = "%" + sources[s].toString(16);
          for (let b = 1; b < m + 1; ++b) {
            if (s + b < sources.length) {
              code += "%" + sources[s + b].toString(16);
            }
          }
          try {
            result += decodeURIComponent(code);
          } catch (e) {
            if (e instanceof URIError) {
            }
          }
        }
      }
    }
    return result;
  };

  const convertToBrainf = (source: string): string => {
    let result = "";
    for (let i = 0; i < source.length; ++i) {
      const c = source.substring(i, i + 1);
      const separators = ["\n", "\t", " "];
      const separator = separators.find((value) => value === c);
      if (separator) {
        result += separator;
        continue;
      }

      const token = source.substring(i);
      for (let k = 0; k < cheruKeywords.length; ++k) {
        if (token.startsWith(cheruKeywords[k])) {
          result += brainfKeywords[k];
          break;
        }
      }
    }
    return result;
  };

  return (
    <div className="container mt-3">
      <div>
        ちぇる語の翻訳機です(Brainf***のちぇる版)。エンコードはUTF-8なので日本語も使用できます。
      </div>
      <Table striped hover size="sm" className="text-center">
        <caption className="mt-3 fw-bold caption-top text-center">
          対応表
        </caption>
        <thead>
          <tr>
            <th>brainf***</th>
            <th>ちぇる語</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>.</td>
            <td>ちぇるーん</td>
          </tr>
          <tr>
            <td>+</td>
            <td>ちぇる</td>
          </tr>
          <tr>
            <td>-</td>
            <td>ちぇら</td>
          </tr>
          <tr>
            <td>&lt;</td>
            <td>ちぇぱ</td>
          </tr>
          <tr>
            <td>&gt;</td>
            <td>ちぇぽ</td>
          </tr>
          <tr>
            <td>[</td>
            <td>ちぇっ</td>
          </tr>
          <tr>
            <td>]</td>
            <td>ちぇ</td>
          </tr>
          <tr>
            <td>,</td>
            <td>(未実装)</td>
          </tr>
          <tr>
            <td># (ブレークポイント)</td>
            <td>？ (全角)</td>
          </tr>
        </tbody>
      </Table>
      <Form>
        <Form.Group controlId="cheru">
          <Form.Label className="fw-bold">ちぇる語入力欄</Form.Label>
          <Form.Control
            value={state.cheru}
            onChange={updateCheru}
            as="textarea"
            rows={5}
          />
        </Form.Group>
        <Form.Group controlId="source" className="mt-3">
          <Form.Label className="fw-bold">brainf***変換</Form.Label>
          <Form.Control
            value={state.source}
            onChange={() => {}}
            as="textarea"
            rows={5}
            readOnly
          />
        </Form.Group>
      </Form>
      <div className="mt-3">
        <button
          type="button"
          disabled={state.runDisabled}
          className="btn btn-dark me-2"
          onClick={() => run(false, false)}
        >
          実行
        </button>
        <button
          type="button"
          disabled={state.stepDisabled}
          className="btn btn-dark me-2"
          onClick={() => run(true, false)}
        >
          ステップ
        </button>
        <button
          type="button"
          disabled={state.resumeDisabled}
          className="btn btn-dark me-2"
          onClick={() => run(false, true)}
        >
          再開
        </button>
        <button
          type="button"
          disabled={state.stopDisabled}
          className="btn btn-dark"
          onClick={stop}
        >
          停止
        </button>
      </div>
      <button type="button" className="btn btn-dark mt-3" onClick={changeRadix}>
        10/16進数切替
      </button>
      <div className="mt-3 fw-bold">次の実行位置</div>
      <div className="text-break">
        {[...Array(state.source.length)].map((_, index) =>
          index === state.programCounter ? (
            <span key={index} className="bg-info">
              {state.source.substring(index, index + 1)}
            </span>
          ) : (
            <span key={index}>{state.source.substring(index, index + 1)}</span>
          ),
        )}
        &nbsp;
      </div>
      <div className="mt-3 fw-bold">メモリー ({state.radix}進数)</div>
      <div className="d-flex flex-wrap">
        {state.memories.map((_, index) => (
          <div
            key={index}
            className={"me-3 " + (index === state.pointer ? "bg-info" : "")}
          >
            {"0".repeat(
              Math.max(
                (state.radix === 10 ? 3 : 2) -
                  state.memories[index].toString(state.radix).length,
                0,
              ),
            ) + state.memories[index].toString(state.radix)}
          </div>
        ))}
      </div>
      <div className="mt-3 fw-bold">翻訳結果</div>
      <div>{decode(state.result)}&nbsp;</div>
      <div className="mt-3 fw-bold">
        翻訳結果 (エンコード値, {state.radix}進数)
      </div>
      <div>
        {" "}
        {state.result
          .map((value) => value.toString(state.radix))
          .join(" ")}{" "}
        &nbsp;{" "}
      </div>
      <div className="mt-3 fw-bold">エラーメッセージ</div>
      <div className="text-danger">{state.error}&nbsp;</div>
      <div className="mt-3">サンプルコード</div>
      <Accordion className="mt-2">
        <Accordion.Item eventKey="0">
          <Accordion.Header>おいっすー☆</Accordion.Header>
          <Accordion.Body>
        ちぇぽちぇるちぇるちぇるちぇるちぇるちぇっちぇぽちぇるちぇるちぇるちぇるちぇるちぇぱちぇらちぇちぇぽちぇっちぇぱちぇるちぇるちぇぽちぇらちぇちぇぱちぇらちぇらちぇらちぇらちぇっちぇぱちぇるちぇるちぇるちぇるちぇるちぇぽちぇらちぇちぇぱちぇらちぇらちぇら
        <br />
        ちぇぽちぇるちぇるちぇるちぇるちぇるちぇっちぇぽちぇるちぇるちぇるちぇるちぇるちぇぱちぇらちぇちぇぽちぇるちぇっちぇぱちぇるちぇるちぇるちぇるちぇるちぇぽちぇらちぇちぇぱちぇら
        <br />
        ちぇぽちぇるちぇるちぇるちぇるちぇるちぇっちぇぽちぇるちぇるちぇるちぇるちぇるちぇぱちぇらちぇちぇぽちぇるちぇるちぇるちぇっちぇぱちぇるちぇるちぇるちぇるちぇるちぇぽちぇらちぇちぇぱちぇらちぇら
        <br />
        ちぇぽちぇぽちぇるちぇるちぇるちぇるちぇるちぇっちぇぽちぇるちぇるちぇるちぇぱちぇらちぇちぇぽちぇっちぇぱちぇるちぇるちぇぽちぇらちぇちぇぱちぇるちぇっちぇぽちぇるちぇるちぇるちぇるちぇるちぇぱちぇらちぇちぇぽちぇるちぇるちぇるちぇっちぇぱちぇるちぇぱちぇるちぇぽちぇぽちぇらちぇ
        <br />
        ちぇぽちぇるちぇるちぇるちぇるちぇっちぇぽちぇるちぇるちぇるちぇるちぇぱちぇらちぇちぇぽちぇるちぇるちぇるちぇっちぇぱちぇるちぇるちぇぽちぇらちぇちぇぱちぇっちぇぱちぇるちぇるちぇるちぇるちぇるちぇぽちぇらちぇちぇぱちぇらちぇら
        <br />
        <br />
        ちぇぱちぇぱちぇぱちぇぱちぇぱちぇるーんちぇぽちぇるーんちぇぽちぇるーん
        <br />
        ちぇぱちぇぱちぇるーんちぇぽちぇるーんちぇるちぇるちぇるちぇるーん
        <br />
        ちぇぱちぇるーんちぇぽちぇらちぇらちぇらちぇるーんちぇぽちぇぽちぇるちぇるちぇるちぇるちぇるちぇるーん
        <br />
        ちぇぱちぇぱちぇぱちぇるーんちぇぽちぇるーんちぇぽちぇぽちぇぽちぇらちぇらちぇらちぇらちぇらちぇるーん
        <br />
        ちぇぱちぇぱちぇぱちぇぱちぇるーんちぇぽちぇるちぇるちぇるーんちぇぽちぇぽちぇぽちぇぽちぇるーん
        <br />
        ちぇぱちぇぱちぇぱちぇぱちぇぱちぇらちぇるーんちぇぽちぇぽちぇぽちぇぽちぇらちぇるーんちぇぱちぇぱちぇらちぇらちぇらちぇらちぇるーん
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>『めっ』でございますよ</Accordion.Header>
          <Accordion.Body>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>ヤバイわよ！！</Accordion.Header>
          <Accordion.Body>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Home;
