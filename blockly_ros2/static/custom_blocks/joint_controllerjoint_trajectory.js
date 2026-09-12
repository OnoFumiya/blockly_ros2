import {
  customExecutors
} from "../core/registry.js";

import { highlight }
  from "../core/utils.js";



// =========================
// 定義
// =========================

Blockly.Blocks['send_joint_controllerjoint_trajectory'] = {

  init: function () {

    this.appendDummyInput()
      ;
    this.appendDummyInput()
      .appendField("JOINT NAMES=>>")
      .appendField(
        
        
        new Blockly.FieldTextInput(""),
        
        
        
        "JOINT_CONTROLLERJOINT_TRAJECTORY___JOINT_NAMES__0__"
      )
      .appendField(
        
        
        new Blockly.FieldTextInput(""),
        
        
        
        "JOINT_CONTROLLERJOINT_TRAJECTORY___JOINT_NAMES__1__"
      )
      .appendField(
        
        
        new Blockly.FieldTextInput(""),
        
        
        
        "JOINT_CONTROLLERJOINT_TRAJECTORY___JOINT_NAMES__2__"
      )
      ;
    this.appendDummyInput();
    this.appendDummyInput()
      .appendField("Angles[rad]=>>")
      .appendField(
        
        
        
        
        new Blockly.FieldNumber(0, -Infinity, Infinity, 1),
        
        "JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____POSITIONS__0__"
      )
      .appendField(
        
        
        
        
        new Blockly.FieldNumber(0, -Infinity, Infinity, 1),
        
        "JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____POSITIONS__1__"
      )
      .appendField(
        
        
        
        
        new Blockly.FieldNumber(0, -Infinity, Infinity, 1),
        
        "JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____POSITIONS__2__"
      )
      ;
    this.appendDummyInput()
      .appendField("movement time[s]: ")
      .appendField(
        
        
        
        
        
        new Blockly.FieldNumber(0.0, 0.0, Infinity, 0.001),
        "JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____TIME_FROM_START"
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

async function sendJointControllerjointTrajectory(block) {

  await fetch("/joint_controllerjoint_trajectory", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      
      joint_controllerjoint_trajectory___joint_names__0__: block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___JOINT_NAMES__0__"),
      
      joint_controllerjoint_trajectory___joint_names__1__: block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___JOINT_NAMES__1__"),
      
      joint_controllerjoint_trajectory___joint_names__2__: block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___JOINT_NAMES__2__"),
      
      joint_controllerjoint_trajectory___points__0____positions__0__: block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____POSITIONS__0__"),
      
      joint_controllerjoint_trajectory___points__0____positions__1__: block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____POSITIONS__1__"),
      
      joint_controllerjoint_trajectory___points__0____positions__2__: block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____POSITIONS__2__"),
      
      joint_controllerjoint_trajectory___points__0____time_from_start: block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____TIME_FROM_START"),
      
    })
  });
}



// =========================
// 実行処理
// =========================

async function executeJointControllerjointTrajectory(block) {

  const oldColor =
    await highlight(block);

  
  const joint_controllerjoint_trajectory___joint_names__0__ =
    block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___JOINT_NAMES__0__");
  
  const joint_controllerjoint_trajectory___joint_names__1__ =
    block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___JOINT_NAMES__1__");
  
  const joint_controllerjoint_trajectory___joint_names__2__ =
    block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___JOINT_NAMES__2__");
  
  const joint_controllerjoint_trajectory___points__0____positions__0__ =
    block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____POSITIONS__0__");
  
  const joint_controllerjoint_trajectory___points__0____positions__1__ =
    block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____POSITIONS__1__");
  
  const joint_controllerjoint_trajectory___points__0____positions__2__ =
    block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____POSITIONS__2__");
  
  const joint_controllerjoint_trajectory___points__0____time_from_start =
    block.getFieldValue("JOINT_CONTROLLERJOINT_TRAJECTORY___POINTS__0____TIME_FROM_START");
  

  
  console.log(joint_controllerjoint_trajectory___joint_names__0__);
  
  console.log(joint_controllerjoint_trajectory___joint_names__1__);
  
  console.log(joint_controllerjoint_trajectory___joint_names__2__);
  
  console.log(joint_controllerjoint_trajectory___points__0____positions__0__);
  
  console.log(joint_controllerjoint_trajectory___points__0____positions__1__);
  
  console.log(joint_controllerjoint_trajectory___points__0____positions__2__);
  
  console.log(joint_controllerjoint_trajectory___points__0____time_from_start);
  

  await sendJointControllerjointTrajectory(block);

  block.setColour(oldColor);

}



// =========================
// 登録
// =========================

customExecutors["send_joint_controllerjoint_trajectory"] =
  executeJointControllerjointTrajectory;