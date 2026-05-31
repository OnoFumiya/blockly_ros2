
// =========================
// sleep
// =========================

export function sleep(ms) {

  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}



// =========================
// ブロックハイライト
// =========================

export async function highlight(block) {

  // 元色保存
  const oldColor = block.getColour();

  // 黄色化
  block.setColour("#ffff00");

  await sleep(200);

  return oldColor;
}