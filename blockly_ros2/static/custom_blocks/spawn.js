import {
  customExecutors
} from "../core/registry.js";

import { highlight }
  from "../core/utils.js";



// =========================
// 定義
// =========================

Blockly.Blocks['send_spawn'] = {

  init: function () {

    this.appendDummyInput()
      
      .appendField("Name: ")
      .appendField(
        
        
        new Blockly.FieldTextInput(""),
        
        
        
        "SPAWN___NAME"
      )
      
      .appendField("X: ")
      .appendField(
        
        new Blockly.FieldNumber(0.0, -Infinity, Infinity, 0.001),
        
        
        
        
        "SPAWN___X"
      )
      
      .appendField("Y: ")
      .appendField(
        
        new Blockly.FieldNumber(0.0, -Infinity, Infinity, 0.001),
        
        
        
        
        "SPAWN___Y"
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

async function sendSpawn(block) {

  await fetch("/spawn", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      
      spawn___name: block.getFieldValue("SPAWN___NAME"),
      
      spawn___x: block.getFieldValue("SPAWN___X"),
      
      spawn___y: block.getFieldValue("SPAWN___Y"),
      
    })
  });
}



// =========================
// 実行処理
// =========================

async function executeSpawn(block) {

  const oldColor =
    await highlight(block);

  
  const spawn___name =
    block.getFieldValue("SPAWN___NAME");
  
  const spawn___x =
    block.getFieldValue("SPAWN___X");
  
  const spawn___y =
    block.getFieldValue("SPAWN___Y");
  

  
  console.log(spawn___name);
  
  console.log(spawn___x);
  
  console.log(spawn___y);
  

  await sendSpawn(block);

  block.setColour(oldColor);

}



// =========================
// 登録
// =========================

customExecutors["send_spawn"] =
  executeSpawn;