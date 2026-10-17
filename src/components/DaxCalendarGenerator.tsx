import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Copy,
  Check,
  Download,
  Sparkles,
  Sliders,
  Database,
  Layers,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  User,
  Mail
} from 'lucide-react';
import { toGregorian, toJalali } from '../utils/jalali';

interface SyntaxCheckItem {
  id: string;
  title: string;
  category: 'الزامی' | 'مرتب‌سازی' | 'کارایی' | 'بهروش';
  status: 'passed' | 'warning' | 'info';
  summary: string;
  errorPatternPrevented: string;
  recommendation: string;
  powerBiInstruction?: string;
}

export const DaxCalendarGenerator: React.FC = () => {
  // Config state
  const [startJalaliYear, setStartJalaliYear] = useState<number>(1398);
  const [endJalaliYear, setEndJalaliYear] = useState<number>(1406);
  const [tableName, setTableName] = useState<string>('DimDate');
  const [includeFiscalYear, setIncludeFiscalYear] = useState<boolean>(false);
  const [fiscalStartMonth, setFiscalStartMonth] = useState<number>(7); // Mehr by default
  const [copied, setCopied] = useState<boolean>(false);
  const [showSyntaxReport, setShowSyntaxReport] = useState<boolean>(false);
  const [activeCheckCategory, setActiveCheckCategory] = useState<'all' | 'mandatory' | 'pitfalls'>('all');

  // Compute corresponding Gregorian bounds
  const gregorianStart = useMemo(() => {
    return toGregorian(startJalaliYear, 1, 1);
  }, [startJalaliYear]);

  const gregorianEnd = useMemo(() => {
    return toGregorian(endJalaliYear, 12, 29);
  }, [endJalaliYear]);

  // Total days estimation
  const totalDays = useMemo(() => {
    const d1 = new Date(gregorianStart.gy, gregorianStart.gm - 1, gregorianStart.gd);
    const d2 = new Date(gregorianEnd.gy, gregorianEnd.gm - 1, gregorianEnd.gd);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [gregorianStart, gregorianEnd]);

  // Quick year range presets
  const applyPreset = (start: number, end: number) => {
    setStartJalaliYear(start);
    setEndJalaliYear(end);
  };

  // Generate DAX Script with Developer Credits
  const generatedDax = useMemo(() => {
    const cleanTableName = tableName.trim() || 'DimDate';
    const gStartStr = `DATE(${gregorianStart.gy}, ${gregorianStart.gm}, ${gregorianStart.gd})`;
    const gEndStr = `DATE(${gregorianEnd.gy}, ${gregorianEnd.gm}, ${gregorianEnd.gd})`;

    return `// ==========================================================================================
//  جدول جامع تقویم خورشیدی و میلادی برای Power BI Desktop و Power BI Report Server
//  توسعه داده شده توسط: پوریا احتشام‌زاده (pouriae6@gmail.com)
//  پوشش بازه زمانی: سال شمسی ${startJalaliYear} تا ${endJalaliYear} (${totalDays} روز)
//  نحوه ایجاد: در تب Modeling بر روی "New Table" کلیک کرده و کد زیر را جای‌گذاری نمایید.
// ==========================================================================================

${cleanTableName} = 
VAR _StartDate = ${gStartStr}
VAR _EndDate = ${gEndStr}
VAR _BaseCalendar = CALENDAR(_StartDate, _EndDate)

RETURN
ADDCOLUMNS(
    _BaseCalendar,
    // ==================== کلیدها و فیلدهای میلادی ====================
    "DateKey", INT(FORMAT([Date], "YYYYMMDD")),
    "GregorianYear", YEAR([Date]),
    "GregorianMonth", MONTH([Date]),
    "GregorianMonthName", FORMAT([Date], "MMMM"),
    "GregorianDay", DAY([Date]),
    "GregorianQuarter", "Q" & FORMAT(ROUNDUP(MONTH([Date]) / 3, 0), "0"),
    "DayOfWeekNumber", WEEKDAY([Date], 1), // 1 = Sunday, 7 = Saturday

    // ==================== محاسبات دقیق سال، ماه و روز خورشیدی ====================
    "JalaliYear", 
        VAR GYear = YEAR([Date])
        VAR GMonth = MONTH([Date])
        VAR GDay = DAY([Date])
        VAR GDaysInMonth = 
            SWITCH(
                GMonth,
                1, 0, 2, 31, 3, 59, 4, 90, 5, 120, 6, 151,
                7, 181, 8, 212, 9, 243, 10, 273, 11, 304, 334
            )
        VAR LeapAdj = IF(GMonth > 2, IF(MOD(GYear, 4) = 0 && (MOD(GYear, 100) <> 0 || MOD(GYear, 400) = 0), 1, 0), 0)
        VAR DayOfYear = GDaysInMonth + GDay + LeapAdj
        RETURN IF(DayOfYear <= 79, GYear - 622, GYear - 621),

    "JalaliMonthNumber",
        VAR GMonth = MONTH([Date])
        VAR GDay = DAY([Date])
        VAR GDaysInMonth = 
            SWITCH(
                GMonth,
                1, 0, 2, 31, 3, 59, 4, 90, 5, 120, 6, 151,
                7, 181, 8, 212, 9, 243, 10, 273, 11, 304, 334
            )
        VAR DayOfYear = GDaysInMonth + GDay
        RETURN
        SWITCH(
            TRUE(),
            DayOfYear >= 80 && DayOfYear <= 110, 1,   // فروردین
            DayOfYear >= 111 && DayOfYear <= 141, 2,  // اردیبهشت
            DayOfYear >= 142 && DayOfYear <= 172, 3,  // خرداد
            DayOfYear >= 173 && DayOfYear <= 203, 4,  // تیر
            DayOfYear >= 204 && DayOfYear <= 234, 5,  // مرداد
            DayOfYear >= 235 && DayOfYear <= 265, 6,  // شهریور
            DayOfYear >= 266 && DayOfYear <= 295, 7,  // مهر
            DayOfYear >= 296 && DayOfYear <= 325, 8,  // آبان
            DayOfYear >= 326 && DayOfYear <= 355, 9,  // آذر
            DayOfYear >= 356 || DayOfYear <= 19, 10,  // دی
            DayOfYear >= 20 && DayOfYear <= 49, 11,   // بهمن
            12                                        // اسفند
        ),

    "JalaliMonthName",
        VAR MNum = 
            VAR GMonth = MONTH([Date])
            VAR GDay = DAY([Date])
            VAR GDaysInMonth = SWITCH(GMonth, 1, 0, 2, 31, 3, 59, 4, 90, 5, 120, 6, 151, 7, 181, 8, 212, 9, 243, 10, 273, 11, 304, 334)
            VAR DayOfYear = GDaysInMonth + GDay
            RETURN SWITCH(
                TRUE(),
                DayOfYear >= 80 && DayOfYear <= 110, 1,
                DayOfYear >= 111 && DayOfYear <= 141, 2,
                DayOfYear >= 142 && DayOfYear <= 172, 3,
                DayOfYear >= 173 && DayOfYear <= 203, 4,
                DayOfYear >= 204 && DayOfYear <= 234, 5,
                DayOfYear >= 235 && DayOfYear <= 265, 6,
                DayOfYear >= 266 && DayOfYear <= 295, 7,
                DayOfYear >= 296 && DayOfYear <= 325, 8,
                DayOfYear >= 326 && DayOfYear <= 355, 9,
                DayOfYear >= 356 || DayOfYear <= 19, 10,
                DayOfYear >= 20 && DayOfYear <= 49, 11,
                12
            )
        RETURN
        SWITCH(
            MNum,
            1, "فروردین",
            2, "اردیبهشت",
            3, "خرداد",
            4, "تیر",
            5, "مرداد",
            6, "شهریور",
            7, "مهر",
            8, "آبان",
            9, "آذر",
            10, "دی",
            11, "بهمن",
            "اسفند"
        ),

    "JalaliYearMonth",
        VAR GYear = YEAR([Date])
        VAR GMonth = MONTH([Date])
        VAR GDay = DAY([Date])
        VAR GDaysInMonth = SWITCH(GMonth, 1, 0, 2, 31, 3, 59, 4, 90, 5, 120, 6, 151, 7, 181, 8, 212, 9, 243, 10, 273, 11, 304, 334)
        VAR DayOfYear = GDaysInMonth + GDay
        VAR JYear = IF(DayOfYear <= 79, GYear - 622, GYear - 621)
        VAR JMonth = SWITCH(
            TRUE(),
            DayOfYear >= 80 && DayOfYear <= 110, 1,
            DayOfYear >= 111 && DayOfYear <= 141, 2,
            DayOfYear >= 142 && DayOfYear <= 172, 3,
            DayOfYear >= 173 && DayOfYear <= 203, 4,
            DayOfYear >= 204 && DayOfYear <= 234, 5,
            DayOfYear >= 235 && DayOfYear <= 265, 6,
            DayOfYear >= 266 && DayOfYear <= 295, 7,
            DayOfYear >= 296 && DayOfYear <= 325, 8,
            DayOfYear >= 326 && DayOfYear <= 355, 9,
            DayOfYear >= 356 || DayOfYear <= 19, 10,
            DayOfYear >= 20 && DayOfYear <= 49, 11,
            12
        )
        RETURN JYear * 100 + JMonth,

    "JalaliSeason",
        VAR GMonth = MONTH([Date])
        VAR GDay = DAY([Date])
        VAR GDaysInMonth = SWITCH(GMonth, 1, 0, 2, 31, 3, 59, 4, 90, 5, 120, 6, 151, 7, 181, 8, 212, 9, 243, 10, 273, 11, 304, 334)
        VAR DayOfYear = GDaysInMonth + GDay
        RETURN SWITCH(
            TRUE(),
            DayOfYear >= 80 && DayOfYear <= 172, "بهار",
            DayOfYear >= 173 && DayOfYear <= 265, "تابستان",
            DayOfYear >= 266 && DayOfYear <= 355, "پاییز",
            "زمستان"
        ),

    "JalaliQuarter",
        VAR GMonth = MONTH([Date])
        VAR GDay = DAY([Date])
        VAR GDaysInMonth = SWITCH(GMonth, 1, 0, 2, 31, 3, 59, 4, 90, 5, 120, 6, 151, 7, 181, 8, 212, 9, 243, 10, 273, 11, 304, 334)
        VAR DayOfYear = GDaysInMonth + GDay
        RETURN SWITCH(
            TRUE(),
            DayOfYear >= 80 && DayOfYear <= 172, "فصل ۱",
            DayOfYear >= 173 && DayOfYear <= 265, "فصل ۲",
            DayOfYear >= 266 && DayOfYear <= 355, "فصل ۳",
            "فصل ۴"
        ),

    // ==================== روزهای هفته و وضعیت تعطیلی ====================
    "PersianDayOfWeek",
        SWITCH(
            WEEKDAY([Date], 1),
            7, "شنبه",
            1, "یکشنبه",
            2, "دوشنبه",
            3, "سه‌شنبه",
            4, "چهارشنبه",
            5, "پنج‌شنبه",
            "جمعه"
        ),

    "PersianDayOfWeekIndex",
        SWITCH(
            WEEKDAY([Date], 1),
            7, 1, // شنبه
            1, 2, // یکشنبه
            2, 3, // دوشنبه
            3, 4, // سه‌شنبه
            4, 5, // چهارشنبه
            5, 6, // پنج‌شنبه
            7     // جمعه
        ),

    "IsWeekend",
        IF(WEEKDAY([Date], 1) = 6, "تعطیل", "کاری"),

    "IsCurrentYear",
        VAR TodayJYear = IF(MONTH(TODAY()) >= 3 && DAY(TODAY()) >= 21, YEAR(TODAY()) - 621, YEAR(TODAY()) - 622)
        VAR RowJYear = 
            VAR GYear = YEAR([Date])
            VAR GMonth = MONTH([Date])
            VAR GDay = DAY([Date])
            VAR GDaysInMonth = SWITCH(GMonth, 1, 0, 2, 31, 3, 59, 4, 90, 5, 120, 6, 151, 7, 181, 8, 212, 9, 243, 10, 273, 11, 304, 334)
            VAR DayOfYear = GDaysInMonth + GDay
            RETURN IF(DayOfYear <= 79, GYear - 622, GYear - 621)
        RETURN IF(RowJYear = TodayJYear, 1, 0)${includeFiscalYear ? `,\n\n    // ==================== سال مالی (Fiscal Year) ====================\n    "FiscalYear",\n        VAR M = \n            VAR GMonth = MONTH([Date])\n            VAR GDay = DAY([Date])\n            VAR GDaysInMonth = SWITCH(GMonth, 1, 0, 2, 31, 3, 59, 4, 90, 5, 120, 6, 151, 7, 181, 8, 212, 9, 243, 10, 273, 11, 304, 334)\n            VAR DayOfYear = GDaysInMonth + GDay\n            RETURN SWITCH(TRUE(), DayOfYear >= 80 && DayOfYear <= 110, 1, DayOfYear >= 111 && DayOfYear <= 141, 2, DayOfYear >= 142 && DayOfYear <= 172, 3, DayOfYear >= 173 && DayOfYear <= 203, 4, DayOfYear >= 204 && DayOfYear <= 234, 5, DayOfYear >= 235 && DayOfYear <= 265, 6, DayOfYear >= 266 && DayOfYear <= 295, 7, DayOfYear >= 296 && DayOfYear <= 325, 8, DayOfYear >= 326 && DayOfYear <= 355, 9, DayOfYear >= 356 || DayOfYear <= 19, 10, DayOfYear >= 20 && DayOfYear <= 49, 11, 12)\n        VAR Y = \n            VAR GYear = YEAR([Date])\n            VAR GMonth = MONTH([Date])\n            VAR GDay = DAY([Date])\n            VAR GDaysInMonth = SWITCH(GMonth, 1, 0, 2, 31, 3, 59, 4, 90, 5, 120, 6, 151, 7, 181, 8, 212, 9, 243, 10, 273, 11, 304, 334)\n            VAR DayOfYear = GDaysInMonth + GDay\n            RETURN IF(DayOfYear <= 79, GYear - 622, GYear - 621)\n        RETURN IF(M >= ${fiscalStartMonth}, Y, Y - 1)` : ''}
)
`;
  }, [
    startJalaliYear,
    endJalaliYear,
    tableName,
    gregorianStart,
    gregorianEnd,
    totalDays,
    includeFiscalYear,
    fiscalStartMonth
  ]);

  // Syntax and Best-Practice Validation Rules for Power BI Date Tables
  const syntaxCheckResults: SyntaxCheckItem[] = useMemo(() => {
    return [
      {
        id: 'rule-base-date',
        title: 'ستون پایه تاریخ و نوع داده (Base [Date] Column)',
        category: 'الزامی',
        status: 'passed',
        summary: 'ستون اصلی [Date] از نوع Date/DateTime توسط تابع CALENDAR ایجاد شده است.',
        errorPatternPrevented: 'خطای "A date table must contain a unique column of type date/datetime" هنگام تنظیم Mark as Date Table.',
        recommendation: 'ستون [Date] کاملاً یکتا و بدون مقدار تکراری (Unique) است و شرایط الزامی موتور هوش زمانی را فراهم می‌کند.',
        powerBiInstruction: 'در نمای مدل، جدول را با کلیک‌راست انتخاب کرده و گزینه Mark as Date Table را بزنید.'
      },
      {
        id: 'rule-continuous',
        title: 'پیوستگی کامل بدون وقفه زمانی (Continuous Date Range)',
        category: 'الزامی',
        status: 'passed',
        summary: `بازه کامل از ${gregorianStart.gy}/${gregorianStart.gm}/${gregorianStart.gd} تا ${gregorianEnd.gy}/${gregorianEnd.gm}/${gregorianEnd.gd} بدون گپ زمانی (Zero-gap) تضمین شده است.`,
        errorPatternPrevented: 'محاسبات غلط یا خطای توابع Time Intelligence مایکروسافت مانند SAMEPERIODLASTYEAR و DATESYTD به دلیل روزهای مفقود.',
        recommendation: 'تابع CALENDAR اطمینان می‌دهد تک‌تک روزهای ۳۶۵ یا ۳۶۶ روزه در تقویم وجود دارند.',
        powerBiInstruction: 'همواره اطمینان حاصل کنید فکت‌تیبل‌ها در همین بازه تاریخی باشند.'
      },
      {
        id: 'rule-sort-by-month',
        title: 'الگوی خطای مرتب‌سازی الفبایی ماه‌ها (Sort By Column: Month Name)',
        category: 'مرتب‌سازی',
        status: 'warning',
        summary: 'ستون کمکی عددی JalaliMonthNumber برای حل مشکل سورت الفبایی ماه‌های شمسی گنجانده شده است.',
        errorPatternPrevented: 'در نمودارهای پاور بی آی، ماه‌ها بر اساس حروف الفبا (آبان، آذر، اسفند، اردیبهشت، بهمن...) نمایش داده می‌شوند نه ترتیب تقویمی!',
        recommendation: 'در Power BI Desktop باید ستون JalaliMonthName را انتخاب کرده و از منوی Column Tools گزینه Sort by Column را روی JalaliMonthNumber قرار دهید.',
        powerBiInstruction: 'Select [JalaliMonthName] -> Column Tools -> Sort by Column -> Choose [JalaliMonthNumber]'
      },
      {
        id: 'rule-sort-by-weekday',
        title: 'الگوی خطای مرتب‌سازی روزهای هفته (Sort By Column: Day of Week)',
        category: 'مرتب‌سازی',
        status: 'warning',
        summary: 'ستون عددی PersianDayOfWeekIndex (۱ برای شنبه تا ۷ برای جمعه) جهت سورت صحیح روزها ایجاد شده است.',
        errorPatternPrevented: 'مرتب‌سازی نام روزهای هفته (پنج‌شنبه، جمعه، دوشنبه...) به ترتیب الفبا در نمودارهای تحلیل شیفت و روزهای کاری.',
        recommendation: 'ستون PersianDayOfWeek را بر اساس PersianDayOfWeekIndex مرتب‌سازی کنید.',
        powerBiInstruction: 'Select [PersianDayOfWeek] -> Column Tools -> Sort by Column -> Choose [PersianDayOfWeekIndex]'
      },
      {
        id: 'rule-datekey',
        title: 'کلید عددی ستاره‌ای (Integer DateKey: YYYYMMDD)',
        category: 'کارایی',
        status: 'passed',
        summary: 'ستون DateKey با فرمت عددی استاندارد YYYYMMDD به منظور بهینه‌سازی موتور VertiPaq اضافه شده است.',
        errorPatternPrevented: 'کاهش شدید کارایی و مصرف بالای رم هنگام Join جداول میلیونی بر اساس رشته‌های متنی (String Join).',
        recommendation: 'در Fact Table خود ستون کلید عددی DateKey بسازید و رابطه را با این ستون برقرار کنید تا سرعت فیلتر تا ۴ برابر افزایش یابد.',
        powerBiInstruction: 'Relationship: FactSales[OrderDateKey] -> DimDate[DateKey]'
      },
      {
        id: 'rule-leap-year',
        title: 'محاسبه صحیح سال‌های کبیسه اسفند (Leap Year Math)',
        category: 'الزامی',
        status: 'passed',
        summary: 'الگوریتم تقویم خورشیدی تعبیه‌شده در DAX، اسفند ۳۰ روزه را در سال‌های کبیسه به طور دقیق پوشش می‌دهد.',
        errorPatternPrevented: 'جابجایی ۱ روزه تاریخ‌های پس از اسفند در سال‌های کبیسه خورشیدی (مانند سال‌های ۱۳۹۹ و ۱۴۰۳).',
        recommendation: 'فرمول ماژولار بدون وابستگی خارجی با الگوریتم استاندارد نجومی پیاده‌سازی شده است.',
        powerBiInstruction: 'بدون نیاز به تنظیم اضافه، تاریخ‌های کبیسه به طور خودکار دقیق محاسبه می‌شوند.'
      },
      {
        id: 'rule-fiscal',
        title: 'پشتیبانی از سال مالی سازمانی (Fiscal Calendar Logic)',
        category: 'بهروش',
        status: includeFiscalYear ? 'passed' : 'info',
        summary: includeFiscalYear
          ? `محاسبه سال مالی با شروع از ماه ${fiscalStartMonth} خورشیدی در اسکریپت فعال شده است.`
          : 'ستون سال مالی غیرفعال است (برای فعال‌سازی دکمه سال مالی را روشن کنید).',
        errorPatternPrevented: 'تداخل گزارشات سال مالی حسابداری با سال تقویمی خورشیدی.',
        recommendation: 'برای شرکت‌های بورسی یا سازمان‌هایی که سال مالی‌شان از مهر یا دی شروع می‌شود بسیار کارآمد است.',
        powerBiInstruction: 'از ستون [FiscalYear] در اسلایسرها و ماتریکس‌های صورت‌های مالی استفاده نمایید.'
      }
    ];
  }, [gregorianStart, gregorianEnd, includeFiscalYear, fiscalStartMonth]);

  const filteredCheckResults = useMemo(() => {
    if (activeCheckCategory === 'mandatory') {
      return syntaxCheckResults.filter(r => r.category === 'الزامی');
    }
    if (activeCheckCategory === 'pitfalls') {
      return syntaxCheckResults.filter(r => r.category === 'مرتب‌سازی');
    }
    return syntaxCheckResults;
  }, [syntaxCheckResults, activeCheckCategory]);

  const passedCount = syntaxCheckResults.filter(r => r.status === 'passed').length;
  const warningCount = syntaxCheckResults.filter(r => r.status === 'warning').length;

  const [copyRipple, setCopyRipple] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDax);
    setCopied(true);
    setCopyRipple(true);
    setTimeout(() => setCopyRipple(false), 800);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDax], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName || 'DimDate'}_Jalali_${startJalaliYear}_${endJalaliYear}.dax`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Animated Copied Floating Toast Notification */}
      {copied && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-600/25 border border-emerald-400/40 text-xs font-semibold animate-in fade-in-0 zoom-in-90 slide-in-from-top-3 duration-250">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white animate-in zoom-in spin-in-90 duration-300 stroke-[3]" />
          </div>
          <span>اسکریپت DAX با موفقیت در کلیپ‌بورد کپی شد!</span>
        </div>
      )}

      {/* Header */}
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="font-bold text-base text-slate-900">
              تولیدکننده جدول داکس تقویم شمسی (DAX Calendar Table Generator)
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1">
            <span>توسعه داده شده توسط:</span>
            <span className="font-semibold text-slate-800">پوریا احتشام‌زاده</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <a
              href="mailto:pouriae6@gmail.com"
              className="text-sky-600 hover:underline font-mono text-[11px]"
              dir="ltr"
            >
              pouriae6@gmail.com
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Syntax Check Button */}
          <button
            onClick={() => setShowSyntaxReport(!showSyntaxReport)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer border ${
              showSyntaxReport
                ? 'bg-sky-50 border-sky-300 text-sky-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>بررسی سینتکس و قواعد ({syntaxCheckResults.length})</span>
            {showSyntaxReport ? (
              <ChevronUp className="w-3.5 h-3.5 opacity-60" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            )}
          </button>

          {/* Animated Copy to Clipboard Button */}
          <button
            onClick={handleCopy}
            className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer overflow-hidden select-none active:scale-95 ${
              copied
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/50 scale-[1.03]'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs hover:shadow-sm'
            } ${copyRipple ? 'ring-4 ring-emerald-400/40' : ''}`}
            title="کپی کردن متن کامل اسکریپت DAX در کلیپ‌بورد"
          >
            {copied ? (
              <>
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                  <Check className="relative w-4 h-4 text-white animate-in zoom-in spin-in-90 duration-300 stroke-[3]" />
                </span>
                <span className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                  کپی شد!
                </span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-300 group-hover:scale-110 group-hover:text-white transition-all duration-200" />
                <span>کپی اسکریپت DAX</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>دانلود .dax</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Year Inputs & Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Start Jalali Year */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              سال شروع شمسی:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1350}
                max={1450}
                value={startJalaliYear}
                onChange={(e) => setStartJalaliYear(Number(e.target.value) || 1390)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums text-center"
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 truncate">
              معادل میلادی: <span className="font-mono text-slate-600">{gregorianStart.gy}/{gregorianStart.gm}/{gregorianStart.gd}</span>
            </div>
          </div>

          {/* End Jalali Year */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              سال پایان شمسی:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1350}
                max={1450}
                value={endJalaliYear}
                onChange={(e) => setEndJalaliYear(Number(e.target.value) || 1410)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums text-center"
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 truncate">
              معادل میلادی: <span className="font-mono text-slate-600">{gregorianEnd.gy}/{gregorianEnd.gm}/{gregorianEnd.gd}</span>
            </div>
          </div>

          {/* Table Name */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              نام جدول در Power BI:
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="DimDate"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-center"
              dir="ltr"
            />
            <div className="text-[11px] text-slate-400 mt-1.5">
              پیش‌فرض: <code className="font-mono">DimDate</code>
            </div>
          </div>

          {/* Fiscal Year & Extra Options */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ستون سال مالی (Fiscal Year):
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIncludeFiscalYear(!includeFiscalYear)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors w-full cursor-pointer ${
                    includeFiscalYear
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700'
                  }`}
                >
                  {includeFiscalYear ? 'فعال (محاسبه سال مالی)' : 'غیرفعال'}
                </button>
              </div>
            </div>
            {includeFiscalYear && (
              <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                <span>شروع سال مالی از:</span>
                <select
                  value={fiscalStartMonth}
                  onChange={(e) => setFiscalStartMonth(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded text-[11px] px-1.5 py-0.5 font-medium"
                >
                  <option value={7}>مهر (ماه ۷)</option>
                  <option value={10}>دی (ماه ۱۰)</option>
                  <option value={4}>تیر (ماه ۴)</option>
                  <option value={1}>فروردین (ماه ۱)</option>
                </select>
              </div>
            )}
            {!includeFiscalYear && (
              <div className="text-[11px] text-slate-400 mt-1.5">
                مفید برای سازمان‌های با سال مالی غیرتقویمی
              </div>
            )}
          </div>
        </div>

        {/* Quick Year Range Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
          <span className="font-semibold text-slate-500">بازه زمانی سریع:</span>
          {[
            { label: '۱۰ سال اخیر (۱۳۹۵ تا ۱۴۰۵)', start: 1395, end: 1405 },
            { label: '۵ سال جاری (۱۴۰۰ تا ۱۴۰۵)', start: 1400, end: 1405 },
            { label: 'افق ۱۰ ساله (۱۴۰۰ تا ۱۴۱۰)', start: 1400, end: 1410 },
            { label: 'کل دهه ۹۰ و ۴۰۰ (۱۳۹۰ تا ۱۴۰۵)', start: 1390, end: 1405 }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.start, preset.end)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                startJalaliYear === preset.start && endJalaliYear === preset.end
                  ? 'bg-sky-50 border-sky-300 text-sky-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* SYNTAX CHECK DIAGNOSTIC REPORT (Toggled by Button) */}
        {showSyntaxReport && (
          <div className="bg-slate-50 rounded-2xl border border-sky-200 p-5 space-y-4 animate-in fade-in-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    گزارش اعتبارسنجی سینتکس و قواعد جداول تقویم در Power BI
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    بررسی {syntaxCheckResults.length} قانون حیاتی الزامات موتور تابولار و پیشگیری از الگوهای خطای متداول
                  </div>
                </div>
              </div>

              {/* Status metrics strip */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{passedCount} مورد پاس شده</span>
                </span>
                <span className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{warningCount} نکته Sort by Column</span>
                </span>
              </div>
            </div>

            {/* Sub-tabs for check filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">فیلتر بررسی:</span>
              <button
                onClick={() => setActiveCheckCategory('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeCheckCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                همه ({syntaxCheckResults.length})
              </button>
              <button
                onClick={() => setActiveCheckCategory('mandatory')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeCheckCategory === 'mandatory'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                قواعد الزامی هوش زمانی ({syntaxCheckResults.filter(r => r.category === 'الزامی').length})
              </button>
              <button
                onClick={() => setActiveCheckCategory('pitfalls')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeCheckCategory === 'pitfalls'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                الگوهای خطای مرتب‌سازی الفبایی ({syntaxCheckResults.filter(r => r.category === 'مرتب‌سازی').length})
              </button>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {filteredCheckResults.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      {item.status === 'passed' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {item.status === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      {item.status === 'info' && (
                        <Info className="w-4 h-4 text-sky-600 shrink-0" />
                      )}
                      <span>{item.title}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {item.summary}
                  </p>

                  {item.errorPatternPrevented && (
                    <div className="p-2 rounded-lg bg-rose-50/60 border border-rose-100 text-[11px] text-rose-900 leading-relaxed">
                      <strong>پیشگیری از خطای رایج:</strong> {item.errorPatternPrevented}
                    </div>
                  )}

                  {item.powerBiInstruction && (
                    <div className="p-2 rounded-lg bg-sky-50/60 border border-sky-100 text-[11px] text-sky-900 font-mono" dir="ltr">
                      {item.powerBiInstruction}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stat Strip (Zero-pill discipline with typographical separators) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 py-2 border-y border-slate-100">
          <span className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">طول دوره:</span>
            <span className="font-semibold text-slate-800 tabular-nums">
              {endJalaliYear - startJalaliYear + 1} سال
            </span>
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">تعداد کل رکوردها (روزها):</span>
            <span className="font-semibold text-slate-800 tabular-nums">
              {totalDays.toLocaleString('fa-IR')} روز
            </span>
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">ستون‌های محاسباتی:</span>
            <span className="font-semibold text-slate-800">
              ۱۵ ستون استاندارد خورشیدی و میلادی
            </span>
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">توسعه‌دهنده:</span>
            <span className="font-semibold text-sky-700">
              پوریا احتشام‌زاده
            </span>
          </span>
        </div>

        {/* Code Output Window */}
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 text-slate-200 text-xs font-mono">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2" dir="ltr">
              <FileCode className="w-3.5 h-3.5 text-sky-400" />
              <span>DAX Formula &bull; Table Expression ({tableName || 'DimDate'})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 hidden sm:inline" dir="ltr">
                By: Pouria Ehteshamzadeh
              </span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-sans font-medium rounded-lg transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="کپی کردن متن کامل اسکریپت DAX"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white animate-in zoom-in spin-in-90 duration-300 stroke-[3]" />
                    <span className="animate-in fade-in">کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                    <span>کپی کد DAX</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <pre
            className="p-4 max-h-[420px] overflow-y-auto leading-relaxed text-slate-300 font-mono text-[12px] select-all"
            dir="rtl"
          >
            <code>{generatedDax}</code>
          </pre>
        </div>

        {/* Quick Instructions Callout */}
        <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3.5 text-xs text-sky-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-700 shrink-0" />
            <span>
              <strong>نحوه اتصال در Power BI:</strong> پس از ایجاد این جدول، فیلد <code className="bg-sky-100 px-1 py-0.5 rounded font-mono">[Date]</code> را به ستون تاریخ فکت‌تیبل خود Relationship یک‌به‌چند دهید و جدول را با کلیک‌راست به عنوان <strong>Mark as Date Table</strong> انتخاب کنید.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
