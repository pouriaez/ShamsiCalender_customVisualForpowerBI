import React, { useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  Filter,
  RefreshCw,
  Sliders,
  ChevronDown,
  Maximize2,
  FileSpreadsheet,
  Calendar,
  Layers,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { PersianDatePicker, DateRange } from './PersianDatePicker';
import {
  JalaliDate,
  formatJalaliDate,
  toGregorian,
  formatISODate,
  compareJalaliDates,
  toPersianDigits
} from '../utils/jalali';

interface PowerBIPreviewCanvasProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  usePersianDigits: boolean;
  themeColor: string;
  selectionMode: 'range' | 'single';
  showPresets: boolean;
  popupMode: boolean;
}

// Mock business dataset with dates spanning 1402 to 1404
interface Transaction {
  id: string;
  title: string;
  category: 'سخت‌افزار' | 'نرم‌افزار' | 'خدمات ابری' | 'مشاوره BI';
  amount: number;
  customer: string;
  jalaliDate: JalaliDate;
  status: 'تکمیل شده' | 'در انتظار' | 'مرجوعی';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-101', title: 'لایسنس سالانه سرور سازمانی', category: 'نرم‌افزار', amount: 145000000, customer: 'پتروشیمی خلیج فارس', jalaliDate: { jy: 1403, jm: 1, jd: 15 }, status: 'تکمیل شده' },
  { id: 'TX-102', title: 'تجهیز دیتاسنتر و استوریج', category: 'سخت‌افزار', amount: 320000000, customer: 'بانک ملت', jalaliDate: { jy: 1403, jm: 2, jd: 8 }, status: 'تکمیل شده' },
  { id: 'TX-103', title: 'مشاوره راهبری داده و هوش تجاری', category: 'مشاوره BI', amount: 75000000, customer: 'فولاد مبارکه', jalaliDate: { jy: 1403, jm: 3, jd: 20 }, status: 'تکمیل شده' },
  { id: 'TX-104', title: 'اشتراک سالانه کلاود اختصاصی', category: 'خدمات ابری', amount: 98000000, customer: 'اسنپ', jalaliDate: { jy: 1403, jm: 4, jd: 5 }, status: 'تکمیل شده' },
  { id: 'TX-105', title: 'توسعه داشبوردهای Power BI RS', category: 'مشاوره BI', amount: 115000000, customer: 'همراه اول', jalaliDate: { jy: 1403, jm: 5, jd: 18 }, status: 'تکمیل شده' },
  { id: 'TX-106', title: 'پشتیبانی زیرساخت شبکه و فایروال', category: 'سخت‌افزار', amount: 62000000, customer: 'دیجی‌کالا', jalaliDate: { jy: 1403, jm: 6, jd: 12 }, status: 'تکمیل شده' },
  { id: 'TX-107', title: 'بسته‌های هوش مصنوعی داده‌محور', category: 'نرم‌افزار', amount: 210000000, customer: 'مپنا', jalaliDate: { jy: 1403, jm: 7, jd: 2 }, status: 'تکمیل شده' },
  { id: 'TX-108', title: 'ارتقای معماری پایگاه داده کلود', category: 'خدمات ابری', amount: 88000000, customer: 'بیمه سامان', jalaliDate: { jy: 1403, jm: 7, jd: 19 }, status: 'تکمیل شده' },
  { id: 'TX-109', title: 'مهاجرت دیتابیس به PostgreSQL', category: 'مشاوره BI', amount: 54000000, customer: 'کاله', jalaliDate: { jy: 1403, jm: 8, jd: 14 }, status: 'تکمیل شده' },
  { id: 'TX-110', title: 'سرور پردازش موازی GPU', category: 'سخت‌افزار', amount: 480000000, customer: 'دانشگاه صنعتی شریف', jalaliDate: { jy: 1403, jm: 9, jd: 25 }, status: 'تکمیل شده' },
  { id: 'TX-111', title: 'پکیج انبار داده سازمانی', category: 'نرم‌افزار', amount: 175000000, customer: 'ایران خودرو', jalaliDate: { jy: 1403, jm: 10, jd: 10 }, status: 'تکمیل شده' },
  { id: 'TX-112', title: 'طراحی ویژوال کاستوم شمسی', category: 'مشاوره BI', amount: 45000000, customer: 'بانک صادرات', jalaliDate: { jy: 1403, jm: 11, jd: 6 }, status: 'تکمیل شده' }
];

export const PowerBIPreviewCanvas: React.FC<PowerBIPreviewCanvasProps> = ({
  selectedRange,
  onRangeChange,
  usePersianDigits,
  themeColor,
  selectionMode,
  showPresets,
  popupMode
}) => {
  // Filter mock data according to selected date range
  const filteredData = useMemo(() => {
    if (!selectedRange.start && !selectedRange.end) {
      return MOCK_TRANSACTIONS;
    }
    return MOCK_TRANSACTIONS.filter((item) => {
      if (selectedRange.start && !selectedRange.end) {
        return compareJalaliDates(item.jalaliDate, selectedRange.start) >= 0;
      }
      if (selectedRange.start && selectedRange.end) {
        return (
          compareJalaliDates(item.jalaliDate, selectedRange.start) >= 0 &&
          compareJalaliDates(item.jalaliDate, selectedRange.end) <= 0
        );
      }
      return true;
    });
  }, [selectedRange]);

  // Aggregate Metrics
  const totalSales = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredData]);

  const totalOrders = filteredData.length;
  const avgOrder = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  const uniqueCustomers = new Set(filteredData.map(d => d.customer)).size;

  const displayNum = (num: number | string) => {
    const formatted = typeof num === 'number' ? num.toLocaleString('fa-IR') : num;
    return usePersianDigits ? formatted : String(num).replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) % 10));
  };

  // Convert dates to ISO for Power BI AdvancedFilter inspection preview
  const filterSummary = useMemo(() => {
    if (!selectedRange.start && !selectedRange.end) {
      return { status: 'بدون فیلتر (نمایش کل دوره)', isoStart: null, isoEnd: null };
    }
    const gStart = selectedRange.start
      ? toGregorian(selectedRange.start.jy, selectedRange.start.jm, selectedRange.start.jd)
      : null;
    const gEnd = selectedRange.end
      ? toGregorian(selectedRange.end.jy, selectedRange.end.jm, selectedRange.end.jd)
      : null;

    return {
      status: 'فیلتر فعال',
      isoStart: gStart ? formatISODate(gStart) : null,
      isoEnd: gEnd ? formatISODate(gEnd) : null
    };
  }, [selectedRange]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Power BI Desktop / Report Server Header Simulation */}
      <div className="bg-[#1b2a4a] text-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#f2c811] text-slate-900 font-black text-xs flex items-center justify-center font-sans">
              Pb
            </div>
            <span className="font-semibold text-xs tracking-wide">
              Power BI Report Server &bull; گزارش جامع عملکرد مالی و فروش
            </span>
          </div>
          <span className="text-slate-400 text-xs hidden md:inline">|</span>
          <span className="text-[11px] text-slate-300 hidden md:inline">
            جدول مرجع: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">DimDate_Jalali[Date]</code>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>اتصال زنده دیتابیس (DirectQuery / Import)</span>
          </div>
          <button
            onClick={() => onRangeChange({ start: null, end: null })}
            title="ریست فیلترها"
            className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Report Canvas Content */}
      <div className="p-5 bg-slate-50/60 min-h-[580px]">
        {/* Top Visual Row: The Persian Date Slicer Visual Frame */}
        <div className="mb-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-5 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <span>فیلتر تاریخ شمسی (Custom Visual)</span>
                <span className="text-xs font-normal text-slate-500">
                  - کنترل تعاملی اسلایسر روی سایر نمودارهای داشبورد
                </span>
              </h2>
            </div>

            {/* Filter state indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>وضعیت فیلتر:</span>
              <span className="font-medium text-slate-700">
                {selectedRange.start && selectedRange.end
                  ? `${formatJalaliDate(selectedRange.start, '/', usePersianDigits)} تا ${formatJalaliDate(selectedRange.end, '/', usePersianDigits)}`
                  : selectedRange.start
                  ? `از ${formatJalaliDate(selectedRange.start, '/', usePersianDigits)}`
                  : 'تمام تاریخ‌ها'}
              </span>
              {selectedRange.start && (
                <button
                  onClick={() => onRangeChange({ start: null, end: null })}
                  className="text-rose-600 hover:text-rose-700 font-medium text-xs underline mr-2"
                >
                  حذف فیلتر
                </button>
              )}
            </div>
          </div>

          {/* Slicer Component Mounted */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-full md:w-80">
              <PersianDatePicker
                value={selectedRange}
                onChange={onRangeChange}
                mode={selectionMode}
                usePersianDigits={usePersianDigits}
                themeColor={themeColor}
                showPresets={showPresets}
                popupMode={popupMode}
              />
            </div>

            {/* Realtime Filter & Security Integrity Indicator */}
            <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-600 overflow-x-auto">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-sky-600" />
                  <span>وضعیت فیلتر اسلایسر در دیتامدل Power BI:</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-md px-2 py-0.5 font-medium shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>قفل اصالت و امنیت فعال (پوریا احتشام‌زاده)</span>
                </div>
              </div>
              <div className="text-slate-800 text-[11px] font-medium">
                {selectedRange.start && selectedRange.end ? (
                  <span className="flex items-center gap-2">
                    <span className="text-slate-500">محدوده اعمال فیلتر:</span>
                    <strong className="text-sky-700 font-semibold">
                      {formatJalaliDate(selectedRange.start, '/', usePersianDigits)} تا {formatJalaliDate(selectedRange.end, '/', usePersianDigits)}
                    </strong>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 text-[10px] font-mono" dir="ltr">
                      Target: DimDate[Date] &bull; Status: Locked
                    </span>
                  </span>
                ) : selectedRange.start ? (
                  <span className="flex items-center gap-2">
                    <span className="text-slate-500">شروع از:</span>
                    <strong className="text-sky-700 font-semibold">
                      {formatJalaliDate(selectedRange.start, '/', usePersianDigits)}
                    </strong>
                  </span>
                ) : (
                  <span className="text-slate-400">بدون فیلتر تاریخی (نمایش کامل ۱۲ قرارداد ثبت شده)</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Dynamic Visuals Reacting in Real-Time */}
        <div className="space-y-4">
          {/* KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">فروش کل دوره</div>
                <div className="text-xl font-bold text-slate-900 tabular-nums">
                  {displayNum(Math.round(totalSales / 1000000))} <span className="text-xs font-normal text-slate-500">میلیون تومان</span>
                </div>
                <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+۱۲.۴٪ نسبت به دوره قبل</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">تعداد قرارداد / تراکنش</div>
                <div className="text-xl font-bold text-slate-900 tabular-nums">
                  {displayNum(totalOrders)} <span className="text-xs font-normal text-slate-500">مورد</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  پوشش {displayNum(filteredData.length)} از ۱۲ ثبت شده
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">میانگین ارزش قرارداد</div>
                <div className="text-xl font-bold text-slate-900 tabular-nums">
                  {displayNum(Math.round(avgOrder / 1000000))} <span className="text-xs font-normal text-slate-500">میلیون تومان</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">میانگین فاکتور دوره‌ای</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">مشتریان فعال دوره</div>
                <div className="text-xl font-bold text-slate-900 tabular-nums">
                  {displayNum(uniqueCustomers)} <span className="text-xs font-normal text-slate-500">سازمان</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">سازمان‌های دارای خرید</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Grid Split: Visual 1 Bar Chart & Visual 2 Filtered Transactions Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Visual: Category Breakdown */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-xs text-slate-800">تفکیک فروش بر اساس دسته‌بندی</h3>
                <span className="text-[11px] text-slate-400">Power BI Bar Visual</span>
              </div>

              <div className="space-y-3.5 flex-1 flex flex-col justify-center">
                {[
                  { name: 'سخت‌افزار', color: 'bg-sky-500' },
                  { name: 'نرم‌افزار', color: 'bg-indigo-500' },
                  { name: 'خدمات ابری', color: 'bg-emerald-500' },
                  { name: 'مشاوره BI', color: 'bg-amber-500' }
                ].map((cat) => {
                  const catAmount = filteredData
                    .filter((d) => d.category === cat.name)
                    .reduce((acc, c) => acc + c.amount, 0);
                  const percentage = totalSales > 0 ? Math.round((catAmount / totalSales) * 100) : 0;

                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>{cat.name}</span>
                        <span className="tabular-nums font-semibold">
                          {displayNum(Math.round(catAmount / 1000000))} م.ت ({displayNum(percentage)}٪)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cat.color} transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual: Filtered Transactions Table */}
            <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                  <h3 className="font-semibold text-xs text-slate-800">
                    جدول داده‌های فیلتر شده بر اساس تقویم شمسی
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500">
                  {displayNum(filteredData.length)} ردیف همگام با تاریخ انتخابی
                </span>
              </div>

              <div className="overflow-x-auto flex-1">
                {filteredData.length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs">
                    <Calendar className="w-8 h-8 mb-2 opacity-40" />
                    <span>هیچ داده‌ای در بازه تاریخ شمسی انتخاب شده وجود ندارد</span>
                    <button
                      onClick={() => onRangeChange({ start: null, end: null })}
                      className="mt-2 text-sky-600 hover:underline font-medium"
                    >
                      نمایش کل داده‌ها
                    </button>
                  </div>
                ) : (
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-[11px]">
                        <th className="py-2 px-2.5 font-medium">شناسه</th>
                        <th className="py-2 px-2.5 font-medium">تاریخ شمسی</th>
                        <th className="py-2 px-2.5 font-medium">شرح قرارداد</th>
                        <th className="py-2 px-2.5 font-medium">مشتری</th>
                        <th className="py-2 px-2.5 font-medium text-left">مبلغ (تومان)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredData.slice(0, 6).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-500" dir="ltr">
                            {item.id}
                          </td>
                          <td className="py-2.5 px-2.5 font-medium text-sky-700 whitespace-nowrap">
                            {formatJalaliDate(item.jalaliDate, '/', usePersianDigits)}
                          </td>
                          <td className="py-2.5 px-2.5 text-slate-800 font-medium max-w-[180px] truncate">
                            {item.title}
                          </td>
                          <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap">
                            {item.customer}
                          </td>
                          <td className="py-2.5 px-2.5 text-left font-semibold tabular-nums text-slate-800 whitespace-nowrap" dir="ltr">
                            {displayNum(item.amount.toLocaleString())}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
