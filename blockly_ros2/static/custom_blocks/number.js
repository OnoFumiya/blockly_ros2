import {
  customExecutors
} from "../core/registry.js";

import { highlight }
  from "../core/utils.js";



// =========================
// 定義
// =========================

Blockly.Blocks['send_number'] = {

  init: function () {

    this.appendDummyInput()
      
      .appendField("数値: ")
      .appendField(
        
        new Blockly.FieldNumber(0.0, -Infinity, Infinity, 0.001),
        
        
        "NUMBER___DATA"
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

async function sendNumber(block) {

  await fetch("/number", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      
      number___data: block.getFieldValue("NUMBER___DATA"),
      
    })
  });
}



// =========================
// 実行処理
// =========================

async function executeNumber(block) {

  const oldColor =
    await highlight(block);

  
  const number___data =
    block.getFieldValue("NUMBER___DATA");
  

  
  console.log(number___data);
  

  await sendNumber(block);

  block.setColour(oldColor);

}



// =========================
// 登録
// =========================

customExecutors["send_number"] =
  executeNumber;