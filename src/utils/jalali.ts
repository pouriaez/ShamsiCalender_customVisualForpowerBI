/**
 * High-precision Solar Hijri (Jalali / شمسی) & Gregorian (میلادی) Converter
 * Accurate astronomical algorithms with full leap year (کبیسه) support.
 * Self-contained without external dependencies for Power BI Report Server compatibility.
 */

export interface JalaliDate {
  jy: number; // Jalali Year (e.g. 1403)
  jm: number; // Jalali Month (1 - 12)
  jd: number; // Jalali Day (1 - 31)
}

export interface GregorianDate {
  gy: number; // Gregorian Year (e.g. 2024)
  gm: number; // Gregorian Month (1 - 12)
  gd: number; // Gregorian Day (1 - 31)
}

export const PERSIAN_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
] as const;

export const PERSIAN_SEASONS = [
  { name: 'بهار', months: [1, 2, 3], color: 'text-emerald-600 bg-emerald-50' },
  { name: 'تابستان', months: [4, 5, 6], color: 'text-amber-600 bg-amber-50' },
  { name: 'پاییز', months: [7, 8, 9], color: 'text-orange-600 bg-orange-50' },
  { name: 'زمستان', months: [10, 11, 12], color: 'text-blue-600 bg-blue-50' }
];

export const PERSIAN_WEEKDAYS = [
  { full: 'شنبه', short: 'ش', index: 0, isWeekend: false },
  { full: 'یکشنبه', short: 'ی', index: 1, isWeekend: false },
  { full: 'دوشنبه', short: 'د', index: 2, isWeekend: false },
  { full: 'سه‌شنبه', short: 'س', index: 3, isWeekend: false },
  { full: 'چهارشنبه', short: 'چ', index: 4, isWeekend: false },
  { full: 'پنج‌شنبه', short: 'پ', index: 5, isWeekend: false },
  { full: 'جمعه', short: 'ج', index: 6, isWeekend: true }
] as const;

/**
 * Check if a Jalali year is a leap year (کبیسه)
 */
export function isJalaliLeapYear(jy: number): boolean {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178
  ];
  let jp = breaks[0];
  let jump: number;

  if (jy < jp || jy >= breaks[breaks.length - 1]) {
    throw new Error('Invalid Jalali year');
  }

  for (let i = 1; i < breaks.length; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    jp = jm;
  }

  let n = jy - jp;
  if (jump! - n < 6) n = n - jump! + Math.floor((jump! + 4) / 33) * 33;
  let leap = ((n + 1) % 33) - 1;
  if (leap === -1) leap = 4;
  return leap % 4 === 0;
}

/**
 * Number of days in a given Jalali month
 */
export function getDaysInJalaliMonth(jy: number, jm: number): number {
  if (jm < 1 || jm > 12) return 30;
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
}

/**
 * Convert Gregorian date to Jalali date
 */
export function toJalali(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = gm > 2 ? gy : gy - 1;
  let days =
    355666 +
    (365 * gy) +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];

  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;

  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  let jm: number;
  let jd: number;

  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }

  return { jy, jm, jd };
}

/**
 * Convert Jalali date to Gregorian date
 */
export function toGregorian(jy: number, jm: number, jd: number): GregorianDate {
  let gy = jy + 621;
  let days =
    -355668 +
    (365 * gy) +
    Math.floor((gy + 3) / 4) -
    Math.floor((gy + 99) / 100) +
    Math.floor((gy + 399) / 400);

  let jdn =
    days +
    (jm <= 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186) +
    jd;

  let g_days = jdn - 355666;
  gy = 400 * Math.floor(g_days / 146097);
  g_days %= 146097;

  let leap = true;
  if (g_days > 36524) {
    g_days--;
    gy += 100 * Math.floor(g_days / 36524);
    g_days %= 36524;
    if (g_days >= 365) g_days++;
    else leap = false;
  }

  gy += 4 * Math.floor(g_days / 1461);
  g_days %= 1461;

  if (g_days > 365) {
    leap = false;
    g_days--;
    gy += Math.floor(g_days / 365);
    g_days %= 365;
  }

  const g_d_m = [
    0,
    31,
    leap ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];

  let gm = 0;
  while (gm < 12 && g_days >= g_d_m[gm + 1]) {
    g_days -= g_d_m[gm + 1];
    gm++;
  }

  return { gy, gm: gm + 1, gd: g_days + 1 };
}

/**
 * Helper to get current Jalali date
 */
export function getCurrentJalaliDate(): JalaliDate {
  const now = new Date();
  return toJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/**
 * Convert standard JS Date object to Jalali
 */
export function dateToJalali(date: Date): JalaliDate {
  return toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/**
 * Convert Jalali Date to standard JS Date object
 */
export function jalaliToDate(j: JalaliDate): Date {
  const g = toGregorian(j.jy, j.jm, j.jd);
  return new Date(g.gy, g.gm - 1, g.gd);
}

/**
 * Get weekday index for a Jalali date (0 = شنبه, ..., 6 = جمعه)
 */
export function getJalaliWeekdayIndex(jy: number, jm: number, jd: number): number {
  const g = toGregorian(jy, jm, jd);
  const jsDay = new Date(g.gy, g.gm - 1, g.gd).getDay(); // 0 is Sunday, 6 is Saturday
  // Map standard JS day to Persian week:
  // Saturday (6) -> 0
  // Sunday (0) -> 1
  // Monday (1) -> 2
  // Tuesday (2) -> 3
  // Wednesday (3) -> 4
  // Thursday (4) -> 5
  // Friday (5) -> 6
  return (jsDay + 1) % 7;
}

/**
 * Format Persian digits
 */
export function toPersianDigits(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (char) => persianDigits[Number(char)]);
}

/**
 * Convert Persian/Arabic digits to English digits
 */
export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (char) => String(char.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (char) => String(char.charCodeAt(0) - 1632));
}

/**
 * Format Jalali date string e.g. 1403/07/25
 */
export function formatJalaliDate(j: JalaliDate, separator = '/', usePersianDigits = true): string {
  const m = String(j.jm).padStart(2, '0');
  const d = String(j.jd).padStart(2, '0');
  const str = `${j.jy}${separator}${m}${separator}${d}`;
  return usePersianDigits ? toPersianDigits(str) : str;
}

/**
 * Format Jalali date into long Persian prose e.g. ۲۵ مهر ۱۴۰۳
 */
export function formatJalaliDateLong(j: JalaliDate, usePersianDigits = true): string {
  const monthName = PERSIAN_MONTH_NAMES[j.jm - 1];
  const str = `${j.jd} ${monthName} ${j.jy}`;
  return usePersianDigits ? toPersianDigits(str) : str;
}

/**
 * Format Gregorian date ISO YYYY-MM-DD
 */
export function formatISODate(g: GregorianDate): string {
  const m = String(g.gm).padStart(2, '0');
  const d = String(g.gd).padStart(2, '0');
  return `${g.gy}-${m}-${d}`;
}

/**
 * Compare two Jalali dates
 * returns: -1 if a < b, 0 if a == b, 1 if a > b
 */
export function compareJalaliDates(a: JalaliDate, b: JalaliDate): number {
  if (a.jy !== b.jy) return a.jy - b.jy > 0 ? 1 : -1;
  if (a.jm !== b.jm) return a.jm - b.jm > 0 ? 1 : -1;
  if (a.jd !== b.jd) return a.jd - b.jd > 0 ? 1 : -1;
  return 0;
}

/**
 * Check if date is equal
 */
export function areJalaliDatesEqual(a?: JalaliDate | null, b?: JalaliDate | null): boolean {
  if (!a || !b) return false;
  return a.jy === b.jy && a.jm === b.jm && a.jd === b.jd;
}

/**
 * Check if a date is within a range inclusive
 */
export function isDateInRange(target: JalaliDate, start?: JalaliDate | null, end?: JalaliDate | null): boolean {
  if (!start && !end) return false;
  if (start && !end) return compareJalaliDates(target, start) === 0;
  if (!start && end) return compareJalaliDates(target, end) === 0;
  if (start && end) {
    return compareJalaliDates(target, start) >= 0 && compareJalaliDates(target, end) <= 0;
  }
  return false;
}

/**
 * Add days to a Jalali date
 */
export function addDaysToJalali(j: JalaliDate, days: number): JalaliDate {
  const g = toGregorian(j.jy, j.jm, j.jd);
  const d = new Date(g.gy, g.gm - 1, g.gd);
  d.setDate(d.getDate() + days);
  return toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
}
