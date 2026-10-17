import React from 'react';
import {
  Palette,
  Sliders,
  Type,
  Layout,
  Check,
  Calendar,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { VisualConfig } from '../utils/visualTemplate';

interface VisualSettingsPanelProps {
  config: VisualConfig;
  onChange: (updated: Partial<VisualConfig>) => void;
}

const PRESET_COLORS = [
  { name: 'آبی اقیانوسی (Power BI)', hex: '#0284c7' },
  { name: 'فیروزه‌ای اصیل ایرانی', hex: '#0d9488' },
  { name: 'سورمه‌ای سازمانی', hex: '#1e3a8a' },
  { name: 'سبز زمردی', hex: '#059669' },
  { name: 'کهربایی / طلایی', hex: '#d97706' },
  { name: 'مشکی کربن', hex: '#0f172a' },
  { name: 'زرشکی ارغوانی', hex: '#e11d48' }
];

export const VisualSettingsPanel: React.FC<VisualSettingsPanelProps> = ({ config, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Sliders className="w-4 h-4 text-sky-600" />
        <h3 className="font-bold text-slate-800 text-sm">
          تنظیمات و شخصی‌سازی کاستوم ویژوال (Formatting Pane)
        </h3>
      </div>

      {/* Theme Color Picker */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2.5">
          رنگ تم اصلی تقویم (Theme Color):
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => onChange({ themeColor: c.hex })}
              title={c.name}
              className={`w-7 h-7 rounded-lg transition-transform flex items-center justify-center cursor-pointer ${
                config.themeColor === c.hex ? 'scale-110 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {config.themeColor === c.hex && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
          <div className="flex items-center gap-1.5 mr-2">
            <input
              type="color"
              value={config.themeColor}
              onChange={(e) => onChange({ themeColor: e.target.value })}
              className="w-7 h-7 rounded border-0 cursor-pointer p-0"
              title="رنگ دلخواه"
            />
            <span className="text-[11px] font-mono text-slate-500 uppercase">{config.themeColor}</span>
          </div>
        </div>
      </div>

      {/* Grid of Toggle Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        {/* Selection Mode */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="text-xs font-semibold text-slate-700 mb-2">نوع انتخاب تاریخ</div>
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-lg text-xs">
            <button
              onClick={() => onChange({ defaultMode: 'range' })}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                config.defaultMode === 'range' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              بازه تاریخی
            </button>
            <button
              onClick={() => onChange({ defaultMode: 'single' })}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                config.defaultMode === 'single' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              تک تاریخ
            </button>
          </div>
        </div>

        {/* Display Style: Popup vs Inline */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="text-xs font-semibold text-slate-700 mb-2">نحوه نمایش تقویم</div>
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-lg text-xs">
            <button
              onClick={() => onChange({ popupStyle: true })}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                config.popupStyle ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              پاپ‌آپ (وبسایت)
            </button>
            <button
              onClick={() => onChange({ popupStyle: false })}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                !config.popupStyle ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              تعبیه شده (Inline)
            </button>
          </div>
        </div>

        {/* Persian Digits Toggle */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-700">ارقام فارسی</div>
            <div className="text-[11px] text-slate-500">
              {config.usePersianDigits ? 'ارقام ۱۲۳ فارسی' : 'ارقام 123 لاتین'}
            </div>
          </div>
          <button
            onClick={() => onChange({ usePersianDigits: !config.usePersianDigits })}
            className="text-sky-600 cursor-pointer p-1"
          >
            {config.usePersianDigits ? (
              <ToggleRight className="w-7 h-7 fill-sky-600" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-400" />
            )}
          </button>
        </div>

        {/* Quick Presets Toggle */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-700">فیلترهای سریع</div>
            <div className="text-[11px] text-slate-500">
              {config.showPresets ? 'امروز، این ماه و ...' : 'مخفی'}
            </div>
          </div>
          <button
            onClick={() => onChange({ showPresets: !config.showPresets })}
            className="text-sky-600 cursor-pointer p-1"
          >
            {config.showPresets ? (
              <ToggleRight className="w-7 h-7 fill-sky-600" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
