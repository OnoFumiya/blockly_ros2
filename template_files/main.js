/*LIST_START{DATA_NAME}*/
import "./custom_blocks//*file_name*/.js";
/*LIST_END{DATA_NAME}*/
import "./core/blocks.js";
import {
  executeBlock,
  functions
} from "./core/runtime.js";

var workspace;


// 初期化
window.onload = function () {

  workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox')
  });

};


// =========================
// 実行
// =========================

async function runCode() {

  const blocks =
    workspace.getTopBlocks(true);

  let mainBlock = null;

  // 関数登録
  for (const block of blocks) {

    if (block.type === "function_block") {

      const name =
        block.getFieldValue("NAME");

      functions[name] = block;
    }

    if (block.type === "main_block") {

      mainBlock = block;
    }
  }

  // mainだけ実行
  if (mainBlock) {

    const start =
      mainBlock.getInputTargetBlock("DO");

    await executeBlock(start);
  }
}

window.runCode = runCode;