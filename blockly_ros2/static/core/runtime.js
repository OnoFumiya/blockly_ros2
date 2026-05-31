import {
  customExecutors
} from "./registry.js";

export const functions = {};

// =========================
// 実行エンジン
// =========================

export async function executeBlock(block) {

  while (block) {

    switch(block.type) {

      // ===================
      // if
      // ===================

      case "if_block": {


        const cond =
          block.getFieldValue("COND") === "TRUE";

        if (cond) {

          const child =
            block.getInputTargetBlock("DO");

          await executeBlock(child);
        }

        break;
      }

      // ===================
      // if else
      // ===================

      case "if_else_block": {

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
      }

      // ===================
      // repeat
      // ===================

      case "repeat_block": {

        const count =
          Number(block.getFieldValue("COUNT"));

        for (let i = 0; i < count; i++) {

          await executeBlock(
            block.getInputTargetBlock("DO")
          );
        }

        break;
      }

      // ===================
      // function call
      // ===================

      case "call_function_block": {

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

      default: {

        const executor =
          customExecutors[block.type];

        if (executor) {
          await executor(block);
        }
      }
    }

    block = block.getNextBlock();
  }
}
