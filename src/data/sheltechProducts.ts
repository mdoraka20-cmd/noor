import { Product } from '../types';

export const SHELTECH_VENDOR = 'SHELTECH CERAMICS LTD.';

export const SHELTECH_CATEGORIES = [
  'Wall',
  'Decor',
  'Rustic Wall',
  'Floor',
  'Step',
  'Matching Floor',
] as const;

type SheltechSize =
  | '(8X12)'
  | '(8X20)'
  | '(10X16)'
  | '(12X12)'
  | '(12X24)'
  | '(12X48)'
  | '(16X16)'
  | '(24X24)'
  | '(24X48)'
  | '(32X32)'
  | '(40X40)';

type SheltechRawRow = readonly [
  productId: number,
  productName: string,
  size: SheltechSize,
  grade: 'A' | 'B',
  typeName: 'Wall' | 'Decor' | 'Rustic Wall' | 'Floor' | 'Step' | 'Matching Floor',
  stockSft: number,
  closingBox: number,
  closingPcs: number
];

// Complete 13-page Stock Report for SHELTECH CERAMICS LTD. (Stock Date: 18/11/2026)
// PDF Footer Totals: Stock(Sft) = 110468.36, Closing Cartoon|Pcs = 6821|868.66
export const SHELTECH_RAW_ROWS: readonly SheltechRawRow[] = [
  // Page 1 (25 rows)
  [409, '2100 TBK_SCL', '(8X12)', 'B', 'Wall', 0, 0, 0],
  [161, '2100 TBK_SCL', '(8X12)', 'A', 'Wall', 49.33, 2, 23],
  [410, '2100 TBL_SCL', '(8X12)', 'B', 'Wall', 0, 0, 0],
  [162, '2100 TBL_SCL', '(8X12)', 'A', 'Wall', 8, 0, 12],
  [962, '2121L_STC', '(8X12)', 'B', 'Wall', 0, -1, 24.99],
  [488, '2138D_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [489, '2138HL(Flower) STC', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [648, '2138KHL(Kitchen) STC', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [487, '2138L_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1360, '2144D_SCL', '(8X12)', 'A', 'Wall', 0, 0, 12],
  [1358, '2144HL(Flower) SCL', '(8X12)', 'A', 'Decor', 83.33, 5, 11],
  [1359, '2144KHL(Kitchen) SCL', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [1357, '2144L_SCL', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1484, '2145D_SCL', '(8X12)', 'A', 'Wall', 229.33, 14, 14],
  [1485, '2145HL(Flower) SCL', '(8X12)', 'A', 'Decor', 365.33, 22, 7],
  [1486, '2145KHL(Kitchen) SCL', '(8X12)', 'A', 'Decor', 4.67, 0, 7],
  [1483, '2145L_SCL', '(8X12)', 'A', 'Wall', 130.67, 7, 21],
  [855, '2147D_SCL', '(8X12)', 'A', 'Wall', 184, 11, 0.5],
  [838, '2147HL(Flower) SCL', '(8X12)', 'A', 'Decor', 75.33, 4, 13],
  [839, '2147KHL(Kitchen) SCL', '(8X12)', 'A', 'Decor', 126.67, 7, 15],
  [837, '2147L_SCL', '(8X12)', 'A', 'Wall', 87.33, 5, 16],
  [167, '2300 BK_SCL', '(8X12)', 'A', 'Wall', 5.33, 0, 8],
  [168, '2300 BK_SCL', '(8X12)', 'B', 'Wall', 0, 0, 0],
  [165, '2300 BL_SCL', '(8X12)', 'A', 'Wall', 0, 0, 14.98],
  [166, '2300 BL_SCL', '(8X12)', 'B', 'Wall', 0, 0, 4],

  // Page 2 (30 rows)
  [169, '2300 MR_SCL', '(8X12)', 'A', 'Wall', 3631.33, 217, 22.83],
  [170, '2300 MR_SCL', '(8X12)', 'B', 'Wall', 0, 0, 0],
  [164, '2300 WBL_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1348, '2300 WHT_SCL', '(8X12)', 'B', 'Wall', 133.33, 8, 0],
  [163, '2300 WHT_SCL', '(8X12)', 'A', 'Wall', 0, 0, 5.99],
  [946, '2301_SCL', '(8X12)', 'B', 'Wall', 0, 0, 0],
  [447, '2301_SCL', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [171, '2305_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [172, '2378_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [442, '2378_STC', '(8X12)', 'B', 'Wall', 0, 0, 0],
  [568, '2379D_STC', '(8X12)', 'B', 'Wall', 0, 0, 0],
  [418, '2379D_STC', '(8X12)', 'A', 'Wall', 318, 19, 2],
  [419, '2379HL(Flower) STC', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [420, '2379KHL(Kitchen) STC', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [1361, '2379L_STC', '(8X12)', 'B', 'Wall', 0, 0, 0],
  [417, '2379L_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1211, '2385D_STC', '(8X12)', 'A', 'Wall', 165.33, 9, 23],
  [1212, '2385HL(Flower) STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1219, '2385KHL(Kitchen) STC', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [1210, '2385L_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1214, '2387D_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1215, '2387HL(Flower) STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1290, '2387KHL(Kitchen) STC', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [1213, '2387L_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1436, '2388_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1451, '2394D_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1452, '2394HL(Flower) STC', '(8X12)', 'A', 'Decor', 0, 0, 0],
  [1450, '2394L_STC', '(8X12)', 'A', 'Wall', 0, 0, 0],
  [1456, '2395HL(Flower) SCL', '(8X12)', 'A', 'Decor', 386.67, 23, 7],
  [1455, '2395_SCL', '(8X12)', 'A', 'Wall', 74.66, 4, 12.5],

  // Page 3 (30 rows)
  [1457, '2395_SCL', '(8X12)', 'B', 'Wall', 56, 4, 8],
  [1763, 'PC 02D_SCL', '(8X12)', 'A', 'Wall', 223.33, 13, 17],
  [1764, 'PC 02HL(Flower) SCL', '(8X12)', 'A', 'Decor', 0, 0, 2.99],
  [1765, 'PC 02KHL(Flower) SCL', '(8X12)', 'A', 'Decor', 0, 0, 21.99],
  [1762, 'PC 02L_SCL', '(8X12)', 'A', 'Wall', 306.67, 18, 10],
  [1775, 'PC 03D_SCL', '(8X12)', 'A', 'Wall', 519.33, 31, 10.01],
  [1773, 'PC 03HL(Flower) SCL', '(8X12)', 'A', 'Decor', 275.33, 17, 9],
  [1774, 'PC 03KHL(Kitchen) SCL', '(8X12)', 'A', 'Decor', 251.33, 15, 20.01],
  [1772, 'PC 03L_SCL', '(8X12)', 'A', 'Wall', 210.67, 13, 0.01],
  [1767, 'PC 05D_SCL', '(8X12)', 'A', 'Wall', 80.67, 5, 10.99],
  [1768, 'PC 05HL-2(Scenery) SCL', '(8X12)', 'A', 'Decor', 0, 0, 14.99],
  [1766, 'PC 05L_SCL', '(8X12)', 'A', 'Wall', 4.01, 0, 6.01],
  [1873, 'PC 51_SCL', '(8X12)', 'A', 'Wall', 3418, 205, 10],
  [1871, 'PC 52_SCL', '(8X12)', 'A', 'Wall', 516.66, 31, 0],
  [1019, '2510_STC', '(8X20)', 'A', 'Wall', 0, 0, 0],
  [146, '2513D_STC', '(8X20)', 'A', 'Wall', 0, 0, 0],
  [147, '2513HL(Flower) STC', '(8X20)', 'A', 'Decor', 0, 0, 0],
  [145, '2513L_STC', '(8X20)', 'A', 'Wall', 0, 0, 0],
  [1023, '2522HL(Flower) STC', '(8X20)', 'A', 'Decor', 0, 0, 0],
  [1022, '2522_STC', '(8X20)', 'A', 'Wall', 0, 0, 0.4],
  [149, '2532_STC', '(8X20)', 'A', 'Rustic Wall', 0, 0, 0],
  [1122, '2421_STC', '(10X16)', 'A', 'Wall', 0, 0, 0],
  [1069, '2423_SCL', '(10X16)', 'A', 'Wall', 0.01, 0, 5.1],
  [1440, '2423_SCL', '(10X16)', 'B', 'Wall', 0, 0, 0],
  [813, '2446D_STC', '(10X16)', 'A', 'Wall', 0, 0, 0],
  [815, '2446HL(Flower) STC', '(10X16)', 'A', 'Decor', 0, 0, 0],
  [814, '2446KHL(Kitchen) STC', '(10X16)', 'A', 'Decor', 0, 0, 0],
  [812, '2446L_STC', '(10X12)'.replace('12', '16') as SheltechSize, 'A', 'Wall', 0, 0, 0],
  [1601, '523LG_G.W', '(10X16)', 'A', 'Wall', 0, 0, 0],
  [1779, 'EN 04_SCL', '(10X16)', 'A', 'Floor', 0, 0, 0],

  // Page 4 (30 rows)
  [1563, 'EN 05D_SCL', '(10X16)', 'A', 'Wall', 0, 0, 0],
  [1562, 'EN 05HL(Flower) SCL', '(10X16)', 'A', 'Decor', 0, 0, 0],
  [1561, 'EN 05L_SCL', '(10X16)', 'A', 'Wall', 0, 0, 0],
  [1621, 'EN02_STC', '(10X16)', 'A', 'Wall', 0, 0, 0],
  [1622, 'EN51_STC', '(10X16)', 'A', 'Wall', 0, 0, 0],
  [1658, 'PC 422D_SCL', '(10X16)', 'A', 'Wall', 174.44, 11, 2],
  [1656, 'PC 422HL(Flower) SCL', '(10X16)', 'A', 'Decor', 132.22, 8, 11],
  [1657, 'PC 422KHL(KIitchen) SCL', '(10X16)', 'A', 'Decor', 0, 0, 14],
  [1655, 'PC 422L_SCL', '(10X16)', 'A', 'Wall', 5.56, 1, 3],
  [1693, 'PC 471_SCL', '(10X16)', 'A', 'Rustic Wall', 0, 0, 0],
  [717, '2601BK_STP_STC', '(12X12)', 'A', 'Step', 0, 0, 0],
  [436, '2601_STP_STC', '(12X12)', 'A', 'Step', 0, 0, 5],
  [735, '2601_STP_STC', '(12X12)', 'B', 'Step', 0, 0, 0],
  [474, '2602_STP_STC', '(12X12)', 'A', 'Step', 398, 20, 18],
  [477, '2603_STP_STC', '(12X12)', 'A', 'Step', 0, 0, 0],
  [520, '3301BK_SCL', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [791, '3301_SCL', '(12X12)', 'B', 'Floor', 0, 0, 0],
  [124, '3301_SCL', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [125, '3302_STC', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [126, '3303_STC', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [389, 'PHD-3302_STC', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [390, 'PHD-3302_STC', '(12X12)', 'B', 'Floor', 0, 0, 0],
  [1623, 'PV 01_SCL', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [1528, 'PV 01_SCL', '(12X12)', 'B', 'Floor', 224, 14, 10],
  [799, 'PV 02_SCL', '(12X12)', 'A', 'Floor', 2366, 148, 2],
  [1527, 'PV 02_SCL', '(12X12)', 'B', 'Floor', 112, 7, 0],
  [127, 'PV 07_SCL', '(12X12)', 'A', 'Floor', 22, 1, 14],
  [128, 'PV 08_SCL', '(12X12)', 'A', 'Floor', 0, 0, 15],
  [433, 'PV 10BK_SCL', '(12X12)', 'A', 'Floor', 199, 12, 15],
  [136, '3629D_STC', '(12X24)', 'A', 'Wall', 0, 0, 0],

  // Page 5 (28 rows)
  [137, '3629HL(Flower) STC', '(12X24)', 'A', 'Decor', 126, 7, 4.5],
  [135, '3629L_STC', '(12X24)', 'A', 'Wall', 210, 13, 1],
  [290, '3633HL(Flower) STC', '(12X24)', 'A', 'Decor', 0, -1, 0],
  [288, '3633_STC', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [995, '3657D_STC', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [996, '3657HL(Flower) STC', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [994, '3657L_STC', '(12X24)', 'A', 'Wall', 436, 27, 2],
  [944, '6601BK_STP_SCL', '(12X24)', 'A', 'Step', 0, 0, 0],
  [948, '6601BK_STP_SCL', '(12X24)', 'B', 'Step', 46, 2, 7],
  [1037, '6601_STP_SCL', '(12X24)', 'B', 'Step', 4, 0, 2],
  [291, '6601_STP_SCL', '(12X24)', 'A', 'Step', 5320, 332, 5],
  [747, '6658_STP_STC', '(12X24)', 'A', 'Step', 14, -1, 7],
  [1595, 'Alpine 10D_SCL', '(12X24)', 'A', 'Wall', 274, 17, 6.5],
  [1596, 'Alpine 10HL(Flowe) SCL', '(12X24)', 'A', 'Decor', 114, 7, 2],
  [1597, 'Alpine 10KHL(Kitchen) SCL', '(12X24)', 'A', 'Decor', 92, 5, 6],
  [1594, 'Alpine 10L_SCL', '(12X24)', 'A', 'Wall', 96, 6, 0],
  [1740, 'Alpine 12D_SCL', '(12X24)', 'A', 'Wall', 124, 8, 3],
  [1742, 'ALpine 12HL(Flower) SCL', '(12X24)', 'A', 'Decor', 48, 3, 0],
  [1638, 'Alpine 12KHL(Kitchen) SCL', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [1741, 'Alpine 12L_SCL', '(12X24)', 'A', 'Wall', 126, 8, 4],
  [1124, 'AS 75HL(Flower) SCL', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [1104, 'AS 75_SCL', '(12X24)', 'A', 'Floor', 10, 0, 5],
  [1105, 'AS 75_STP_SCL', '(12X24)', 'A', 'Step', 0, 0, 0],
  [1084, 'AS 79_SCL', '(12X24)', 'A', 'Floor', 2182, 137, 1.89],
  [1085, 'AS 79_SCL', '(12X24)', 'B', 'Floor', 0, 0, 0],
  [1073, 'AS 79_STP_SCL', '(12X24)', 'A', 'Step', 3776, 236, 7],
  [1075, 'AS 79_STP_SCL', '(12X24)', 'B', 'Step', 78, 4, 7],
  [1082, 'AS 92_SCL', '(12X24)', 'A', 'Floor', 760, 48, 3.5],

  // Page 6 (30 rows)
  [1083, 'AS 92_SCL', '(12X24)', 'B', 'Floor', 0, 0, 0],
  [1074, 'AS 92_STP_SCL', '(12X24)', 'A', 'Step', 6, 0, 5.5],
  [1076, 'AS 92_STP_SCL', '(12X24)', 'B', 'Step', 64, 4, 7],
  [392, 'AS59_STP_SCL', '(12X24)', 'A', 'Step', 0, -1, 0],
  [1560, 'AS90_STC', '(12X24)', 'A', 'Floor', 0, 0, 0],
  [1091, 'AS91(Flower) STC', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [1092, 'AS91D_STC', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1090, 'AS91L_STC', '(12X24)', 'A', 'Wall', 6, 0, 3],
  [1506, 'AS93_STC', '(12X24)', 'A', 'Floor', 1288, 80, 4],
  [1507, 'AS93_STP_STC', '(12X24)', 'A', 'Step', 36, 2, 2],
  [1324, 'Lucido 51_SCL', '(12X24)', 'A', 'Rustic Wall', 132, 9, 1],
  [1437, 'Lucido 53_SCL', '(12X24)', 'A', 'Rustic Wall', 0, 0, 0],
  [1438, 'Lucido 54_SCL', '(12X24)', 'A', 'Rustic Wall', 8, 0, 4],
  [1936, 'LX 01D_SCL', '(12X24)', 'A', 'Wall', 856, 53, 4],
  [1934, 'LX 01HL(Flower) SCL', '(12X24)', 'A', 'Decor', 176, 11, 0],
  [1935, 'LX 01HL-2(Scenary) SCL', '(12X24)', 'A', 'Decor', 168, 10, 4],
  [1933, 'LX 01L_SCL', '(12X24)', 'A', 'Wall', 952, 59, 4],
  [1940, 'LX 10D_SCL', '(12X24)', 'A', 'Wall', 558, 34, 7],
  [1938, 'LX 10HL(Flower) SCL', '(12X24)', 'A', 'Decor', 100, 6, 2],
  [1939, 'LX 10HL-2(Scenary) SCL', '(12X24)', 'A', 'Decor', 108, 6, 6],
  [1937, 'LX 10L_SCL', '(12X24)', 'A', 'Wall', 602, 37, 3],
  [1675, 'PC 301D_SCL', '(12X24)', 'A', 'Wall', 394, 25, 1],
  [1674, 'PC 301HL(Flower) SCL', '(12X24)', 'A', 'Decor', 106, 6, 5],
  [1706, 'PC 301HL-2(Scenery) SCL', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [1673, 'PC 301L_SCL', '(12X24)', 'A', 'Wall', 0, 0, 2],
  [1678, 'PC 303D_SCL', '(12X24)', 'A', 'Wall', 246, 16, 1],
  [1677, 'PC 303HL(Flower) SCL', '(12X24)', 'A', 'Decor', 320, 20, 5],
  [1676, 'PC 303L_SCL', '(12X24)', 'A', 'Wall', 326, 20, 3],
  [1682, 'PC 321D_SCL', '(12X24)', 'A', 'Wall', 530, 33, 4],
  [1680, 'PC 321HL(Flower) SCLC', '(12X24)', 'A', 'Decor', 250, 16, 0],

  // Page 7 (30 rows)
  [1681, 'PC 321KHL(Kitchen) SCL', '(12X24)', 'A', 'Decor', 290, 19, 0],
  [1679, 'PC 321L_SCL', '(12X24)', 'A', 'Wall', 30, 2, 0],
  [138, 'Petra05_STC', '(12X24)', 'A', 'Rustic Wall', 0, 0, 0],
  [1462, 'PX 01D_SCL', '(12X24)', 'A', 'Wall', 1922, 120, 1],
  [1463, 'PX 01KHL(Kitchen) SCL', '(12X24)', 'A', 'Decor', 642, 41, 0],
  [1461, 'PX 01L_SCL', '(12X24)', 'A', 'Wall', 1936, 121, 6],
  [1543, 'PX 02D_SCL', '(12X24)', 'A', 'Wall', 798, 50, 6],
  [1541, 'PX 02HL(Flower) SCL', '(12X24)', 'A', 'Decor', 434, 27, 7],
  [1542, 'PX 02KHL(Kitchen) SCL', '(12X24)', 'A', 'Decor', 0, 0, 7],
  [1540, 'PX 02L_SCL', '(12X24)', 'A', 'Wall', 746, 46, 5],
  [1612, 'PX 05D_SCL', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1613, 'PX 05HL(Flower) SCL', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [1614, 'PX 05KHL(Kitchen) SCL', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [1611, 'PX 05L_SCL', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1883, 'PX 06D_SCL', '(12X24)', 'A', 'Wall', 456, 29, 0],
  [1881, 'PX 06HL(Flower) SCL', '(12X24)', 'A', 'Decor', 6, 1, 0],
  [1882, 'PX 06HL-2(Scenary) SCL', '(12X24)', 'A', 'Decor', 108, 7, 4],
  [1880, 'PX 06L_SCL', '(12X24)', 'A', 'Wall', 282, 18, 0],
  [1816, 'PX 51_SCL', '(12X24)', 'A', 'Wall', 5558, 347, 7],
  [1817, 'PX 53_SCL', '(12X24)', 'A', 'Wall', 4463, 278, 7],
  [1127, '6200 GLX_STP_SCL', '(12X48)', 'A', 'Step', 892, 56, 0],
  [1761, '6200G_STP_SCL', '(12X48)', 'A', 'Step', 612, 38, 1],
  [978, '6202_STP_SCL', '(12X48)', 'A', 'Step', 0, 0, 0],
  [798, '6203_STP_STC', '(12X48)', 'A', 'Step', 0, 0, 0],
  [1404, '6209_STP_STC', '(12X48)', 'A', 'Step', 0, 0, 0],
  [827, '6215_STP_STC', '(12X48)', 'A', 'Step', 0, -1, 3.5],
  [692, '6216_STP_STC', '(12X48)', 'A', 'Step', 0, 0, 0],
  [773, '6222_STP_STC', '(12X48)', 'A', 'Step', 0, 0, 0],
  [1650, '6224_STP_STC', '(12X48)', 'A', 'Step', 0, 0, 0],
  [1524, '6232_STP', '(12X48)', 'A', 'Step', 0, 0, 0],

  // Page 8 (29 rows)
  [829, '6234_STP_STC', '(12X48)', 'A', 'Step', 12, 0, 3],
  [1875, '6281_STP_STC', '(12X48)', 'A', 'Step', 0, 0, 0],
  [1409, '6283_STP_STC', '(12X48)', 'A', 'Step', 4, 0, 1],
  [1386, '6284_STP_STC', '(12X48)', 'A', 'Step', 0, 0, 0],
  [1492, '6285_STP_STC', '(12X48)', 'A', 'Step', 0, 0, 0],
  [1460, '40004_XML', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [414, '4401 BK_SCL', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [116, '4401_SCL', '(16X16)', 'A', 'Floor', 408.91, 26, 4.98],
  [413, '4401_SCL', '(16X16)', 'B', 'Floor', 0, 0, 0],
  [117, '4402_SCL', '(16X16)', 'A', 'Floor', 371.56, 24, 1],
  [118, '4403_SCL', '(16X16)', 'A', 'Floor', 0.01, 0, 0],
  [391, '4405_STC', '(16X16)', 'A', 'Floor', 10.67, 0, 6],
  [1335, '4409_STC', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [411, '4533_STC', '(16X16)', 'A', 'Floor', 0, -1, 8.81],
  [1250, '4555_SCL', '(16X16)', 'A', 'Floor', 958.22, 60, 1.11],
  [1204, '4701_SCL', '(16X16)', 'A', 'Floor', 2302.22, 143, 8],
  [1112, '4703_STC', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [1274, 'Maze 04_SCL', '(16X16)', 'A', 'Floor', 362.67, 23, 3],
  [1277, 'Maze 06_SCL', '(16X16)', 'A', 'Floor', 8.89, 0, 7],
  [1480, 'Maze 10_SCL', '(16X16)', 'A', 'Floor', 2072.89, 129, 7.49],
  [1919, 'PX 4206_SCL', '(16X16)', 'A', 'Matching Floor', 3566.23, 222, 8],
  [123, 'SGVT 06_SCL', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [121, 'SGVT 20_SCL', '(16X16)', 'A', 'Floor', 152.89, 9, 5],
  [971, 'SGVT 43_SCL', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [1851, 'SGVT 44_SCL', '(16X16)', 'B', 'Floor', 645.33, 40, 4],
  [997, 'SGVT 44_SCL', '(16X16)', 'A', 'Floor', 6528, 408, 6],
  [1248, 'SGVT 47_SCL', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [1322, 'SGVT 49_SCL', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [1355, 'SGVT 50_SCL', '(16X16)', 'A', 'Floor', 0, 0, 0],

  // Page 9 (30 rows)
  [1350, 'SGVT 51_SCL', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [1874, 'SGVT 59_SCL', '(16X16)', 'A', 'Floor', 6880, 430, 5],
  [1367, '6003_SCL', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1481, '6003_SCL', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1805, '6004_SCL', '(24X24)', 'B', 'Floor', 20, 1, 1],
  [1459, '6004_SCL', '(24X24)', 'A', 'Floor', 12, 0, 3],
  [1356, '6005_STC', '(24X24)', 'A', 'Floor', 252, 15, 3],
  [1496, '6005_STC', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1660, '6006_STC', '(24X24)', 'B', 'Floor', 432, 27, 0],
  [1425, '6006_STC', '(24X24)', 'A', 'Floor', 160, 10, 0],
  [1624, '6009_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1672, '6010_SCL', '(24X24)', 'A', 'Floor', 268, 17, 0],
  [1884, '6011_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1809, '6013_SCL', '(24X24)', 'A', 'Floor', 8, 0, 3],
  [1810, '6014_SCL', '(24X24)', 'A', 'Floor', 2332, 145, 3],
  [1743, '6050_SCL', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [811, '6223_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1544, '6506_STC', '(24X24)', 'A', 'Floor', 824, 51, 2],
  [479, '6600 BK_SCL', '(24X24)', 'A', 'Floor', 332, 20, 3],
  [267, '6600 GLX_SCL', '(24X24)', 'A', 'Floor', 4224, 264, 3.5],
  [785, '6600 GLX_SCL', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [264, '6600 GR_SCL', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [503, '6600 MR_STC', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [504, '6600 MR_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [660, '6600_STC', '(24X24)', 'A', 'Floor', 96, 6, 0],
  [945, '6601BK_SCL', '(24X24)', 'A', 'Floor', 0, -1, 3.75],
  [949, '6601BK_SCL', '(24X24)', 'B', 'Floor', 4, 0, 1],
  [387, '6601_SCL', '(24X24)', 'A', 'Floor', 1992, 124, 2],
  [388, '6601_SCL', '(24X24)', 'B', 'Floor', 8, 0, 3],
  [268, '6621_SCL', '(24X24)', 'A', 'Floor', 187, 12, 2.75],

  // Page 10 (30 rows)
  [1659, '6621_SCL', '(24X24)', 'B', 'Floor', 32, 2, 0],
  [265, '6623A_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [266, '6623_STC', '(24X24)', 'A', 'Floor', 0, 0, 2],
  [833, '6636_STC', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [367, '6636_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1548, '6640_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [856, '6658_STC', '(24X24)', 'B', 'Floor', 312, 19, 2],
  [725, '6658_STC', '(24X24)', 'A', 'Floor', 1, 0, 0],
  [852, '6659_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [263, '6674_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [816, '6675_STC', '(24X24)', 'A', 'Floor', 24, 1, 2],
  [386, '6676_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1549, '6677_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1843, '6678_STC', '(24X24)', 'A', 'Floor', 1184, 74, 0],
  [491, '6681_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [651, '6682_SCL', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [958, '6686_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [967, '6692_SCL', '(24X24)', 'A', 'Floor', 2272, 142, 0],
  [1498, '6692_SCL', '(24X24)', 'B', 'Floor', 144, 9, 2],
  [988, '6693_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1230, '6698_SCL', '(24X24)', 'A', 'Floor', 591, 37, 3],
  [1495, '6698_SCL', '(24X24)', 'B', 'Floor', 192, 12, 0],
  [1249, '6699_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [473, 'AS6759_SCL', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1894, 'NC 01_SCL', '(24X24)', 'A', 'Floor', 4796, 299, 3],
  [1895, 'NC 03_SCL', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1422, 'Neo 01BK_STC', '(24X24)', 'B', 'Floor', 4, 0, 1],
  [1421, 'Neo 02MR_STC', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1724, 'Neo 04_STC', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1126, '6200 GLX_SCL', '(24X48)', 'A', 'Floor', 1792, 112, 1.5],

  // Page 11 (30 rows)
  [1275, '6200 GLX_SCL', '(24X48)', 'B', 'Floor', 8, 1, 0],
  [1398, '6200G_SCL', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [706, '6201_A_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [977, '6202_SCL', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [797, '6203_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1278, '6207_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [721, '6211_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [502, '6212_STC', '(24X48)', 'A', 'Floor', 0, -1, 0],
  [950, '6214_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [826, '6215_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [691, '6216_STC', '(24X48)', 'A', 'Floor', 0, -1, 0],
  [1439, '6217_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [475, '6221_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [406, '6222_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1927, '6224_SCL', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1223, '6225_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1520, '6226_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1142, '6227_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1850, '6230_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1168, '6231_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1197, '6232_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [841, '6233_STC', '(24X48)', 'B', 'Floor', 0, 0, 0],
  [828, '6234_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [959, '6235_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1282, '6240_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1174, '6271_STC', '(24X48)', 'B', 'Floor', 0, 0, 0],
  [757, '6271_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [787, '6272_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [840, '6274_STC', '(24X48)', 'B', 'Floor', 0, 0, 0],
  [1292, '6275_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],

  // Page 12 (30 rows)
  [1179, '6275_STC', '(24X48)', 'B', 'Floor', 0, 0, 0],
  [731, '6276_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1503, '6281_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1260, '6282_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1408, '6283_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1280, '6284_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [1144, '6285_STC', '(24X48)', 'A', 'Floor', 0, 0, 0],
  [665, '8804_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [516, '8805_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1711, '8806_STC', '(32X32)', 'B', 'Floor', 0, 0, 0],
  [434, '8806_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [270, '8807_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [416, '8810_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1533, '8810_STC', '(32X32)', 'B', 'Floor', 0, 0, 0],
  [653, '8814_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1070, '8815_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [976, '8820_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1021, '8823_SCL', '(32X32)', 'A', 'Floor', 3569.78, 251, 0.09],
  [1279, '8824_SCL', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1251, '8825_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1458, '8828_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1917, '8830_SCL', '(32X32)', 'A', 'Floor', 327.11, 23, 0],
  [1861, '8832_STC', '(32X32)', 'A', 'Floor', 2019.56, 142, 0],
  [1890, '8833_SCL', '(32X32)', 'A', 'Floor', 874.67, 62, 0],
  [1886, '8850_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1125, '8882_STC', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [519, 'Prime02_SCL', '(40X40)', 'A', 'Floor', 0, 0, 0],
  [1167, 'Prime05_SCL', '(40X40)', 'A', 'Floor', 0, 0, 0],
  [772, 'Prime11_SCL', '(40X40)', 'A', 'Floor', 0, 0, 0],
  [298, 'Prime12_SCL', '(40X40)', 'A', 'Floor', 0, 0, 0],

  // Page 13 (4 rows)
  [842, 'Prime15_SCL', '(40X40)', 'A', 'Floor', 0, 0, 0],
  [435, 'Prime46_SCL', '(40X40)', 'A', 'Floor', 0, 0, 0],
  [730, 'Prime54_SCL', '(40X40)', 'A', 'Floor', 0, 0, 0],
  [858, 'Prime68_SCL', '(40X40)', 'A', 'Floor', 0, 0, 0],
];

function inferSheltechPackMetrics(
  size: SheltechSize,
  stockSft: number,
  closingBox: number,
  closingPcs: number
): { w: number; h: number; qtyPack: number; sftPack: number } {
  const match = size.match(/\((\d+)X(\d+)\)/);
  const w = match ? Number(match[1]) : 12;
  const h = match ? Number(match[2]) : 12;
  const pieceSft = (w * h) / 144;

  // Defaults per standard Sheltech carton sizes
  let defaultQty = 4;
  switch (size) {
    case '(8X12)':
      defaultQty = 25;
      break;
    case '(8X20)':
      defaultQty = 15;
      break;
    case '(10X16)':
      defaultQty = 14;
      break;
    case '(12X12)':
      defaultQty = 16;
      break;
    case '(12X24)':
      defaultQty = 8;
      break;
    case '(12X48)':
      defaultQty = 4;
      break;
    case '(16X16)':
      defaultQty = 9;
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
    case '(40X40)':
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

export const SHELTECH_PRODUCTS: Product[] = SHELTECH_RAW_ROWS.map(
  ([productId, productName, size, grade, typeName, stockSft, closingBox, closingPcs]) => {
    const { w, h, qtyPack, sftPack } = inferSheltechPackMetrics(size, stockSft, closingBox, closingPcs);
    const hasNegativeBalance = closingBox < 0;
    const normalizedBox = hasNegativeBalance ? 0 : Math.max(0, closingBox);
    const normalizedPcs = hasNegativeBalance ? 0 : Math.max(0, closingPcs);
    const normalizedSft = Math.max(0, stockSft);

    return {
      id: productId,
      code: `${productName}_${grade}`,
      category: typeName,
      vendor: SHELTECH_VENDOR,
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
