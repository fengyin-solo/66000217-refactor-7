// 盲文共用定义：字符 ↔ 圆点配对，以及六个圆点在 2x3 点阵中的位置。
// 显示（BrailleCell）、答题判定、反向查找、另存导出都只从这里取数据，
// 新增字符或调整圆点布局时只需修改这一份文件。

/** 六个圆点的编号，顺序即点阵绘制顺序（左列 1-3，右列 4-6） */
export const DOTS = [1, 2, 3, 4, 5, 6] as const
export type Dot = (typeof DOTS)[number]

// English Braille Grade 1 mapping（字符 ↔ 凸起圆点编号）
export const BRAILLE_MAP: Record<string, Dot[]> = {
  'A': [1], 'B': [1,2], 'C': [1,4], 'D': [1,4,5], 'E': [1,5],
  'F': [1,2,4], 'G': [1,2,4,5], 'H': [1,2,5], 'I': [2,4], 'J': [2,4,5],
  'K': [1,3], 'L': [1,2,3], 'M': [1,3,4], 'N': [1,3,4,5], 'O': [1,3,5],
  'P': [1,2,3,4], 'Q': [1,2,3,4,5], 'R': [1,2,3,5], 'S': [2,3,4], 'T': [2,3,4,5],
  'U': [1,3,6], 'V': [1,2,3,6], 'W': [2,4,5,6], 'X': [1,3,4,6], 'Y': [1,3,4,5,6], 'Z': [1,3,5,6],
  '1': [1], '2': [1,2], '3': [1,4], '4': [1,4,5], '5': [1,5],
  '0': [2,4,5], ' ': [],
}

// Dot positions in 2x3 grid (col, row): 1=(0,0), 2=(0,1), 3=(0,2), 4=(1,0), 5=(1,1), 6=(1,2)
export const DOT_POSITIONS: Record<Dot, [number, number]> = {
  1: [0, 0], 2: [0, 1], 3: [0, 2],
  4: [1, 0], 5: [1, 1], 6: [1, 2],
}

/** 返回圆点集的规范化（升序、不去重）表示，供逐条比对 */
function sortedDots(dots: readonly number[]): number[] {
  return [...dots].sort((a, b) => a - b)
}

/** 判断两组圆点是否为同一组（与选择顺序无关） */
export function isSameDots(a: readonly number[], b: readonly number[]): boolean {
  return JSON.stringify(sortedDots(a)) === JSON.stringify(sortedDots(b))
}

/** 取某字符对应的圆点（未知字符返回空数组）——字符→圆点配对的唯一入口 */
export function dotsForChar(char: string): Dot[] {
  const dots = BRAILLE_MAP[char]
  return dots ? [...dots] : []
}

/** 按圆点组反查字符：按定义顺序逐条比对，取第一个匹配；无匹配返回 '?' */
export function charForDots(dots: readonly number[]): string {
  for (const [char, charDots] of Object.entries(BRAILLE_MAP)) {
    if (isSameDots(charDots, dots)) return char
  }
  return '?'
}

export function textToBraille(text: string): Dot[][] {
  return text.toUpperCase().split('').map(dotsForChar)
}

export function brailleToText(dots: number[]): string {
  return charForDots(dots)
}

export function dotsToUnicode(dots: readonly number[]): string {
  if (!dots.length) return '⠀'
  let code = 0x2800
  for (const d of dots) code += Math.pow(2, d - 1)
  return String.fromCodePoint(code)
}
