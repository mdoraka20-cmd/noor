import { Product } from '../types';

export const RAK_VENDOR = 'RAK CERAMICS LTD.';

export const RAK_CATEGORIES = [
  'Floor',
  'Step',
  'Wall',
  'Decor',
] as const;

type RakRawRow = readonly [
  productId: number,
  productName: string,
  size: '(12X24)' | '(16X16)' | '(24X24)',
  grade: 'A' | 'B',
  typeName: 'Floor' | 'Step' | 'Wall' | 'Decor',
  stockSft: number,
  closingBox: number,
  closingPcs: number
];

// Complete 13-row Stock Report for RAK CERAMICS LTD. (Stock Date: 18/11/2026)
// PDF Footer Totals: Stock(Sft) = 24490, Closing Cartoon|Pcs = 1353|17
export const RAK_RAW_ROWS: readonly RakRawRow[] = [
  [1928, '9 GP 01_RAK', '(12X24)', 'A', 'Floor', 1840, 115, 0],
  [1929, '9 GP 01_STP_RAK', '(12X24)', 'A', 'Step', 996, 62, 2],
  [1950, 'Vista 20DK_RAK', '(12X24)', 'A', 'Wall', 720, 45, 0],
  [1948, 'Vista 20HL(Flower) RAK', '(12X24)', 'A', 'Decor', 210, 13, 1],
  [1949, 'Vista 20KHL(Kitchen) RAK', '(12X24)', 'A', 'Decor', 108, 6, 6],
  [1947, 'Vista 20LT_RAK', '(12X24)', 'A', 'Wall', 704, 44, 0],
  [1965, '7 GP 406_RAK', '(16X16)', 'A', 'Floor', 5120, 288, 0],
  [1921, 'Apollo 17_RAK', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1930, 'Apollo 22_RAK', '(24X24)', 'A', 'Floor', 2316, 144, 3],
  [1918, 'Apollo 24_RAK', '(24X24)', 'A', 'Floor', 4512, 282, 0],
  [1922, 'Classic 05_RAK', '(24X24)', 'A', 'Floor', 4444, 277, 3],
  [1920, 'Classic Super 37_RAK', '(24X24)', 'A', 'Floor', 1240, 77, 2],
  [1966, 'Classic Super 38_RAK', '(24X24)', 'A', 'Floor', 0, 0, 0],
];

function getRakPackMetrics(
  size: RakRawRow[2]
): { w: number; h: number; qtyPack: number; sftPack: number } {
  switch (size) {
    case '(12X24)':
      return { w: 12, h: 24, qtyPack: 8, sftPack: 16 };
    case '(16X16)':
      return { w: 16, h: 16, qtyPack: 10, sftPack: 17.7778 };
    case '(24X24)':
      return { w: 24, h: 24, qtyPack: 4, sftPack: 16 };
  }
}

export const RAK_PRODUCTS: Product[] = RAK_RAW_ROWS.map(
  ([productId, productName, size, grade, typeName, stockSft, closingBox, closingPcs]) => {
    const { w, h, qtyPack, sftPack } = getRakPackMetrics(size);
    const hasNegativeBalance = closingBox < 0 && stockSft <= 0;
    const normalizedBox = hasNegativeBalance ? 0 : Math.max(0, closingBox);
    const normalizedPcs = hasNegativeBalance ? 0 : Math.max(0, closingPcs);
    const normalizedSft = Math.max(0, stockSft);

    return {
      id: productId,
      code: `${productName}_${grade}`,
      category: typeName,
      vendor: RAK_VENDOR,
      grade,
      name: `${productName} (Grade ${grade})`,
      isTile: true,
      w,
      h,
      scm: 0,
      sftPack,
      qtyPack,
      rate: 0,
      price: 0,
      stockBox: normalizedBox,
      stockPiece: normalizedPcs,
      stockSft: normalizedSft,
    };
  }
);
