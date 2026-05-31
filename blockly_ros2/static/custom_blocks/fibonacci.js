import {
  customExecutors
} from "../core/registry.js";

import { highlight }
  from "../core/utils.js";



// =========================
// 定義
// =========================

Blockly.Blocks['send_fibonacci'] = {

  init: function () {

    this.appendDummyInput()
      
      .appendField("計算したい回数 >> ")
      .appendField(
        new Blockly.FieldNumber(0, -Infinity, Infinity, 1),
        
        
        
        
        
        "FIBONACCI___ORDER"
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

async function sendFibonacci(block) {

  await fetch("/fibonacci", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      
      fibonacci___order: block.getFieldValue("FIBONACCI___ORDER"),
      
    })
  });
}



// =========================
// 実行処理
// =========================

async function executeFibonacci(block) {

  const oldColor =
    await highlight(block);

  
  const fibonacci___order =
    block.getFieldValue("FIBONACCI___ORDER");
  

  
  console.log(fibonacci___order);
  

  await sendFibonacci(block);

  block.setColour(oldColor);

}



// =========================
// 登録
// =========================

customExecutors["send_fibonacci"] =
  executeFibonacci;