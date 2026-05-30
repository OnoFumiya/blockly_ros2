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


// =========================
// text
// =========================

Blockly.Blocks['send_text'] = {

  init: function () {

    this.appendDummyInput()
      .appendField("テキスト") // Title
      .appendField(
        new Blockly.FieldTextInput("Hello"), // default
        "TEXT___DATA"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(230);
  }
};


// =========================
// number
// =========================

Blockly.Blocks['send_number'] = {

  init: function () {

    this.appendDummyInput()
      .appendField("数値")
      .appendField(
        new Blockly.FieldTextInput("0"),
        "NUMBER___DATA"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(230);
  }
};


// =========================
// spawn
// =========================

Blockly.Blocks['send_spawn'] = {

  init: function () {

    this.appendDummyInput()
      .appendField("Name: ")
      .appendField(
        new Blockly.FieldTextInput("NAME"),
        "SPAWN___NAME"
      )
      .appendField("X: ")
      .appendField(
        new Blockly.FieldTextInput("0.0"),
        "SPAWN___X"
      )
      .appendField("Y: ")
      .appendField(
        new Blockly.FieldTextInput("0.0"),
        "SPAWN___Y"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(230);
  }
};


// =========================
// fibonacci
// =========================

Blockly.Blocks['send_fibonacci'] = {

  init: function () {

    this.appendDummyInput()
      .appendField("計算する回数")
      .appendField(
        new Blockly.FieldTextInput("0"),
        "FIBONACCI___ORDER"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(230);
  }
};


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

    case "send_text":
      await fetch("/text", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          text___data: block.getFieldValue("TEXT___DATA")
        })
      });

      break;

    case "send_number":
      await fetch("/number", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          number___data: block.getFieldValue("NUMBER___DATA")
        })
      });

      break;

    case "send_spawn":
      await fetch("/spawn", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          spawn___x   : block.getFieldValue("SPAWN___X"),
          spawn___y   : block.getFieldValue("SPAWN___Y"),
          spawn___name: block.getFieldValue("SPAWN___NAME")
        })
      });

      break;

    case "send_fibonacci":
      await fetch("/fibonacci", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          fibonacci___order: block.getFieldValue("FIBONACCI___ORDER")
        })
      });

      break;
  }
  // await fetch("/run", {

  //   method: "POST",

  //   headers: {
  //     "Content-Type": "application/json"
  //   },

  //   body: JSON.stringify({
  //     text: text
  //   })
  // });
}



// =========================
// 実行エンジン
// =========================

async function executeBlock(block) {

  while (block) {

    let oldColor;

    switch (block.type) {

      // ===================
      // text
      // ===================

      case "send_text":

        // 光らせる
        oldColor =
          await highlight(block);

        const text___data =
          block.getFieldValue("TEXT___DATA");

        console.log(text___data);

        await sendToPython(block);

        // 元色へ戻す
        block.setColour(oldColor);

        break;

      // ===================
      // number
      // ===================

      case "send_number":

        // 光らせる
        oldColor =
          await highlight(block);

        const number___data =
          block.getFieldValue("NUMBER___DATA");

        console.log(number___data);

        await sendToPython(block);

        // 元色へ戻す
        block.setColour(oldColor);

        break;

      // ===================
      // spawn
      // ===================

      case "send_spawn":

        // 光らせる
        oldColor =
          await highlight(block);

        const spawn___x =
          block.getFieldValue("SPAWN___X");

        const spawn___y =
          block.getFieldValue("SPAWN___Y");

        const spawn___name =
          block.getFieldValue("SPAWN___NAME");

        console.log(spawn___x);
        console.log(spawn___y);
        console.log(spawn___name);

        await sendToPython(block);

        // 元色へ戻す
        block.setColour(oldColor);

        break;

      // ===================
      // fibonacci
      // ===================

      case "send_fibonacci":

        // 光らせる
        oldColor =
          await highlight(block);

        const fibonacci___order =
          block.getFieldValue("FIBINACCI");

        console.log(fibonacci___order);

        await sendToPython(block);

        // 元色へ戻す
        block.setColour(oldColor);

        break;

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