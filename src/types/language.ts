export const languages = [
  'english',
  'spanish',
  'japanese',
  'chinese-simplified',
  'chinese-traditional',
  'french',
  'german',
  'indonesian',
  'italian',
  'korean',
  'portuguese',
  'russian',
  'thai',
  'turkish',
  'vietnamese',
] as const;

export type Languages = (typeof languages)[number];
