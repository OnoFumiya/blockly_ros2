import {
  customExecutors
} from "../core/registry.js";

import { highlight }
  from "../core/utils.js";



// =========================
// 定義
// =========================

Blockly.Blocks['send_/*file_name*/'] = {

  init: function () {

    this.appendDummyInput()
      /*LIST_START{DATA_NAME}*/
      .appendField("/*Allow*/")
      .appendField(
        /*IF_START{MSG_TYPE}*/new Blockly.FieldTextInput(""),/*IF_END{MSG_TYPE}*/
        /*IF_START{MSG_TYPE}*/new Blockly.FieldNumber(0.0, -Infinity, Infinity, 0.001),/*IF_END{MSG_TYPE}*/
        /*IF_START{MSG_TYPE}*/new Blockly.FieldNumber(0, -Infinity, Infinity, 1),/*IF_END{MSG_TYPE}*/
        /*IF_START{MSG_TYPE}*/new Blockly.FieldCheckbox("TRUE"),/*IF_END{MSG_TYPE}*/
        "/*FILE_NAME*/___/*DATA_NAME*/"
      )
      /*LIST_END{DATA_NAME}*/;

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(230);
  }
};



// =========================
// Python送信
// =========================

async function send/*FileName*/(block) {

  await fetch("//*file_name*/", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      /*LIST_START{DATA_NAME}*/
      /*file_name*/___/*data_name*/: block.getFieldValue("/*FILE_NAME*/___/*DATA_NAME*/"),
      /*LIST_END{DATA_NAME}*/
    })
  });
}



// =========================
// 実行処理
// =========================

async function execute/*FileName*/(block) {

  const oldColor =
    await highlight(block);

  /*LIST_START{DATA_NAME}*/
  const /*file_name*/___/*data_name*/ =
    block.getFieldValue("/*FILE_NAME*/___/*DATA_NAME*/");
  /*LIST_END{DATA_NAME}*/

  /*LIST_START{DATA_NAME}*/
  console.log(/*file_name*/___/*data_name*/);
  /*LIST_END{DATA_NAME}*/

  await send/*FileName*/(block);

  block.setColour(oldColor);

}



// =========================
// 登録
// =========================

customExecutors["send_/*file_name*/"] =
  execute/*FileName*/;