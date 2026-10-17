/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Server,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  HelpCircle,
  Database,
  ArrowDown
} from 'lucide-react';
import { PersianDatePicker, DateRange } from './components/PersianDatePicker';
import { PowerBIPreviewCanvas } from './components/PowerBIPreviewCanvas';
import { CustomVisualPackager } from './components/CustomVisualPackager';
import { VisualSettingsPanel } from './components/VisualSettingsPanel';
import { DaxCalendarGenerator } from './components/DaxCalendarGenerator';
import { PbirsGuideModal } from './components/PbirsGuideModal';
import { VisualConfig, DEFAULT_VISUAL_CONFIG } from './utils/visualTemplate';
import { getCurrentJalaliDate } from './utils/jalali';

export default function App() {
  const [config, setConfig] = useState<VisualConfig>(DEFAULT_VISUAL_CONFIG);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Default active range in simulator: 1403/01/01 to 1403/06/31 (First 6 months)
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: { jy: 1403, jm: 1, jd: 1 },
    end: { jy: 1403, jm: 6, jd: 31 }
  });

  const handleConfigChange = (updated: Partial<VisualConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* 1. Universal Top Bar Contract: Brand Title — Nav Links — 1 Primary Action */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              اسلایسر تاریخ شمسی پاور بی آی
            </span>
          </div>

          {/* Zone 2: Single-line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <button
              onClick={() => scrollToSection('preview-section')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              پیش‌نمایش زنده و دمو
            </button>
            <button
              onClick={() => scrollToSection('dax-section')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-medium text-amber-700"
            >
              تولید داکس تقویم (DAX)
            </button>
            <button
              onClick={() => scrollToSection('settings-section')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              شخصی‌سازی ظاهر
            </button>
            <button
              onClick={() => scrollToSection('download-section')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              دانلود پکیج .pbiviz
            </button>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Server className="w-3.5 h-3.5 text-sky-600" />
              <span>راهنمای Report Server</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scrollToSection('download-section')}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دریافت کاستوم ویژوال</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-white to-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-700 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>کاستوم ویژوال فوق‌حرفه‌ای تقویم خورشیدی ویژه مایکروسافت پاور بی آی</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight mb-3">
              اسلایسر تعاملی تاریخ شمسی با قابلیت انتخاب سال، ماه و بازه زمانی
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              طراحی شده دقیقاً مشابه سایت‌ها و اپلیکیشن‌های مدرن (منوی پاپ‌آپ بازشونده با کلیک، انتخابگر اختصاصی ۱۲ ماه بر اساس فصول، ناوبری سریع سال‌های شمسی، فیلترهای از پیش‌تعریف‌شده و تبدیل خودکار به فرمت ISO برای فیلتر کردن بدون خطای دیتابیس).
            </p>

            {/* Feature Highlights with Clean Editorial Separators (Zero-pill discipline) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 font-medium mb-4">
              <span className="flex items-center gap-1 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>سازگار با Power BI Report Server (PBIRS)</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>۱۰۰٪ آفلاین بدون نیاز به CDN یا اینترنت</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-700">
                <Database className="w-4 h-4 text-amber-600" />
                <span>همراه با جدول DAX جامع تقویم خورشیدی</span>
              </span>
            </div>

            {/* Developer Credits Note */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span>توسعه‌دهنده:</span>
              <strong className="text-slate-800 font-semibold">پوریا احتشام‌زاده</strong>
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
        </div>

        {/* Section 1: Power BI Live Interactive Sandbox */}
        <section id="preview-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                شبیه‌ساز و بوم زنده Power BI Desktop / Report Server
              </h2>
              <p className="text-xs text-slate-500">
                روی اسلایسر کلیک کنید، سال یا ماه را تغییر دهید یا فیلترهای سریع را انتخاب کنید تا واکنش لحظه‌ای سایر نمودارها را ببینید.
              </p>
            </div>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-xs font-medium text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>راهنمای راه‌اندازی در سرور سازمان</span>
            </button>
          </div>

          <PowerBIPreviewCanvas
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
            usePersianDigits={config.usePersianDigits}
            themeColor={config.themeColor}
            selectionMode={config.defaultMode}
            showPresets={config.showPresets}
            popupMode={config.popupStyle}
          />
        </section>

        {/* Section 2: Boilerplate DAX Calendar Table Generator with Start/End Years */}
        <section id="dax-section" className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              تولیدکننده اسکریپت جدول تقویم DAX (DimDate)
            </h2>
            <p className="text-xs text-slate-500">
              با مشخص کردن سال شروع و پایان، فرمول آماده DAX با تمام ستون‌های محاسباتی تقویم خورشیدی و میلادی را دریافت و کپی کنید.
            </p>
          </div>

          <DaxCalendarGenerator />
        </section>

        {/* Section 3: Visual Customizer & Formatting Settings */}
        <section id="settings-section" className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              تنظیمات ظاهری و شخصی‌سازی کاستوم ویژوال
            </h2>
            <p className="text-xs text-slate-500">
              تغییرات به صورت آنی در شبیه‌ساز بالا و همچنین در فایل نهایی <code className="font-mono">.pbiviz</code> اعمال می‌گردند.
            </p>
          </div>

          <VisualSettingsPanel config={config} onChange={handleConfigChange} />
        </section>

        {/* Section 3: Packager, PBIVIZ File Export & Source Code */}
        <section id="download-section" className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              دریافت فایل‌ها و کد منبع کاستوم ویژوال
            </h2>
            <p className="text-xs text-slate-500">
              می‌توانید فایل آماده <code className="font-mono text-sky-600">.pbiviz</code> را مستقیماً دانلود و در پاور بی آی ایمپورت کنید، یا سورس کد کامل پروژه را دریافت و با <code className="font-mono">pbiviz package</code> بیلد بگیرید.
            </p>
          </div>

          <CustomVisualPackager config={config} />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span>کاستوم ویژوال تقویم و اسلایسر تاریخ شمسی برای Microsoft Power BI</span>
            <span aria-hidden="true" className="text-slate-300">|</span>
            <span>ساخته و توسعه داده شده توسط <strong className="text-slate-700 font-semibold">پوریا احتشام‌زاده</strong></span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <a href="mailto:pouriae6@gmail.com" className="text-sky-600 hover:underline font-mono text-[11px]" dir="ltr">
              pouriae6@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-sky-600 hover:underline"
            >
              راهنمای PBIRS
            </button>
            <button
              onClick={() => scrollToSection('preview-section')}
              className="text-slate-600 hover:text-slate-900"
            >
              بازگشت به بالا
            </button>
          </div>
        </div>
      </footer>

      {/* PBIRS Step-by-Step Guide Modal */}
      <PbirsGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
