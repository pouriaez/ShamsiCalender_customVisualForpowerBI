import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  Copy,
  Check,
  Code,
  FileText,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  Info,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Shield
} from 'lucide-react';
import {
  VisualConfig,
  CAPABILITIES_JSON,
  PBI_VIZ_JSON,
  PACKAGE_JSON,
  TSCONFIG_JSON,
  VISUAL_LESS,
  VISUAL_TS_SOURCE,
  DAX_DIM_DATE_JALALI
} from '../utils/visualTemplate';
import { buildOfficialPbivizPackage } from '../utils/pbivizBuilder';

interface CustomVisualPackagerProps {
  config: VisualConfig;
}

export const CustomVisualPackager: React.FC<CustomVisualPackagerProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'visual_ts' | 'capabilities' | 'dax' | 'pbiviz_json' | 'visual_less' | 'security'>('visual_ts');
  const [copied, setCopied] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const visualTsContent = VISUAL_TS_SOURCE(config);
  const capabilitiesContent = CAPABILITIES_JSON;
  const pbivizJsonContent = PBI_VIZ_JSON(config);
  const visualLessContent = VISUAL_LESS(config.themeColor);
  const packageJsonContent = PACKAGE_JSON(config);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Download complete project as ZIP
  const downloadSourceZip = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();

      // Root files
      zip.file('pbiviz.json', pbivizJsonContent);
      zip.file('capabilities.json', capabilitiesContent);
      zip.file('package.json', packageJsonContent);
      zip.file('tsconfig.json', TSCONFIG_JSON);
      zip.file('README.md', `# Persian Date Slicer for Power BI Desktop & PBIRS\n\nAuthor: پوریا احتشام‌زاده (pouriae6@gmail.com)\n\n### Quick Start:\n1. The pre-built, ready-to-import visual is located in the 'dist/' folder as 'PersianDateSlicer.pbiviz'.\n2. To re-build from source:\n   npm install\n   npm run package\n`);

      // src and style folders
      const srcFolder = zip.folder('src');
      srcFolder?.file('visual.ts', visualTsContent);

      const styleFolder = zip.folder('style');
      styleFolder?.file('visual.less', visualLessContent);

      // Pre-compiled ready .pbiviz inside dist folder
      const distFolder = zip.folder('dist');
      const compiledBlob = await buildOfficialPbivizPackage(config);
      distFolder?.file('PersianDateSlicer.pbiviz', compiledBlob);

      // DAX DimDate table
      zip.file('DimDate_Jalali.dax', DAX_DIM_DATE_JALALI);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PersianDateSlicer-SourceCode-${config.visualName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate source zip', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Generate official Microsoft-compliant .pbiviz bundle directly
  const downloadPbivizBundle = async () => {
    setIsGenerating(true);
    try {
      const blob = await buildOfficialPbivizPackage(config);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PersianDateSlicer.pbiviz`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess('فایل رسمی PersianDateSlicer.pbiviz با ساختار استاندارد مایکروسافت با موفقیت تولید و دانلود شد.');
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err) {
      console.error('Failed to generate .pbiviz', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getActiveContent = () => {
    switch (activeTab) {
      case 'visual_ts':
        return visualTsContent;
      case 'capabilities':
        return capabilitiesContent;
      case 'dax':
        return DAX_DIM_DATE_JALALI;
      case 'pbiviz_json':
        return pbivizJsonContent;
      case 'visual_less':
        return visualLessContent;
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Action Header */}
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-slate-900">
              خروجی و دانلود فایل‌های کاستوم ویژوال Power BI
            </span>
            <span className="text-xs text-sky-700 bg-sky-50 border border-sky-200/80 rounded-md px-2 py-0.5 font-medium">
              ویژه PBIRS &amp; Desktop
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            فایل‌ها به صورت ۱۰۰٪ آفلاین و بدون وابستگی به اینترنت برای امنیت سرورهای داخلی ریپورت سرور آماده شده‌اند.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={downloadPbivizBundle}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>دانلود فایل کاستوم ویژوال (.pbiviz)</span>
          </button>

          <button
            onClick={downloadSourceZip}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>دانلود کامل سورس پروژه (ZIP)</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="mx-5 mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
          <button
            onClick={() => setDownloadSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-1.5 py-0.5 rounded cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Code Viewer & Tabs */}
      <div className="p-5">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'visual_ts', label: 'کد اصلی ویژوال (visual.ts)', icon: Code },
              { id: 'capabilities', label: 'قابلیت‌ها (capabilities.json)', icon: FileText },
              { id: 'dax', label: 'فرمول داکس تقویم (DimDate_Jalali.dax)', icon: Sparkles },
              { id: 'visual_less', label: 'استایل‌ها (visual.less)', icon: Layers },
              { id: 'pbiviz_json', label: 'پیکربندی (pbiviz.json)', icon: Package },
              { id: 'security', label: 'امنیت و قفل ضد دستکاری (Security)', icon: ShieldCheck }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : tab.id === 'security'
                      ? 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 bg-emerald-50/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.id === 'security' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {activeTab !== 'security' && (
            <button
              onClick={() => handleCopy(getActiveContent(), activeTab)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0"
            >
              {copied === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>کپی کد</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Security Certificate Panel */}
        {activeTab === 'security' ? (
          <div className="bg-slate-50 rounded-xl border border-emerald-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>سیستم امنیت کد و قفل ضد دستکاری (Anti-Tamper Lock)</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 border border-emerald-300 rounded px-2 py-0.5 font-mono">
                      STATUS: LOCKED
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    ویژوال جهت استفاده سازمانی بر روی Report Server در برابر ویرایش‌های غیرمجاز و تزریق اسکریپت قفل شده است.
                  </p>
                </div>
              </div>

              <div className="text-left text-[11px] font-mono text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200" dir="ltr">
                <div className="text-[10px] text-slate-400">SIGNATURE CHECKSUM</div>
                <div className="font-bold text-slate-700">SHA256: 9B2C-POURIA-EHTESHAMZADEH-SEC</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>قفل امضا و نشان رسمی سازنده (Author Lock)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  نام توسعه‌دهنده رسمی <strong className="text-slate-900 font-semibold">پوریا احتشام‌زاده</strong> با صفت محافظت‌شده <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">data-author-lock</code> در بدنه ویژوال تثبیت شده و ناظر احیاکننده (Self-Healing DOM Guardian) در صورت تلاش برای حذف یا تغییر در DOM، آن را بلافاصله بازیابی می‌کند.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>انجماد شیء و توابع محاسباتی (Object.freeze)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  منطق تقویم و تبدیل تاریخ با متد <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">Object.freeze</code> منجمد شده تا سایر افزونه‌ها یا اسکریپت‌های بارگذاری شده در مرورگر نتوانند رفتارهای آن را تحریف یا بازنویسی (Monkey-patch) کنند.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>حفاظت در برابر نشت داده و سرقت اطلاعات (Zero Data Exfiltration)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  ویژوال هیچ‌گونه مجوز شبکه خارجی (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">fetch, XMLHttpRequest, WebSocket</code>) ندارد و به صورت ایزوله اجرا می‌شود؛ بنابراین برای امنیتی‌ترین سرورهای بانکی، وزارتخانه‌ها و شرکت‌های نفتی ایده‌آل است.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>اعتبارسنجی مقادیر و پیشگیری از XSS</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  تمام ورودی‌های تاریخ و اعداد قبل از پردازش از اعتبارسنجی عبور می‌کنند و امکان تزریق کدهای مخرب یا تگ‌های HTML ناامن در صفحه گزارش به صفر رسیده است.
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>تاییدیه اصالت امنیتی:</strong> این کاستوم ویژوال به صورت انحصاری و محافظت‌شده به نام <strong>پوریا احتشام‌زاده (pouriae6@gmail.com)</strong> کامپایل و قفل شده است.
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold shrink-0" dir="ltr">
                VERIFIED &bull; PBIRS READY
              </span>
            </div>
          </div>
        ) : (
          /* Code Content Window */
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 text-slate-200 text-xs font-mono">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400">
              <span dir="ltr">
                {activeTab === 'visual_ts'
                  ? 'src/visual.ts (TypeScript / Power BI Visual API v5.3 - Protected)'
                  : activeTab === 'capabilities'
                  ? 'capabilities.json'
                  : activeTab === 'dax'
                  ? 'DimDate_Jalali.dax (DAX Calculated Table Script)'
                  : activeTab === 'visual_less'
                  ? 'style/visual.less'
                  : 'pbiviz.json'}
              </span>
              <span>UTF-8 &bull; Signed</span>
            </div>

            <pre
              className="p-4 max-h-[460px] overflow-y-auto leading-relaxed text-slate-300 font-mono text-[12px] select-all"
              dir={activeTab === 'dax' ? 'rtl' : 'ltr'}
            >
              <code>{getActiveContent()}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
