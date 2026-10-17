import React from 'react';
import {
  X,
  Server,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  FileCode,
  ShieldCheck,
  HelpCircle,
  Copy
} from 'lucide-react';

interface PbirsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PbirsGuideModal: React.FC<PbirsGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">
                راهنمای نصب و راه‌اندازی در Power BI Report Server (PBIRS)
              </h2>
              <p className="text-xs text-slate-500">
                مراحل پیاده‌سازی گام‌به‌گام برای سرورهای داخلی و نسخه‌های On-Premises
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Step 1 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                ۱
              </span>
              <span>فعال‌سازی کاستوم ویژوال‌ها در ریپورت سرور (تنظیم ادمین)</span>
            </div>
            <p className="text-slate-600 mb-2">
              به طور پیش‌فرض، در برخی نسخه‌های Power BI Report Server قابلیت کاستوم ویژوال برای امنیت غیرفعال است. برای فعال‌سازی فایل زیر را در سرور با دسترسی Administrator باز کنید:
            </p>
            <div className="bg-slate-900 text-slate-200 font-mono p-2.5 rounded-lg text-[11px] mb-2 select-all" dir="ltr">
              C:\Program Files\Microsoft Power BI Report Server\PBIRS\ReportServer\rsreportserver.config
            </div>
            <p className="text-slate-600 mb-1">
              در بخش <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">&lt;Configuration&gt;</code> تگ زیر را بررسی یا اضافه کنید:
            </p>
            <div className="bg-slate-900 text-emerald-400 font-mono p-2.5 rounded-lg text-[11px] select-all" dir="ltr">
              &lt;CustomVisuals Enabled="true" /&gt;
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                ۲
              </span>
              <span>ایمپورت فایل <code className="font-mono text-sky-700">.pbiviz</code> در Power BI Desktop</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 mr-1">
              <li>نرم‌افزار <strong>Power BI Desktop (Optimized for Report Server)</strong> را باز کنید.</li>
              <li>در پنل <strong>Visualizations</strong> روی آیکون سه‌نقطه (<code className="font-mono">...</code>) کلیک کنید.</li>
              <li>گزینه <strong>Import a visual from a file</strong> را انتخاب کنید.</li>
              <li>فایل دانلود شده <code className="font-mono text-sky-700">PersianDateSlicer.pbiviz</code> را انتخاب کنید.</li>
              <li>پیام موفقیت‌آمیز ظاهر شده و آیکون تقویم به پنل ویژوال‌ها اضافه خواهد شد.</li>
            </ol>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                ۳
              </span>
              <span>اتصال ستون تاریخ (Data Role Binding)</span>
            </div>
            <p className="text-slate-600 mb-2">
              ویژوال را به صفحه گزارش خود درگ کنید، سپس از جدول دیتای خود یا جدول تقویم DAX، ستون اصلی تاریخ میلادی (Date یا DateTime) را در فیلد <strong>Date Column</strong> قرار دهید.
            </p>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/80 text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>نکته کلیدی:</strong> ستون داده باید فرمت استاندارد Date داشته باشد. ویژوال تاریخ خورشیدی انتخاب شده را به صورت خودکار به بازه زمانی استاندارد ISO تبدیل کرده و فیلتر پیشرفته را به ریپورت سرور ارسال می‌کند!
              </span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                ۴
              </span>
              <span>انتشار گزارش به ریپورت سرور (Publish to PBIRS)</span>
            </div>
            <p className="text-slate-600">
              از منوی <strong>File &gt; Save As &gt; Power BI Report Server</strong> گزارش را روی وب‌سرور داخلی سازمان ذخیره کنید. کاستوم ویژوال به صورت کامل همراه فایل pbix ذخیره شده و کاربران وب در شبکه داخلی بدون نیاز به نصب هرگونه افزونه یا فونت از آن استفاده خواهند کرد.
            </p>
          </div>

          {/* Troubleshooting Section */}
          <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>حل مشکل خطای Import در Power BI Desktop:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-800 leading-relaxed mr-1">
              <li><strong>رفع بلاک فایل در ویندوز (Unblock):</strong> روی فایل <code className="font-mono bg-white/80 px-1 py-0.5 rounded text-rose-900">PersianDateSlicer.pbiviz</code> کلیک‌راست کرده، <strong>Properties</strong> را بزنید، در تب General تیک <strong>Unblock</strong> را فعال و OK کنید.</li>
              <li><strong>مجوز کاستوم ویژوال در سازمان:</strong> در منوی File &gt; Options and settings &gt; Options &gt; بخش Security مطمئن شوید گزینه Block Custom Visuals تیک نخورده باشد.</li>
              <li><strong>فایل اصلاح‌شده با اسکیما رسمی:</strong> فایل پکیج هم‌اکنون با ساختار رسمی Microsoft Power BI Visuals v5.3 مجدداً کامپایل و استانداردسازی شد تا مستقیماً بدون ارور ایمپورت شود.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
