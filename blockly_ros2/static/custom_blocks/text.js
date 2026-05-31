import {
  customExecutors
} from "../core/registry.js";

import { highlight }
  from "../core/utils.js";



// =========================
// 定義
// =========================

Blockly.Blocks['send_text'] = {

  init: function () {

    this.appendDummyInput()
      
      .appendField("テキスト")
      .appendField(
        new Blockly.FieldTextInput(""),
        
        
        
        "TEXT___DATA"
      )
      ;

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(230);
  }
};



// =========================
// Python送信
// =========================

async function sendText(block) {

  await fetch("/text", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      
      text___data: block.getFieldValue("TEXT___DATA"),
      
    })
  });
}



// =========================
// 実行処理
// =========================

async function executeText(block) {

  const oldColor =
    await highlight(block);

  
  const text___data =
    block.getFieldValue("TEXT___DATA");
  

  
  console.log(text___data);
  

  await sendText(block);

  block.setColour(oldColor);

}



// =========================
// 登録
// =========================

customExecutors["send_text"] =
  executeText;