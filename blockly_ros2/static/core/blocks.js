
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


