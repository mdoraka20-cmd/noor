import { Product } from '../types';

export const MONALISA_VENDOR = 'x monalisa ceramics';

export const MONALISA_CATEGORIES = [
  'Wall',
  'Floor',
  'Decor',
  'Matching Floor',
  'Step',
  'Rustic Wall',
  'Stone Sheild Floor',
] as const;

type MonalisaSize =
  | '(8X12)'
  | '(8X24)'
  | '(10X16)'
  | '(12X12)'
  | '(12X18)'
  | '(12X24)'
  | '(16X16)'
  | '(24X24)'
  | '(24X48)'
  | '(32X32)';

type MonalisaCategory =
  | 'Wall'
  | 'Floor'
  | 'Decor'
  | 'Matching Floor'
  | 'Step'
  | 'Rustic Wall'
  | 'Stone Sheild Floor';

type MonalisaRawRow = readonly [
  productId: number,
  productName: string,
  size: MonalisaSize,
  grade: 'A' | 'B',
  typeName: MonalisaCategory,
  stockSft: number,
  closingBox: number,
  closingPcs: number
];

// Complete 11-page Stock Report for x monalisa ceramics (Stock Date: 18/11/2026)
// PDF Footer Totals: Stock(Sft) = 107895.71, Closing Cartoon|Pcs = 7403|965.35
export const MONALISA_RAW_ROWS: readonly MonalisaRawRow[] = [
  // Page 1 (24 rows)
  [1833, '2017_XML', '(8X12)', 'A', 'Wall', 333.33, 20, 0],
  [1654, '2019_XML', '(8X12)', 'A', 'Wall', 4454.65, 267, 7],
  [1247, '2020_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1295, '2026_XML', '(8X12)', 'A', 'Floor', 0, 0, 0],
  [1489, '2029_XML', '(8X12)', 'A', 'Wall', 1905.33, 114, 8],
  [1968, '2030_XML', '(8X12)', 'A', 'Wall', 76.67, 4, 15],
  [1109, '2035BR_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1376, '2035BR_XML', '(8X12)', 'B', 'Wall', 0, 0, 0],
  [1925, '2036BL_XML', '(8X12)', 'A', 'Wall', 2795.33, 167, 18],
  [974, '2080D_XML', '(8X12)', 'A', 'Wall', 153.33, 9, 4],
  [975, '2080HL-1(Flower) XML', '(8X12)', 'A', 'Decor', 73.34, 4, 10],
  [993, '2080KHL-2(Kitchen) XML', '(8X12)', 'A', 'Decor', 4, 0, 23.99],
  [973, '2080L_XML', '(8X12)', 'A', 'Wall', 0, -1, 24.99],
  [1518, '2208D_XML', '(8X12)', 'A', 'Wall', 593.33, 35, 15],
  [1516, '2208HL-1(Flower) XML', '(8X12)', 'A', 'Decor', 50.66, 3, 1],
  [1517, '2208KHL-2(Kitchen) XML', '(8X12)', 'A', 'Decor', 257.34, 15, 11],
  [1515, '2208L_XML', '(8X12)', 'A', 'Wall', 563.33, 33, 20],
  [97, '220D_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [98, '220KHL(Kitchen) XML', '(8X12)', 'A', 'Decor', 90.67, 5, 17.99],
  [96, '220L_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1364, '2222D_XML', '(8X12)', 'A', 'Wall', 1068, 64, 2.5],
  [1363, '2222HL(Flower) XML', '(8X12)', 'A', 'Decor', 356, 21, 9],
  [1362, '2222L_XML', '(8X12)', 'A', 'Wall', 830.66, 49, 21],
  [1366, '2223hl(Flower) XML', '(8X12)', 'A', 'Decor', 166.67, 10, 0],

  // Page 2 (30 rows)
  [1365, '2223L_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1263, '2254D_XML', '(8X12)', 'A', 'Wall', 845.33, 50, 18],
  [1262, '2254HL(Flower) XML', '(8X12)', 'A', 'Decor', 164.67, 9, 22],
  [1261, '2254L_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1266, '2255D_XML', '(8X12)', 'A', 'Wall', 33.33, 1, 24.93],
  [1264, '2255HL(Flower) XML', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [1265, '2255L_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [505, '225D_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [677, '225HL(Flower) XML', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [511, '225L_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1791, '2261D_XML', '(8X12)', 'A', 'Wall', 352, 21, 3],
  [1790, '2261HL(Flower) XML', '(8X12)', 'A', 'Decor', 166, 9, 24],
  [1789, '2261L_XML', '(8X12)', 'A', 'Wall', 455.34, 27, 8.01],
  [1794, '2262D_XML', '(8X12)', 'A', 'Wall', 1082.66, 64, 24],
  [1793, '2262HL(Flower) XML', '(8X12)', 'A', 'Decor', 288.67, 17, 8],
  [1792, '2262L_XML', '(8X12)', 'A', 'Wall', 483.34, 29, 0.02],
  [541, '228_D', '(8X12)', 'A', 'Wall', 50, 3, 0],
  [1807, '23000 Red_XML', '(8X12)', 'A', 'Wall', 191.33, 11, 12],
  [793, '23002_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1377, '23002_XML', '(8X12)', 'B', 'Wall', 494.67, 29, 17],
  [1107, '235D_XML', '(8X12)', 'A', 'Wall', 200, 12, 0],
  [1108, '235HL-2(Kitchen) XML', '(8X12)', 'A', 'Decor', 33.33, 2, 0],
  [1106, '235L_XML', '(8X12)', 'A', 'Wall', 166.67, 10, 0],
  [1328, '236D_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1326, '236HL(Flower) XML', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [1327, '236L_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1371, '237D_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1370, '237HL(Flower) XML', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [1369, '237L_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [940, '239D_XML', '(8X12)', 'A', 'Wall', 264.32, 15, 21.94],

  // Page 3 (29 rows)
  [939, '239HL(Flower) XML', '(8X12)', 'A', 'Decor', 339.99, 20, 10],
  [938, '239L_XML', '(8X12)', 'A', 'Wall', 0, 0, 0.98],
  [100, '277D_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [101, '277HL(Flower) XML', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [99, '277L_XML', '(8X12)', 'A', 'Wall', 33.33, 1, 0],
  [1445, '286D_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1444, '286HL-1(Flower) XML', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [1443, '286L_XML', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1448, '287D_XML', '(8X12)', 'A', 'Wall', 56.67, 3, 10],
  [1449, '287HL(Flower) XML', '(8X12)', 'A', 'Decor', 57.33, 3, 11],
  [1447, '287L_XML', '(8X12)', 'A', 'Wall', 130, 7, 20],
  [1953, '288D_XML', '(8X12)', 'A', 'Wall', 4444.67, 266, 17],
  [1952, '288HL(Flower) XML', '(8X12)', 'A', 'Decor', 981.33, 58, 22],
  [1951, '288L_XML', '(8X12)', 'A', 'Wall', 3586, 215, 4],
  [1870, '289D_XML', '(8X12)', 'A', 'Wall', 2450.66, 147, 1],
  [1868, '289HL(Flower) XML', '(8X12)', 'A', 'Decor', 643.99, 38, 15.98],
  [1869, '289HL-2(Kitchen) XML', '(8X12)', 'A', 'Decor', 487.33, 29, 6],
  [1867, '289L_XML', '(8X12)', 'A', 'Wall', 1872.65, 112, 8.98],
  [1827, 'BD2021(Flower) S.P', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [1943, '2615D_XML', '(8X24)', 'A', 'Wall', 1142.66, 85, 7],
  [1942, '2615LH-2(Kitchen) XML', '(8X24)', 'A', 'Decor', 294.67, 22, 1],
  [1941, '2615L_XML', '(8X24)', 'A', 'Wall', 909.33, 68, 2],
  [1526, '2617D_XML', '(8X24)', 'A', 'Wall', 360, 27, 0],
  [1525, '2617HL(Flower) XML', '(8X24)', 'A', 'Decor', 274.67, 20, 6],
  [1522, '2617KHL-2(Kitchen) XML', '(8X24)', 'A', 'Decor', 152, 11, 4],
  [1521, '2617L_XML', '(8X24)', 'A', 'Wall', 552.01, 41, 4],
  [1523, '2618D_XML', '(8X24)', 'A', 'Wall', 1012, 75, 9],
  [1535, '2618HL(Flower) XML', '(8X24)', 'A', 'Decor', 138.67, 10, 4],
  [1534, '2618L_XML', '(8X24)', 'A', 'Wall', 370.22, 27, 7.67],

  // Page 4 (30 rows)
  [1166, '2511_XML', '(10X16)', 'A', 'Wall', 295.56, 26, 6],
  [947, '2513_XML', '(10X16)', 'A', 'Wall', 0, 0, 0],
  [963, '2514_XML', '(10X16)', 'A', 'Wall', 75.54, 6, 8],
  [1511, '2520HL(Flower) XML', '(10X16)', 'A', 'Decor', 330, 29, 7],
  [1635, '2520_XML', '(10X16)', 'B', 'Wall', 2704.47, 243, 4.03],
  [1510, '2520_XML', '(10X16)', 'A', 'Floor', 0, 0, 0],
  [1375, '3002_XML', '(12X12)', 'B', 'Floor', 320, 20, 0],
  [1374, '300_XML', '(12X12)', 'B', 'Floor', 0, 0, 0],
  [678, '300_XML', '(12X12)', 'A', 'Floor', 240, 15, 0],
  [1196, '3081_XML', '(12X12)', 'A', 'Matching Floor', 23, 1, 7],
  [506, '3084_XML', '(12X12)', 'A', 'Matching Floor', 0, 0, 14],
  [1068, '3095_XML', '(12X12)', 'A', 'Matching Floor', 0, 0, 0],
  [1687, '3096_XML', '(12X12)', 'A', 'Matching Floor', 0, 0, 0],
  [542, '360_STP_XM', '(12X12)', 'A', 'Step', 0, 0, 0],
  [1148, '3641_XML', '(12X12)', 'A', 'Matching Floor', 0, 0, 0],
  [109, 'MOD 353/351_XML', '(12X12)', 'A', 'Floor', 0, 0, 1],
  [1401, 'MOD 353_XML', '(12X12)', 'B', 'Floor', 64, 6, 4],
  [108, 'MOD 355/350_XML', '(12X12)', 'A', 'Floor', 0, 0, 8],
  [1402, 'MOD 355_XML', '(12X12)', 'B', 'Floor', 142, 14, 2],
  [1344, 'MOD 356_XML', '(12X12)', 'B', 'Floor', 218, 21, 8],
  [986, 'MOD 356_XML', '(12X12)', 'A', 'Floor', 160, 16, 9],
  [1373, 'MOD 357_XML', '(12X12)', 'B', 'Floor', 0, 0, 0],
  [936, 'MOD 357_XML', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [1345, 'MOD 358_XML', '(12X12)', 'B', 'Floor', 0, 0, 0],
  [657, 'MOD 358_XML', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [1500, 'MOD 359_XML', '(12X12)', 'B', 'Floor', 95, 9, 5],
  [1391, 'MOD 360R_XML', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [1392, 'MOD 361Y_XML', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [1504, 'MOD 361Y_XML', '(12X12)', 'B', 'Floor', 0, 0, 0],
  [1571, 'MOD 362BK_XML', '(12X12)', 'A', 'Floor', 439, 43, 9],

  // Page 5 (30 rows)
  [1505, 'MOD 362BK_XML', '(12X12)', 'B', 'Floor', 0, 0, 0],
  [1346, 'MOD 364_XML', '(12X12)', 'B', 'Floor', 0, 0, 1],
  [1372, 'MOD 364_XML', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [1665, 'MODN 353_XML', '(12X12)', 'B', 'Floor', 0, 0, 1],
  [1721, 'MODN 353_XML', '(12X12)', 'A', 'Floor', 224, 19, 5],
  [1666, 'MODN 355_XML', '(12X12)', 'B', 'Floor', 24, 2, 3],
  [1732, 'MODN 355_XML', '(12X12)', 'A', 'Floor', 660, 55, 0],
  [1652, 'MODN 356_XML', '(12X12)', 'A', 'Floor', 314, 27, 0],
  [1667, 'MODN 356_XML', '(12X12)', 'B', 'Floor', 457, 38, 9],
  [1777, 'MODN 357_XML', '(12X12)', 'B', 'Floor', 51, 4, 3],
  [1855, 'MODN 358_XML', '(12X12)', 'B', 'Floor', 0, 0, 0],
  [1834, 'MODN 359_ML', '(12X12)', 'B', 'Floor', 48, 4, 0],
  [1804, 'MODN 360R_XML', '(12X12)', 'A', 'Floor', 39, 3, 3],
  [1722, 'MODN 360R_XML', '(12X12)', 'B', 'Floor', 165, 14, 7],
  [1862, 'MODN 362BK_XML', '(12X12)', 'A', 'Floor', 383, 31, 11],
  [1723, 'MODN 362BK_XML', '(12X12)', 'B', 'Floor', 144, 12, 0],
  [1835, 'MODN 363_XML', '(12X12)', 'B', 'Floor', 6, 0, 6],
  [1872, 'MODN 363_XML', '(12X12)', 'A', 'Wall', 0, 0, 0],
  [1848, 'MODN 364_XML', '(12X12)', 'B', 'Floor', 628, 52, 4],
  [1811, 'MODN 365', '(12X12)', 'A', 'Floor', 8, 0, 8],
  [1668, 'MODN 365_XML', '(12X12)', 'B', 'Floor', 327, 27, 4],
  [1967, 'MODN 366_XML', '(12X12)', 'B', 'Floor', 468, 39, 0],
  [279, '3003DL_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [1572, '3012D_XML', '(12X18)', 'A', 'Wall', 68.7, 5, 5.8],
  [1573, '3012D_XML', '(12X18)', 'B', 'Wall', 0, 0, 0],
  [1574, '3012HL(Flower) XML', '(12X18)', 'A', 'Decor', 30, 2, 4],
  [1575, '3012L_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [1576, '3012L_XML', '(12X18)', 'B', 'Wall', 0, 0, 0],
  [1847, '3014D_XML', '(12X18)', 'A', 'Wall', 1629, 135, 6],
  [1846, '3014HL(Scenery) XML', '(12X18)', 'A', 'Decor', 448.5, 37, 3],

  // Page 6 (30 rows)
  [1845, '3014L_XML', '(12X18)', 'A', 'Wall', 1492.5, 124, 3],
  [1320, '3020D_XML', '(12X18)', 'A', 'Wall', 1494, 124, 4],
  [1321, '3020HL(Flower) XML', '(12X18)', 'A', 'Decor', 378, 31, 4],
  [1319, '3020L_XML', '(12X18)', 'A', 'Wall', 904.5, 75, 3],
  [1317, '3034D_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [1318, '3034HL(Flower) XML', '(12X18)', 'A', 'Decor', 0, 0, 0],
  [1316, '3034L_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [174, '3040HL(Flower) XML', '(12X18)', 'A', 'Decor', 0, 0, 0],
  [173, '3040_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [176, '3041D_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [177, '3041HL(Flower) XML', '(12X18)', 'A', 'Decor', 0, 0, 2],
  [175, '3041L_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [1268, '3066BR_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [569, '3076GY_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [733, '3081D_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [734, '3081HL(Flower) XML', '(12X18)', 'A', 'Decor', 0, 0, 0],
  [732, '3081L_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [179, '3084D_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [180, '3084HL(Flower) XML', '(12X18)', 'A', 'Decor', 18, 2, 3],
  [178, '3084L_XML', '(12X18)', 'A', 'Wall', 120, 10, 0],
  [658, '3085GY_XML', '(12X18)', 'A', 'Wall', 192, 16, 0],
  [1842, '3085YL_XML', '(12X18)', 'A', 'Wall', 180, 15, 0],
  [1577, '3088HL-2(Flower) XML', '(12X18)', 'B', 'Decor', 0, 0, 0],
  [1579, '3088HL-2(Flower) XML', '(12X18)', 'A', 'Decor', 832.5, 69, 3],
  [1578, '3088_XML', '(12X18)', 'B', 'Wall', 0, 0, 0],
  [1580, '3088_XML', '(12X18)', 'A', 'Wall', 837, 69, 6],
  [182, '3095D_XML', '(12X18)', 'A', 'Wall', 24, 0, 7.33],
  [183, '3095HL(Flower) XML', '(12X18)', 'A', 'Decor', 0, 0, 3],
  [181, '3095L_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [1470, '3096D_XML', '(12X18)', 'A', 'Wall', 477, 39, 6],

  // Page 7 (29 rows)
  [1097, '3096HL(Flower) XML', '(12X18)', 'A', 'Decor', 232.5, 19, 3],
  [1469, '3096L_XML', '(12X18)', 'A', 'Wall', 472.5, 39, 3],
  [185, '3097D_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [296, '3097HL(Flower) XML', '(12X18)', 'A', 'Decor', 0, 0, 6.66],
  [486, '3097KHL-1(Kitchen) XML', '(12X18)', 'A', 'Decor', 0, 0, 0],
  [184, '3097L_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [1170, '3201HL(Flower) XML', '(12X18)', 'A', 'Decor', 0, 0, 0],
  [1169, '3201_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [1619, '3234HL(Flower) XML', '(12X18)', 'A', 'Decor', 0, 0, 0],
  [1618, '3234_XML', '(12X18)', 'A', 'Wall', 58.5, 4, 7],
  [776, '3472KHL(Kitchen) XML', '(12X18)', 'A', 'Decor', 0, 0, 0],
  [775, '3472_XML', '(12X18)', 'A', 'Wall', 0, 0, 0],
  [1134, '30607D_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1133, '30607HL(Flower) XML', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [1132, '30607L_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1136, '30608HL(Flower) XML', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [1135, '30608_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [274, '3501D_XML', '(12X24)', 'A', 'Wall', 174, 14, 3],
  [275, '3501HL(Flower) XML', '(12X24)', 'A', 'Decor', 382, 32, 0],
  [273, '3501L_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [277, '3503D_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [278, '3503HL(Flower) XML', '(12X24)', 'A', 'Decor', 0, 0, 3],
  [276, '3503L_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [271, '3608_XML', '(12X24)', 'A', 'Wall', 790, 65, 5.5],
  [659, '3609_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [272, '3616_XML', '(12X24)', 'A', 'Wall', 744, 62, 0],
  [104, '3630D_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [103, '3630HL(Flower) XML', '(12X24)', 'A', 'Decor', 0, -1, 4],
  [102, '3630L_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],

  // Page 8 (29 rows)
  [106, '3635HL-2(Flower) XML', '(12X24)', 'A', 'Decor', 142, 12, 2],
  [107, '3635KHL-1(Kitchen) XML', '(12X24)', 'A', 'Decor', 16, 1, 2],
  [105, '3635_XML', '(12X24)', 'A', 'Wall', 476, 36, 0],
  [1130, '3641D_XML', '(12X24)', 'A', 'Wall', 768, 64, 0],
  [1131, '3641HL(Flower) XML', '(12X24)', 'A', 'Decor', 974, 81, 1],
  [1427, '3641HL(Flower) XML', '(12X24)', 'B', 'Decor', 0, 0, 0],
  [1129, '3641L_XML', '(12X24)', 'A', 'Wall', 954, 79, 3],
  [1096, '3643D_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1095, '3643HL(Flower) XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1094, '3643L_XML', '(12X24)', 'A', 'Wall', 10, 0, 5],
  [1605, '3655D_A_XML', '(12X24)', 'A', 'Wall', 920, 76, 4],
  [1606, '3655HL-2(Kitchen) XML', '(12X24)', 'A', 'Decor', 226, 18, 5],
  [1604, '3655L_XML', '(12X24)', 'A', 'Wall', 676, 56, 2],
  [1608, '3657D_XML', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [1609, '3657HL(Fish) XML', '(12X24)', 'A', 'Decor', 12, 1, 0],
  [1607, '3657L_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1893, '3662D_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1892, '3662HL(Flower) XML', '(12X24)', 'A', 'Decor', 36, 3, 0],
  [1923, '3662HL-2(Kitchen) XML', '(12X24)', 'A', 'Wall', 12, 1, 0],
  [1891, '3662L_XML', '(12X24)', 'A', 'Wall', 676, 56, 2],
  [1900, '3663D_XML', '(12X24)', 'A', 'Wall', 2238, 186, 3],
  [1899, '3663HL(Scenaey) XML', '(12X24)', 'A', 'Decor', 778, 64, 5],
  [1898, '3663L_XML', '(12X24)', 'A', 'Wall', 1792, 149, 2],
  [1961, '601_STP_XML', '(12X24)', 'A', 'Step', 462, 28, 7],
  [1960, '601_XML', '(12X24)', 'A', 'Floor', 462, 28, 7],
  [1915, '602_STP_XML', '(12X24)', 'A', 'Step', 710, 44, 3],
  [1916, '602_XML', '(12X24)', 'A', 'Floor', 86, 5, 3],
  [1216, '619_STP', '(12X24)', 'B', 'Step', 346, 21, 5],
  [1120, '619_STP_XML', '(12X24)', 'A', 'Step', 0, 0, 0],

  // Page 9 (25 rows)
  [935, '631W_XML', '(12X24)', 'A', 'Rustic Wall', 0, 0, 0],
  [1012, '640W_XML', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1709, '641W_XML', '(12X24)', 'A', 'Rustic Wall', 0, 0, 0],
  [1128, '650_STP_XML', '(12X24)', 'A', 'Step', 20, 1, 2],
  [1699, '650_STP_XML', '(12X24)', 'B', 'Step', 12, 0, 6],
  [1139, '650_XML', '(12X24)', 'A', 'Floor', 0, 0, 0],
  [1185, '650_XML', '(12X24)', 'B', 'Floor', 0, 0, 0],
  [1415, '4000_XML', '(16X16)', 'B', 'Floor', 0, 0, 0],
  [1426, '4000_XML', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [1403, '4014_XML', '(16X16)', 'B', 'Floor', 812.44, 57, 1],
  [1502, '4015_XML', '(16X16)', 'B', 'Floor', 101.34, 7, 1],
  [1610, '4018_XML', '(16X16)', 'B', 'Stone Sheild Floor', 577.78, 40, 5],
  [723, '4052_XML', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [1588, '4086_XML', '(16X16)', 'A', 'Stone Sheild Floor', 403.56, 28, 3],
  [1831, '4087_XML', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [1589, '4096_XML', '(16X16)', 'A', 'Stone Sheild Floor', 0, 0, 0.87],
  [1645, '4097_XML', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [1620, '4099_XML', '(16X16)', 'A', 'Floor', 12.44, 0, 7],
  [1176, '4118_XML', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [1499, '4118_XML', '(16X16)', 'B', 'Floor', 0, 0, 0],
  [1587, '430641_XML', '(16X16)', 'A', 'Matching Floor', 1317.33, 92, 4.99],
  [1287, 'MST4010_XML', '(16X16)', 'B', 'Stone Sheild Floor', 1962.67, 138, 0],
  [110, 'MST4010_XML', '(16X16)', 'A', 'Stone Sheild Floor', 1258.66, 88, 4],
  [111, 'MST4014_XML', '(16X16)', 'A', 'Stone Sheild Floor', 14.22, 151, 0],
  [112, 'MST4018_XML', '(16X16)', 'A', 'Stone Sheild Floor', 936.34, 165, 6.69],

  // Page 10 (29 rows)
  [441, 'MST4021_XML', '(16X16)', 'A', 'Stone Sheild Floor', 0, 0, 0.75],
  [1669, '6001_XML', '(24X24)', 'A', 'Floor', 592, 37, 0],
  [1708, '6001_XML', '(24X24)', 'B', 'Floor', 2300, 143, 3],
  [1770, '6005_XML', '(24X24)', 'B', 'Floor', 816, 51, 0],
  [1532, '6005_XML', '(24X24)', 'A', 'Floor', 832, 51, 3.75],
  [1539, '6008_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [113, '6010_XML', '(24X24)', 'A', 'Floor', 144, 9, 0],
  [1738, '6011_XML', '(24X24)', 'A', 'Floor', 8, 0, 2],
  [1119, '6019_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1228, '6019_XML', '(24X24)', 'B', 'Floor', 8, 0, 2],
  [1231, '6021_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1378, '6027_XML', '(24X24)', 'B', 'Floor', 60, 31, 2.25],
  [969, '6027_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1194, '6030_XML', '(24X24)', 'A', 'Floor', 72, 4, 2],
  [808, '6033_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [749, '6037_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1192, '6046_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [399, '6047_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1637, '6048_XML', '(24X24)', 'B', 'Floor', 20, 1, 1],
  [1739, '6048_XML', '(24X24)', 'A', 'Floor', 736, 46, 0],
  [1026, '6049_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1270, '6049_XML', '(24X24)', 'B', 'Floor', 72, 4, 2],
  [1101, '6050_XML', '(24X24)', 'A', 'Floor', 660, 41, 0],
  [1393, '6050_XML', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1330, '6051_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1267, '6052_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1054, '6054_G.W', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1276, '6055_XML', '(24X24)', 'A', 'Floor', 296, 18, 2],
  [1229, '6057_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],

  // Page 11 (29 rows)
  [1497, '6058_XML', '(24X24)', 'A', 'Floor', 784, 49, 0],
  [1351, '6061_XML', '(24X24)', 'A', 'Floor', 320, 20, 0],
  [1725, '6062_XML', '(24X24)', 'A', 'Floor', 16, 1, 0],
  [1907, '6064_XML', '(24X24)', 'B', 'Floor', 448, 28, 0],
  [1908, '6064_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [507, '6091_XML', '(24X24)', 'A', 'Floor', 6, 0, 1.5],
  [1352, '6102_XML', '(24X24)', 'B', 'Floor', 164, 10, 1],
  [114, '6102_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1353, '6103_XML', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [115, '6103_XML', '(24X24)', 'A', 'Floor', 28, 57, 3],
  [1193, '6111_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1744, '6219_XML', '(24X24)', 'B', 'Floor', 2496, 156, 0],
  [1752, '6219_XML', '(24X24)', 'A', 'Floor', 1034, 64, 2.25],
  [941, '6301_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1710, '6510_XML', '(24X24)', 'A', 'Floor', 16, 1, 0],
  [1771, '6512_XML', '(24X24)', 'A', 'Floor', 220, 13, 3],
  [1841, '6513_XML', '(24X24)', 'A', 'Floor', 52, 3, 1],
  [1909, '6515_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1853, '6517_XML', '(24X24)', 'A', 'Floor', 3516, 219, 3],
  [1854, '6517_XML', '(24X24)', 'B', 'Floor', 156, 9, 3],
  [1860, '6518_XML', '(24X24)', 'A', 'Floor', 1020, 63, 3],
  [1931, '6518_XML', '(24X24)', 'B', 'Floor', 1024, 64, 0],
  [1889, '6519_XML', '(24X24)', 'A', 'Floor', 1328, 83, 0],
  [1818, '660001 MR_XML', '(24X24)', 'B', 'Floor', 420, 26, 0],
  [1720, '660001 MR_XML', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1121, '66623_XML', '(24X24)', 'A', 'Floor', 152, 9, 2],
  [1926, 'NC 02_SCL', '(24X24)', 'A', 'Floor', 2244, 140, 1],
  [892, '1206_XML', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1078, '8060_XML', '(32X32)', 'A', 'Floor', 0, 0, 0],
];

function inferMonalisaPackMetrics(
  size: MonalisaSize,
  productName: string,
  typeName: MonalisaCategory,
  stockSft: number,
  closingBox: number,
  closingPcs: number
): { w: number; h: number; qtyPack: number; sftPack: number } {
  const match = size.match(/\((\d+)X(\d+)\)/);
  const w = match ? Number(match[1]) : 12;
  const h = match ? Number(match[2]) : 12;
  const pieceSft = (w * h) / 144;

  let defaultQty = 4;
  switch (size) {
    case '(8X12)':
      defaultQty = 25;
      break;
    case '(8X24)':
      defaultQty = 10;
      break;
    case '(10X16)':
      defaultQty = 10;
      break;
    case '(12X12)':
      if (productName.startsWith('MODN ')) defaultQty = 12;
      else if (productName.startsWith('MOD ')) defaultQty = 10;
      else defaultQty = 16;
      break;
    case '(12X18)':
      defaultQty = 8;
      break;
    case '(12X24)':
      defaultQty = typeName === 'Floor' || typeName === 'Step' ? 8 : 6;
      break;
    case '(16X16)':
      defaultQty = 8;
      break;
    case '(24X24)':
      defaultQty = 4;
      break;
    case '(24X48)':
      defaultQty = 2;
      break;
    case '(32X32)':
      defaultQty = 2;
      break;
  }

  let qtyPack = defaultQty;
  if (closingBox >= 1 && stockSft > 0 && pieceSft > 0) {
    const inferred = Math.round((stockSft / pieceSft - Math.max(0, closingPcs)) / closingBox);
    if (inferred >= 1 && inferred <= 40) {
      const expected = (closingBox * inferred + Math.max(0, closingPcs)) * pieceSft;
      if (Math.abs(expected - stockSft) <= pieceSft * 1.5) {
        qtyPack = inferred;
      }
    }
  }

  const sftPack = Math.round(qtyPack * pieceSft * 10000) / 10000;
  return { w, h, qtyPack, sftPack };
}

export const MONALISA_PRODUCTS: Product[] = MONALISA_RAW_ROWS.map(
  ([productId, productName, size, grade, typeName, stockSft, closingBox, closingPcs]) => {
    const { w, h, qtyPack, sftPack } = inferMonalisaPackMetrics(
      size,
      productName,
      typeName,
      stockSft,
      closingBox,
      closingPcs
    );
    const hasNegativeBalance = closingBox < 0;
    const normalizedBox = hasNegativeBalance ? 0 : Math.max(0, closingBox);
    const normalizedPcs = hasNegativeBalance ? 0 : Math.max(0, closingPcs);
    const normalizedSft = Math.max(0, stockSft);

    return {
      id: productId,
      code: `${productName}_${grade}`,
      category: typeName,
      vendor: MONALISA_VENDOR,
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
