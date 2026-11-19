import { Product } from '../types';

export const GREAT_WALL_VENDOR = 'GREAT WALL CERAMICS LT.';

export const GREAT_WALL_CATEGORIES = [
  'Wall',
  'Decor',
  'Matching Floor',
  'Floor',
  'Step',
  'Rustic Wall',
] as const;

type GwRawRow = readonly [
  productId: number,
  productName: string,
  size: '(8X12)' | '(10X16)' | '(12X12)' | '(12X20)' | '(12X24)' | '(16X16)' | '(24X12)' | '(24X24)' | '(32X32)',
  grade: 'A' | 'B',
  typeName: 'Wall' | 'Decor' | 'Matching Floor' | 'Floor' | 'Step' | 'Rustic Wall',
  stockSft: number,
  closingBox: number,
  closingPcs: number
];

// Complete 203-row Stock Report for GREAT WALL CERAMICS LT. (Stock Date: 18/11/2026)
export const GREAT_WALL_RAW_ROWS: readonly GwRawRow[] = [
  // Page 1 (26 rows)
  [1715, '3039DBE_G.W', '(8X12)', 'A', 'Wall', 1166.67, 70, 0],
  [1616, '502G-1(Flower) G.W', '(10X16)', 'A', 'Decor', 0, 0, 0],
  [1617, '502G-2(Kitchen) G.W', '(10X16)', 'A', 'Decor', 0, 0, 0],
  [1615, '502G_G.W', '(10X16)', 'B', 'Wall', 0, 0, 0],
  [809, '520G_G.W', '(10X16)', 'A', 'Wall', 0, 0, 0],
  [330, '520G_G.W', '(10X16)', 'B', 'Wall', 0, 0, 0],
  [1583, '524BE-1(Flower) G.W', '(10X16)', 'A', 'Decor', 177.78, 13, 4],
  [1584, '524BE-2(Kitchen) G.W', '(10X16)', 'A', 'Decor', 193.33, 14, 6],
  [1582, '524BE_G.W', '(10X16)', 'A', 'Wall', 0, -1, 11.99],
  [1727, '525G-1(Flower) G.W', '(10X16)', 'A', 'Decor', 510, 38, 3],
  [1726, '525G_G.W', '(10X16)', 'A', 'Wall', 334.49, 25, 1.01],
  [1838, '532DG_G.W', '(10X16)', 'A', 'Wall', 357.78, 26, 10],
  [1837, '532LG-1(Flower) G.W', '(10X16)', 'A', 'Decor', 76.66, 5, 8.99],
  [1836, '532LG_G.W', '(10X16)', 'A', 'Wall', 7.78, 0, 7],
  [1924, '532LG_G.W', '(10X16)', 'B', 'Wall', 293.33, 22, 0],
  [310, '542GY-1(Flower) G.W', '(10X16)', 'A', 'Decor', 0, 0, 7.4],
  [1332, '542GY_G.W', '(10X16)', 'B', 'Wall', 0, 0, 0],
  [309, '542GY_G.W', '(10X16)', 'A', 'Wall', 0, -1, 11.4],
  [222, '547G-1(Flower) G.W', '(10X16)', 'A', 'Decor', 4323.34, 325, 0.01],
  [221, '547G_G.W', '(10X16)', 'A', 'Wall', 2067.81, 155, 4.13],
  [331, '550G_G.W', '(10X16)', 'B', 'Wall', 325.56, 24, 5],
  [1432, '550G_G.W', '(10X16)', 'A', 'Wall', 131.14, 9, 10.03],
  [1641, '555GB_G.W', '(10X16)', 'A', 'Wall', 0, 0, 0],
  [345, '560G_G.W', '(10X16)', 'B', 'Wall', 158.89, 11, 11],
  [679, '1134FLR_G.W', '(12X12)', 'A', 'Matching Floor', 1034, 79, 7],
  [655, '1161FLR_G.W', '(12X12)', 'A', 'Matching Floor', 0, 0, 0],

  // Page 2 (30 rows)
  [343, '400G_G.W', '(12X12)', 'B', 'Floor', 0, 0, 0],
  [360, '400G_G.W', '(12X12)', 'A', 'Floor', 3589, 224, 4],
  [340, '400G_STP_G.W', '(12X12)', 'A', 'Step', 2100, 131, 4],
  [1651, '400G_STP_G.W', '(12X12)', 'B', 'Step', 0, 0, 0],
  [346, '410G_G.W', '(12X12)', 'B', 'Floor', 0, 0, 0],
  [1490, '410G_G.W', '(12X12)', 'A', 'Floor', 1666, 104, 2],
  [1491, '410G_STP_G.W', '(12X12)', 'A', 'Step', 1118, 69, 14],
  [517, '450G', '(12X12)', 'A', 'Floor', 0, 0, 0],
  [1245, '467G_G.W', '(12X12)', 'A', 'Matching Floor', 0, 0, 0],
  [690, '485LBE_G.W', '(12X12)', 'A', 'Matching Floor', 489, 37, 8],
  [192, '919DBE_G.W', '(12X20)', 'A', 'Wall', 13.34, 0, 8],
  [193, '919LBE-2(Kitchen) G.W', '(12X20)', 'A', 'Decor', 220.02, 13, 3],
  [191, '919LBE_G.W', '(12X20)', 'A', 'Wall', 305.01, 18, 3],
  [198, '920BE-1(Flower) G.W', '(12X20)', 'A', 'Decor', 0, 0, 0],
  [199, '920BE-2(Kitchen) G.W', '(12X20)', 'A', 'Decor', 0, 0, 0],
  [197, '920BE_G.W', '(12X20)', 'A', 'Wall', 0, 0, 0],
  [201, '923DG_G.W', '(12X20)', 'A', 'Wall', 88, 4, 2.8],
  [518, '923DG_GW', '(12X20)', 'B', 'Wall', 0, 0, 0],
  [202, '923LG-1(Flower) G.W', '(12X20)', 'A', 'Decor', 20, 1, 2],
  [326, '923LG_G.W', '(12X20)', 'B', 'Wall', 0, 0, 0],
  [200, '923LG_G.W', '(12X20)', 'A', 'Wall', 0, 0, 0],
  [1877, '948DG_G.W', '(12X20)', 'B', 'Wall', 293.33, 17, 6],
  [1690, '948DG_G.W', '(12X20)', 'A', 'Wall', 1156.65, 69, 3.99],
  [1691, '948LG-1(Flower) G.W', '(12X20)', 'A', 'Decor', 343.34, 20, 6],
  [1876, '948LG_G.W', '(12X20)', 'B', 'Wall', 266.67, 16, 0],
  [1689, '948LG_G.W', '(12X20)', 'A', 'Wall', 1826.65, 109, 5.99],
  [1946, '954DBE_G.W', '(12X20)', 'A', 'Wall', 816.67, 49, 0],
  [1945, '954LBE-2(Kitchen) G.W', '(12X20)', 'A', 'Decor', 270, 16, 2],
  [1944, '954LBE_G.W', '(12X20)', 'A', 'Wall', 816.67, 49, 0],
  [1052, '966DBE_G.W', '(12X20)', 'A', 'Wall', 0, 0, 0],

  // Page 3 (30 rows)
  [1879, '966DBE_G.W', '(12X20)', 'B', 'Wall', 0, 0, 0],
  [1051, '966LBE-1(Flower) G.W', '(12X20)', 'A', 'Decor', 195, 11, 7],
  [1271, '966LBE-2(Kitchen) G.W', '(12X20)', 'A', 'Decor', 180, 10, 8],
  [1050, '966LBE_G.W', '(12X20)', 'A', 'Wall', 383.33, 23, 0],
  [1878, '966LBE_G.W', '(12X20)', 'B', 'Wall', 0, 0, 0],
  [708, '967G-1(Flower) G.W', '(12X20)', 'A', 'Decor', 1501, 90, 5.19],
  [1844, '967G_G.W', '(12X20)', 'B', 'Wall', 216.67, 13, 0],
  [707, '967G_G.W', '(12X20)', 'A', 'Wall', 7664.99, 460, 6],
  [210, '983LG-1(Flower) G.W', '(12X20)', 'A', 'Decor', 0, 0, 6],
  [211, '983LG-2(Kitchen) G.W', '(12X20)', 'A', 'Decor', 5, 0, 3],
  [512, '983LG_G.W', '(12X20)', 'B', 'Wall', 135, 8, 1],
  [209, '983LG_G.W', '(12X20)', 'A', 'Wall', 18.33, 1, 1],
  [213, '985LBE-1(Flower) G.W', '(12X20)', 'A', 'Decor', 240, 14, 4],
  [214, '985LBE-2(Kitchen) G.W', '(12X20)', 'A', 'Decor', 543.34, 32, 6.2],
  [332, '985LBE_G.W', '(12X20)', 'B', 'Wall', 816.67, 49, 0],
  [212, '985LBE_G.W', '(12X20)', 'A', 'Wall', 3055, 183, 3.4],
  [1704, '1105DBE_G.W', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1703, '1105LBE_G.W', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1718, '1109DBE_G.W', '(12X24)', 'A', 'Floor', 0, 0, 0],
  [1719, '1109_STP_G.W', '(12X24)', 'A', 'Step', 32, 2, 0],
  [1434, '1124DBE_G.W', '(12X24)', 'A', 'Wall', 8, 0, 4],
  [1227, '1124DG_G.W', '(12X24)', 'B', 'Wall', 128, 8, 0],
  [1435, '1124LBE-2(Kitchen) G.W', '(12X24)', 'A', 'Decor', 2, 0, 1],
  [1433, '1124LBE_G.W', '(12X24)', 'A', 'Wall', 96, 6, 0],
  [1226, '1124LG_G.W', '(12X24)', 'B', 'Wall', 0, 0, 0],
  [1963, '1125DBE_G.W', '(12X24)', 'A', 'Wall', 1468, 91, 6],
  [1235, '1125DBE_G.W', '(12X24)', 'B', 'Wall', 0, 0, 0],
  [1806, '1125LBE-1(Flower) G.W', '(12X24)', 'A', 'Decor', 136, 8, 4],
  [1964, '1125LBE-2(Kitchen) G.W', '(12X24)', 'A', 'Decor', 320, 20, 0],
  [1173, '1125LBE_G.W', '(12X24)', 'B', 'Wall', 0, 0, 0],

  // Page 4 (30 rows)
  [1962, '1125LBE_G.W', '(12X24)', 'A', 'Wall', 1468, 91, 6],
  [1140, '1132DG_G.W', '(12X24)', 'B', 'Wall', 758, 47, 3],
  [1291, '1132LG-1(Flower) G.W', '(12X24)', 'A', 'Decor', 368, 23, 0],
  [564, '1132LG_G.W', '(12X24)', 'B', 'Wall', 1744, 109, 0],
  [857, '1132LG_G.W', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [423, '1134DG_G.W', '(12X24)', 'A', 'Wall', 1852, 115, 6],
  [424, '1134LG-1(Flower) G.W', '(12X24)', 'A', 'Decor', 596, 36, 2],
  [422, '1134LG_G.W', '(12X24)', 'A', 'Wall', 1924, 119, 2],
  [1701, '1143BE-2(Kitchen) G.W', '(12X24)', 'A', 'Decor', 12, 0, 6],
  [1700, '1143BE_G.W', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1558, '1154DG_G.W', '(12X24)', 'B', 'Wall', 0, 0, 0],
  [1559, '1154LG-1(Flower) G.W', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [1557, '1154LG_G.W', '(12X24)', 'B', 'Wall', 0, 0, 0],
  [805, '1158DG_G.W', '(12X24)', 'A', 'Wall', 8, 0, 4],
  [1240, '1158DG_G.W', '(12X24)', 'B', 'Wall', 0, 0, 0],
  [806, '1158LG-1(Flower) G.W', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [804, '1158LG_G.W', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [1239, '1158LG_G.W', '(12X24)', 'B', 'Wall', 6, 0, 3],
  [553, '1161DGR_G.W', '(12X24)', 'A', 'Wall', 34, 2, 1],
  [1242, '1161DGR_G.W', '(12X24)', 'B', 'Wall', 0, 0, 0],
  [554, '1161LGR-1(Flower) G.W', '(12X24)', 'A', 'Decor', 76, 4, 6],
  [552, '1161LGR_G.W', '(12X24)', 'A', 'Wall', 18, 1, 1],
  [1241, '1161LGR_G.W', '(12X24)', 'B', 'Wall', 0, 0, 0],
  [1821, '1165G-(Flower) G.W', '(12X24)', 'A', 'Decor', 0, 0, 0],
  [1820, '1165G_G.W', '(12X24)', 'B', 'Wall', 0, 0, 0],
  [1803, '1168DBE_G.W', '(12X24)', 'A', 'Wall', 226, 14, 1],
  [1802, '1168LBE-1(Flower) G.W', '(12X24)', 'A', 'Decor', 136, 8, 4],
  [1801, '1168LBE_G.W', '(12X24)', 'A', 'Wall', 348, 21, 6],
  [1800, '1169DBL_G.W', '(12X24)', 'A', 'Wall', 74, 4, 5],
  [1799, '1169LBL-1(Scenery) G.W', '(12X24)', 'A', 'Decor', 32, 2, 0],

  // Page 5 (30 rows)
  [1798, '1169LBL_G.W', '(12X24)', 'A', 'Wall', 142, 8, 7],
  [990, '1187DBE_G.W', '(12X24)', 'A', 'Wall', 0, 0, 0],
  [991, '1187LBE-1(Flower) G.W', '(12X24)', 'A', 'Decor', 118, 7, 3],
  [992, '1187LBE-2(Kitchen) G.W', '(12X24)', 'A', 'Decor', 6, 0, 3],
  [1086, '1187LBE_G.W', '(12X24)', 'B', 'Wall', 112, 7, 0],
  [989, '1187LBE_G.W', '(12X24)', 'A', 'Wall', 88, 5, 4],
  [190, '1190R1A_G.W', '(12X24)', 'B', 'Rustic Wall', 438, 27, 3],
  [1717, '6092_STP_G.W', '(12X24)', 'A', 'Step', 2, 0, 1],
  [320, '6605_STP_G.W', '(12X24)', 'A', 'Step', 98, 6, 1],
  [445, '6606_STP_G.W', '(12X24)', 'A', 'Step', 0, 0, 0],
  [365, '6607_STP_G.W', '(12X24)', 'A', 'Step', 0, 0, 0],
  [1819, '6608_STP', '(12X24)', 'A', 'Step', 12, 0, 6],
  [350, '6680_STP_G.W', '(12X24)', 'A', 'Step', 68, 4, 2],
  [1220, '6681_STP_G.W', '(12X24)', 'A', 'Step', 0, 0, 0],
  [1586, '800G_STP_G.W', '(12X24)', 'B', 'Step', 0, 0, 0],
  [877, '800G_STP_G.W', '(12X24)', 'A', 'Step', 0, 0, 0],
  [334, '600G_G.W', '(16X16)', 'A', 'Floor', 5626.66, 316, 3.98],
  [335, '600G_G.W', '(16X16)', 'B', 'Floor', 15.98, 0, 8],
  [1685, '609G_G.W', '(16X16)', 'A', 'Floor', 3932.67, 221, 1.99],
  [355, '610G_G.W', '(16X16)', 'B', 'Floor', 0, 0, 0],
  [494, '610G_G.W', '(16X16)', 'A', 'Floor', 1310.24, 73, 7],
  [313, '614G_G.W', '(16X16)', 'A', 'Floor', 305.78, 17, 0.56],
  [425, '614G_G.W', '(16X16)', 'B', 'Floor', 58.66, 3, 2.99],
  [1729, '631GL_G.W', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [792, '635GL_G.W', '(16X16)', 'A', 'Floor', 106.67, 6, 0],
  [1670, '639GL_G.W', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [1887, '645GL_G.W', '(16X16)', 'A', 'Floor', 0, 0, 0],
  [333, '656M_G.W', '(16X16)', 'A', 'Floor', 0, 0, 7],
  [1123, '658M_G.W', '(16X16)', 'A', 'Floor', 655.99, 36, 9.88],
  [1808, '6608-STP_GW', '(24X12)', 'A', 'Step', 0, 0, 0],

  // Page 6 (30 rows)
  [316, '6001_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [341, '6001_G.W', '(24X24)', 'A', 'Floor', 516, 32, 1],
  [1581, '6017_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1598, '6027_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1602, '6027_G.W', '(24X24)', 'A', 'Floor', 112, 6, 2.5],
  [322, '6032_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1910, '6058_G.W', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1410, '6058_G.W', '(24X24)', 'B', 'Floor', 304, 19, 0],
  [1315, '6059_G.W', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [545, '6066_G.W', '(24X24)', 'B', 'Floor', 4, 0, 1],
  [508, '6066_G.W', '(24X24)', 'A', 'Floor', 632, 39, 2],
  [654, '6067_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [444, '6067_G.W', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1822, '6074_G.W', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1636, '6074_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1716, '6092_G.W', '(24X24)', 'A', 'Floor', 80, 5, 0],
  [235, '6605_G.W', '(24X24)', 'A', 'Floor', 752, 46, 3.75],
  [236, '6605_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [237, '6606_G.W', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [238, '6606_G.W', '(24X24)', 'B', 'Floor', 16, 0, 0],
  [1038, '6607_G.W', '(24X24)', 'A', 'Floor', 8, 0, 2],
  [339, '6607_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1312, '6608_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1323, '6608_G.W', '(24X24)', 'A', 'Wall', 820, 51, 1],
  [1683, '6610_G.W', '(24X24)', 'B', 'Floor', 400, 25, 0],
  [1643, '6611_G.W', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [319, '6680_G.W', '(24X24)', 'B', 'Floor', 2640, 229, 0],
  [440, '6680_G.W', '(24X24)', 'A', 'Floor', 1240, 110, 1],
  [1311, '6681_G.W', '(24X24)', 'B', 'Floor', 8, 0, 2],
  [722, '6681_G.W', '(24X24)', 'A', 'Floor', 0, 0, 0],

  // Page 7 (27 rows)
  [724, '6682_G.W', '(24X24)', 'A', 'Floor', 52, 3, 1],
  [544, '6684_G.W', '(24X24)', 'A', 'Floor', 0, 0, 2],
  [675, '6684_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1585, '800G_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [495, '800G_G.W', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [1024, '800G_Polish_G.W', '(24X24)', 'A', 'Floor', 0, 0, 0],
  [954, '800G_Polish_G.W', '(24X24)', 'B', 'Floor', 0, 0, 0],
  [1564, '8002_G.W', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [985, '8003_G.W', '(32X32)', 'A', 'Floor', 824.89, 58, 0],
  [1778, '8003_G.W', '(32X32)', 'B', 'Floor', 0, 0, 0],
  [1180, '8004_G.W', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [970, '8005_G.W', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1514, '8006_G.W', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1029, '8008_G.W', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1161, '8010_G.W', '(32X32)', 'A', 'Floor', 952.11, 66, 1.89],
  [1640, '8011_G.W', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1382, '8012_G.W', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1783, '8016_G.W', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1782, '8020_G.W', '(32X32)', 'A', 'Floor', 2631.11, 185, 0],
  [1781, '8052_G.W', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1476, '8860_G.W', '(32X32)', 'A', 'Floor', 113.78, 8, 0],
  [1509, '8860_G.W', '(32X32)', 'B', 'Floor', 0, 0, 0],
  [1207, '8861_G.W', '(32X32)', 'A', 'Floor', 42.67, 3, 0],
  [1568, '8862_G.W', '(32X32)', 'B', 'Floor', 0, 0, 0],
  [1493, '8862_G.W', '(32X32)', 'A', 'Floor', 0, 0, 0],
  [1671, '8865_G.W', '(32X32)', 'B', 'Floor', 440.89, 31, 0],
  [937, '8865_G.W', '(32X32)', 'A', 'Floor', 42.67, 3, 0],
];

function getPackMetrics(
  size: GwRawRow[2],
  typeName: GwRawRow[4]
): { w: number; h: number; qtyPack: number; sftPack: number } {
  switch (size) {
    case '(8X12)':
      return { w: 8, h: 12, qtyPack: 25, sftPack: 16.6667 };
    case '(10X16)':
      return { w: 10, h: 16, qtyPack: 12, sftPack: 13.3333 };
    case '(12X12)':
      if (typeName === 'Matching Floor') {
        return { w: 12, h: 12, qtyPack: 13, sftPack: 13 };
      }
      return { w: 12, h: 12, qtyPack: 16, sftPack: 16 };
    case '(12X20)':
      return { w: 12, h: 20, qtyPack: 10, sftPack: 16.6667 };
    case '(12X24)':
      return { w: 12, h: 24, qtyPack: 8, sftPack: 16 };
    case '(16X16)':
      return { w: 16, h: 16, qtyPack: 10, sftPack: 17.7778 };
    case '(24X12)':
      return { w: 24, h: 12, qtyPack: 8, sftPack: 16 };
    case '(24X24)':
      return { w: 24, h: 24, qtyPack: 4, sftPack: 16 };
    case '(32X32)':
      return { w: 32, h: 32, qtyPack: 2, sftPack: 14.2222 };
  }
}

export const GREAT_WALL_PRODUCTS: Product[] = GREAT_WALL_RAW_ROWS.map(
  ([productId, productName, size, grade, typeName, stockSft, closingBox, closingPcs]) => {
    const { w, h, qtyPack, sftPack } = getPackMetrics(size, typeName);
    const hasNegativeBalance = closingBox < 0 && stockSft <= 0;
    const normalizedBox = hasNegativeBalance ? 0 : Math.max(0, closingBox);
    const normalizedPcs = hasNegativeBalance ? 0 : Math.max(0, closingPcs);
    const normalizedSft = Math.max(0, stockSft);

    return {
      id: productId,
      code: `${productName}_${grade}`,
      category: typeName,
      vendor: GREAT_WALL_VENDOR,
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
