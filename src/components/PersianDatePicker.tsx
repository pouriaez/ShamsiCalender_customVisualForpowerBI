import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  Check,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  JalaliDate,
  PERSIAN_MONTH_NAMES,
  PERSIAN_SEASONS,
  PERSIAN_WEEKDAYS,
  toJalali,
  toGregorian,
  getDaysInJalaliMonth,
  getJalaliWeekdayIndex,
  toPersianDigits,
  formatJalaliDate,
  formatJalaliDateLong,
  compareJalaliDates,
  isDateInRange,
  areJalaliDatesEqual,
  getCurrentJalaliDate
} from '../utils/jalali';

export interface DateRange {
  start: JalaliDate | null;
  end: JalaliDate | null;
}

interface PersianDatePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  mode?: 'range' | 'single';
  usePersianDigits?: boolean;
  themeColor?: string;
  showPresets?: boolean;
  popupMode?: boolean;
  onThemeColorChange?: (color: string) => void;
}

export const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  mode = 'range',
  usePersianDigits = true,
  themeColor = '#0284c7',
  showPresets = true,
  popupMode = true
}) => {
  const [isOpen, setIsOpen] = useState(!popupMode);
  const [viewYear, setViewYear] = useState<number>(() => value.start?.jy || getCurrentJalaliDate().jy);
  const [viewMonth, setViewMonth] = useState<number>(() => value.start?.jm || getCurrentJalaliDate().jm);
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const [hoverDate, setHoverDate] = useState<JalaliDate | null>(null);
  const [selectingEnd, setSelectingEnd] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync view when value changes from outside
  useEffect(() => {
    if (value.start) {
      setViewYear(value.start.jy);
      setViewMonth(value.start.jm);
    }
  }, [value.start?.jy, value.start?.jm]);

  // Click outside to close in popup mode
  useEffect(() => {
    if (!popupMode) {
      setIsOpen(true);
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setViewMode('days');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popupMode]);

  const today = getCurrentJalaliDate();

  const handleDayClick = (day: number) => {
    const clicked: JalaliDate = { jy: viewYear, jm: viewMonth, jd: day };

    if (mode === 'single') {
      onChange({ start: clicked, end: clicked });
      if (popupMode) setIsOpen(false);
      return;
    }

    // Range mode
    if (!selectingEnd || !value.start) {
      onChange({ start: clicked, end: null });
      setSelectingEnd(true);
    } else {
      if (compareJalaliDates(clicked, value.start) < 0) {
        onChange({ start: clicked, end: value.start });
      } else {
        onChange({ start: value.start, end: clicked });
      }
      setSelectingEnd(false);
      if (popupMode) setIsOpen(false);
    }
  };

  const handlePrevMonth = () => {
    if (viewMode === 'days') {
      if (viewMonth === 1) {
        setViewMonth(12);
        setViewYear(y => y - 1);
      } else {
        setViewMonth(m => m - 1);
      }
    } else if (viewMode === 'years') {
      setViewYear(y => y - 12);
    }
  };

  const handleNextMonth = () => {
    if (viewMode === 'days') {
      if (viewMonth === 12) {
        setViewMonth(1);
        setViewYear(y => y + 1);
      } else {
        setViewMonth(m => m + 1);
      }
    } else if (viewMode === 'years') {
      setViewYear(y => y + 12);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ start: null, end: null });
    setSelectingEnd(false);
  };

  // Quick Preset Actions
  const applyPreset = (type: string) => {
    const now = getCurrentJalaliDate();
    let start: JalaliDate | null = null;
    let end: JalaliDate | null = null;

    if (type === 'today') {
      start = { ...now };
      end = { ...now };
    } else if (type === 'yesterday') {
      const g = toGregorian(now.jy, now.jm, now.jd);
      const d = new Date(g.gy, g.gm - 1, g.gd);
      d.setDate(d.getDate() - 1);
      const jYest = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
      start = jYest;
      end = jYest;
    } else if (type === 'last7') {
      end = { ...now };
      const g = toGregorian(now.jy, now.jm, now.jd);
      const d = new Date(g.gy, g.gm - 1, g.gd);
      d.setDate(d.getDate() - 6);
      start = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    } else if (type === 'last30') {
      end = { ...now };
      const g = toGregorian(now.jy, now.jm, now.jd);
      const d = new Date(g.gy, g.gm - 1, g.gd);
      d.setDate(d.getDate() - 29);
      start = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    } else if (type === 'thisMonth') {
      start = { jy: now.jy, jm: now.jm, jd: 1 };
      end = { jy: now.jy, jm: now.jm, jd: getDaysInJalaliMonth(now.jy, now.jm) };
    } else if (type === 'lastMonth') {
      const lm = now.jm === 1 ? 12 : now.jm - 1;
      const ly = now.jm === 1 ? now.jy - 1 : now.jy;
      start = { jy: ly, jm: lm, jd: 1 };
      end = { jy: ly, jm: lm, jd: getDaysInJalaliMonth(ly, lm) };
    } else if (type === 'thisYear') {
      start = { jy: now.jy, jm: 1, jd: 1 };
      end = { jy: now.jy, jm: 12, jd: getDaysInJalaliMonth(now.jy, 12) };
    }

    if (start && end) {
      onChange({ start, end });
      setViewYear(start.jy);
      setViewMonth(start.jm);
      if (popupMode) setIsOpen(false);
    }
  };

  // Rendering Helpers
  const firstDayWeekday = getJalaliWeekdayIndex(viewYear, viewMonth, 1);
  const totalDays = getDaysInJalaliMonth(viewYear, viewMonth);

  const displayDigits = (num: number | string) => {
    return usePersianDigits ? toPersianDigits(num) : String(num);
  };

  const getDisplayLabel = () => {
    if (!value.start && !value.end) {
      return (
        <span className="text-slate-400 font-normal">انتخاب تاریخ یا بازه شمسی...</span>
      );
    }
    if (value.start && !value.end) {
      return (
        <span className="font-semibold text-slate-800">
          {formatJalaliDate(value.start, '/', usePersianDigits)}
          <span className="text-xs text-amber-600 font-normal mr-2">(انتخاب تاریخ پایان...)</span>
        </span>
      );
    }
    if (value.start && value.end) {
      if (areJalaliDatesEqual(value.start, value.end)) {
        return (
          <span className="font-semibold text-slate-800">
            {formatJalaliDateLong(value.start, usePersianDigits)}
          </span>
        );
      }
      return (
        <div className="flex items-center gap-2 font-medium text-slate-800">
          <span>{formatJalaliDate(value.start, '/', usePersianDigits)}</span>
          <span className="text-slate-400">تا</span>
          <span>{formatJalaliDate(value.end, '/', usePersianDigits)}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm select-none text-right">
      {/* Trigger Bar (Input Box) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 bg-white rounded-xl border transition-all cursor-pointer shadow-xs ${
          isOpen
            ? 'border-sky-500 ring-3 ring-sky-500/15'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
            style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
          >
            <Calendar className="w-4 h-4" />
          </div>
          <div className="truncate text-sm">{getDisplayLabel()}</div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {(value.start || value.end) && (
            <button
              onClick={clearSelection}
              title="پاک کردن تاریخ"
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-sky-600' : 'group-hover:text-slate-600'
            }`}
          />
        </div>
      </div>

      {/* Calendar Overlay / Dropdown */}
      {isOpen && (
        <div
          className={`${
            popupMode
              ? 'absolute top-full right-0 mt-2 z-50 w-[340px] shadow-2xl rounded-2xl border border-slate-200 bg-white ring-1 ring-slate-900/5'
              : 'mt-2 w-full border border-slate-200 rounded-2xl bg-white shadow-xs'
          } p-4 transition-all animate-in fade-in-50 zoom-in-95`}
        >
          {/* Calendar Top Navigation Header */}
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
            {/* Next Month/Decade Button (in RTL, Next is visually on the right) */}
            <button
              onClick={handleNextMonth}
              title="ماه یا سال بعد"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Month & Year Title Dropdown triggers */}
            <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-800">
              <button
                onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'months'
                    ? 'bg-sky-50 text-sky-700'
                    : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <span>{PERSIAN_MONTH_NAMES[viewMonth - 1]}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              <button
                onClick={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
                className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'years'
                    ? 'bg-sky-50 text-sky-700'
                    : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <span className="tabular-nums">{displayDigits(viewYear)}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </div>

            {/* Prev Month/Decade Button (in RTL, Prev is visually on the left) */}
            <button
              onClick={handlePrevMonth}
              title="ماه یا سال قبل"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* VIEW: Days of Month */}
          {viewMode === 'days' && (
            <div>
              {/* Persian Weekday Headers */}
              <div className="grid grid-cols-7 mb-1 text-center">
                {PERSIAN_WEEKDAYS.map((w) => (
                  <div
                    key={w.index}
                    className={`py-1 text-xs font-semibold ${
                      w.isWeekend ? 'text-rose-500' : 'text-slate-400'
                    }`}
                  >
                    {w.short}
                  </div>
                ))}
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-y-1 text-center">
                {/* Empty initial spacer cells */}
                {Array.from({ length: firstDayWeekday }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-9 w-9" />
                ))}

                {/* Days 1 to Month length */}
                {Array.from({ length: totalDays }).map((_, i) => {
                  const day = i + 1;
                  const currentObj: JalaliDate = {
                    jy: viewYear,
                    jm: viewMonth,
                    jd: day
                  };

                  const isStart = areJalaliDatesEqual(value.start, currentObj);
                  const isEnd = areJalaliDatesEqual(value.end, currentObj);
                  const isSelected = isStart || isEnd;
                  const inRange = isDateInRange(currentObj, value.start, value.end);
                  const isToday = areJalaliDatesEqual(today, currentObj);
                  const weekdayIdx = (firstDayWeekday + i) % 7;
                  const isFriday = weekdayIdx === 6;

                  // Hover range preview
                  const inHoverRange =
                    selectingEnd &&
                    value.start &&
                    hoverDate &&
                    isDateInRange(
                      currentObj,
                      compareJalaliDates(value.start, hoverDate) <= 0 ? value.start : hoverDate,
                      compareJalaliDates(value.start, hoverDate) <= 0 ? hoverDate : value.start
                    );

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayClick(day)}
                      onMouseEnter={() => setHoverDate(currentObj)}
                      className={`h-9 w-9 mx-auto text-xs font-medium rounded-lg transition-all relative flex items-center justify-center ${
                        isSelected
                          ? 'text-white shadow-xs font-semibold'
                          : inRange
                          ? 'bg-sky-50 text-sky-900 rounded-none'
                          : inHoverRange
                          ? 'bg-sky-50/70 text-sky-800'
                          : isFriday
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-slate-700 hover:bg-slate-100'
                      } ${isToday && !isSelected ? 'ring-1 ring-sky-500 font-bold' : ''}`}
                      style={isSelected ? { backgroundColor: themeColor } : {}}
                    >
                      <span className="tabular-nums">{displayDigits(day)}</span>
                      {isToday && !isSelected && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-sky-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: Month Selector Grid (مثل سایت‌های مدرن با دسته‌بندی فصول) */}
          {viewMode === 'months' && (
            <div className="space-y-3 py-1">
              <div className="text-xs text-slate-500 font-medium px-1">
                انتخاب ماه سال {displayDigits(viewYear)}:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PERSIAN_MONTH_NAMES.map((name, idx) => {
                  const mNum = idx + 1;
                  const isCurrentMonth = viewMonth === mNum;
                  const isThisActualMonth = today.jy === viewYear && today.jm === mNum;
                  const season = PERSIAN_SEASONS.find(s => s.months.includes(mNum));

                  return (
                    <button
                      key={name}
                      onClick={() => {
                        setViewMonth(mNum);
                        setViewMode('days');
                      }}
                      className={`p-2.5 rounded-xl text-xs font-medium text-center transition-all flex flex-col items-center justify-center gap-1 border ${
                        isCurrentMonth
                          ? 'text-white border-transparent shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-800'
                      }`}
                      style={isCurrentMonth ? { backgroundColor: themeColor } : {}}
                    >
                      <span className="font-semibold">{name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded ${
                          isCurrentMonth
                            ? 'text-white/80'
                            : season?.color || 'text-slate-400'
                        }`}
                      >
                        {season?.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: Year Selector Grid (۱۲ سال اطراف سال فعلی با کلیک و ناوبری آسان) */}
          {viewMode === 'years' && (
            <div className="space-y-3 py-1">
              <div className="text-xs text-slate-500 font-medium px-1">
                انتخاب سال شمسی:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const y = viewYear - 5 + i;
                  const isSelectedYear = y === viewYear;
                  const isCurrentYear = y === today.jy;

                  return (
                    <button
                      key={y}
                      onClick={() => {
                        setViewYear(y);
                        setViewMode('months');
                      }}
                      className={`p-3 rounded-xl text-xs font-medium transition-all text-center border ${
                        isSelectedYear
                          ? 'text-white border-transparent shadow-xs font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-800'
                      }`}
                      style={isSelectedYear ? { backgroundColor: themeColor } : {}}
                    >
                      <span className="tabular-nums font-semibold text-sm">
                        {displayDigits(y)}
                      </span>
                      {isCurrentYear && (
                        <div className={`text-[10px] mt-0.5 ${isSelectedYear ? 'text-white/80' : 'text-sky-600'}`}>
                          سال جاری
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Filter Presets Row */}
          {showPresets && viewMode === 'days' && (
            <div className="mt-3.5 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-medium text-slate-400 mb-2">فیلترهای سریع:</div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'today', label: 'امروز' },
                  { id: 'yesterday', label: 'دیروز' },
                  { id: 'last7', label: '۷ روز اخیر' },
                  { id: 'last30', label: '۳۰ روز اخیر' },
                  { id: 'thisMonth', label: 'این ماه' },
                  { id: 'lastMonth', label: 'ماه گذشته' },
                  { id: 'thisYear', label: 'امسال' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-colors active:scale-95"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Bar: Developer Credit (Small & Elegant) & Confirm action */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium select-none">
              <span>توسعه‌دهنده:</span>
              <span className="font-semibold text-slate-700">پوریا احتشام‌زاده</span>
            </div>
            {popupMode && (
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                تایید
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
