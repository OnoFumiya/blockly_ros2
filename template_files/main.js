var workspace;

const functions = {};


// 初期化
window.onload = function () {

  workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox')
  });

};



// =========================
// main
// =========================

Blockly.Blocks['main_block'] = {

  init: function () {

    this.appendDummyInput()
      .appendField("main");

    this.appendStatementInput("DO");

    this.setColour(20);
  }
};


/*
// =========================
// template (START)
// =========================

Blockly.Blocks['template'] = {

  init: function () {

    this.appendDummyInput()
      .appendField("String: ")
      .appendField(
        new Blockly.FieldTextInput("DEFAULT"),
        "TEMPLATE___STRING"
      )
      .appendField("Int: ")
      .appendField(
        new Blockly.FieldNumber(0, -Infinity, Infinity, 1),
        "TEMPLATE___INT"
      )
      .appendField("Float: ")
      .appendField(
        new Blockly.FieldNumber(0.0, -Infinity, Infinity, 0.001),
        "TEMPLATE___FLOAT"
      )
      .appendField("Bool: ")
      .appendField(
        new Blockly.FieldCheckbox("TRUE"),
        "TEMPLATE___BOOL"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(230);
  }
};
*/


// =========================
// if
// =========================

Blockly.Blocks['if_block'] = {

  init: function () {

    this.appendDummyInput()
      .appendField("もし")
      .appendField(
        new Blockly.FieldCheckbox("TRUE"),
        "COND"
      )
      .appendField("なら");

    this.appendStatementInput("DO");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(120);
  }
};


// =========================
// if else
// =========================

Blockly.Blocks['if_else_block'] = {

  init: function () {

    this.appendDummyInput()
      .appendField("もし")
      .appendField(
        new Blockly.FieldCheckbox("TRUE"),
        "COND"
      )
      .appendField("なら");

    this.appendStatementInput("IF_DO")
      .appendField("実行");

    this.appendStatementInput("ELSE_DO")
      .appendField("そうでなければ");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(120);
  }
};


// =========================
// repeat
// =========================

Blockly.Blocks['repeat_block'] = {

  init: function () {

    this.appendDummyInput()
      .appendField(
        new Blockly.FieldNumber(3, 0),
        "COUNT"
      )
      .appendField("回繰り返す");

    this.appendStatementInput("DO");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(60);
  }
};


// =========================
// function define
// =========================

Blockly.Blocks['function_block'] = {

  init: function () {

    this.appendDummyInput()
      .appendField("関数")
      .appendField(
        new Blockly.FieldTextInput("func"),
        "NAME"
      );

    this.appendStatementInput("DO");

    this.setColour(300);
  }
};


// =========================
// function call
// =========================

Blockly.Blocks['call_function_block'] = {

  init: function () {

    this.appendDummyInput()
      .appendField("関数呼び出し")
      .appendField(
        new Blockly.FieldTextInput("func"),
        "NAME"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(300);
  }
};



// =========================
// Python送信
// =========================

async function sendToPython(block) {

  switch (block.type) {

    /*
    // ===================
    // template
    // ===================

    case "template":
      await fetch("/template", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          template___string: block.getFieldValue("TEMPLATE___STRING"),
          template___int: block.getFieldValue("TEMPLATE___INT"),
          template___float: block.getFieldValue("TEMPLATE___FLOAT"),
          template___bool: block.getFieldValue("TEMPLATE___BOOL"),
        })
      });

      break;
    */
  }
}



// =========================
// 実行エンジン
// =========================

async function executeBlock(block) {

  while (block) {

    let oldColor;

    switch (block.type) {

      /*
      // ===================
      // template
      // ===================

      case "template":

        // 光らせる
        oldColor = await highlight(block);

        const template___string =
          block.getFieldValue("TEMPLATE___STRING");

        const template___int =
          block.getFieldValue("TEMPLATE___INT");

        const template___float =
          block.getFieldValue("TEMPLATE___FLOAT");

        const template___bool =
          block.getFieldValue("TEMPLATE___BOOL");

        console.log(template___string);
        console.log(template___int);
        console.log(template___float);
        console.log(template___bool);

        await sendToPython(block);

        // 元色へ戻す
        block.setColour(oldColor);

        break;
      */

      // ===================
      // if
      // ===================

      case "if_block":


        const cond =
          block.getFieldValue("COND") === "TRUE";

        if (cond) {

          const child =
            block.getInputTargetBlock("DO");

          await executeBlock(child);
        }

        break;


      // ===================
      // if else
      // ===================

      case "if_else_block":

        const cond2 =
          block.getFieldValue("COND") === "TRUE";

        if (cond2) {

          await executeBlock(
            block.getInputTargetBlock("IF_DO")
          );

        } else {

          await executeBlock(
            block.getInputTargetBlock("ELSE_DO")
          );
        }

        break;


      // ===================
      // repeat
      // ===================

      case "repeat_block":

        const count =
          Number(block.getFieldValue("COUNT"));

        for (let i = 0; i < count; i++) {

          await executeBlock(
            block.getInputTargetBlock("DO")
          );
        }

        break;


      // ===================
      // function call
      // ===================

      case "call_function_block":

        const name =
          block.getFieldValue("NAME");

        const funcBlock =
          functions[name];

        if (funcBlock) {

          await executeBlock(
            funcBlock.getInputTargetBlock("DO")
          );
        }

        break;
    }

    block = block.getNextBlock();
  }
}



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



// =========================
// sleep
// =========================

function sleep(ms) {

  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}



// =========================
// ブロックハイライト
// =========================

async function highlight(block) {

  // 元色保存
  const oldColor = block.getColour();

  // 黄色化
  block.setColour("#ffff00");

  await sleep(200);

  return oldColor;
}