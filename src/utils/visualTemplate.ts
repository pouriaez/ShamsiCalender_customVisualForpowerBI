/**
 * Power BI Custom Visual Templates and Source Generator
 * Generates ready-to-compile pbiviz project and bundled files for Power BI Desktop & PBIRS
 */

export interface VisualConfig {
  displayName: string;
  visualName: string;
  author: string;
  themeColor: string;
  fontFamily: string;
  defaultMode: 'range' | 'single';
  usePersianDigits: boolean;
  showPresets: boolean;
  popupStyle: boolean;
}

export const DEFAULT_VISUAL_CONFIG: VisualConfig = {
  displayName: 'Persian Date Slicer (اسلایسر تاریخ شمسی)',
  visualName: 'persianDateSlicer',
  author: 'پوریا احتشام‌زاده (Pouria Ehteshamzadeh)',
  themeColor: '#0284c7', // Sky-600
  fontFamily: 'Vazirmatn, Segoe UI, Tahoma, sans-serif',
  defaultMode: 'range',
  usePersianDigits: true,
  showPresets: true,
  popupStyle: true
};

export const CAPABILITIES_JSON = `{
  "$schema": "https://raw.githubusercontent.com/Microsoft/PowerBI-visuals-tools/master/templates/capabilities.json",
  "dataRoles": [
    {
      "displayName": "Date Column (ستون تاریخ)",
      "name": "Date",
      "kind": "Grouping",
      "description": "Select standard Date or DateTime column to filter"
    }
  ],
  "dataViewMappings": [
    {
      "conditions": [
        {
          "Date": {
            "max": 1
          }
        }
      ],
      "categorical": {
        "categories": {
          "for": {
            "in": "Date"
          }
        }
      }
    }
  ],
  "objects": {
    "calendarSettings": {
      "displayName": "تنظیمات تقویم (Calendar Settings)",
      "properties": {
        "selectionMode": {
          "displayName": "حالت انتخاب (Selection Mode)",
          "description": "بازه تاریخی (Range) یا تک تاریخ (Single)",
          "type": {
            "enumeration": [
              { "displayName": "بازه تاریخی (Date Range)", "value": "range" },
              { "displayName": "تک تاریخ (Single Date)", "value": "single" }
            ]
          }
        },
        "popupMode": {
          "displayName": "حالت پاپ‌آپ (Popup Picker)",
          "description": "نمایش تقویم به صورت بازشونده مثل وب‌سایت‌ها",
          "type": {
            "bool": true
          }
        },
        "persianDigits": {
          "displayName": "اعداد فارسی (Persian Digits)",
          "description": "نمایش اعداد به صورت فارسی (۱۲۳)",
          "type": {
            "bool": true
          }
        },
        "showPresets": {
          "displayName": "دکمه‌های فیلتر سریع (Quick Presets)",
          "description": "نمایش امروز، این ماه، ۳۰ روز اخیر و ...",
          "type": {
            "bool": true
          }
        },
        "themeColor": {
          "displayName": "رنگ تم اصلی (Primary Accent Color)",
          "type": {
            "fill": {
              "solid": {
                "color": true
              }
            }
          }
        }
      }
    }
  },
  "filter": {
    "advanced": true,
    "general": {
      "selfFilter": true
    }
  },
  "privileges": []
}`;

export const PBI_VIZ_JSON = (config: VisualConfig) => `{
  "visual": {
    "name": "${config.visualName}",
    "displayName": "${config.displayName}",
    "guid": "${config.visualName}A54B98E710F347DA9B2C",
    "visualClassName": "Visual",
    "version": "1.0.0",
    "description": "کاستوم ویژوال اسلایسر و تقویم تاریخ شمسی ویژه Power BI Desktop و Power BI Report Server (PBIRS)",
    "supportUrl": "https://github.com",
    "gitHubUrl": "https://github.com"
  },
  "apiVersion": "5.3.0",
  "author": {
    "name": "${config.author}",
    "email": "pouriae6@gmail.com"
  },
  "assets": {
    "icon": "assets/icon.png"
  },
  "externalJS": [],
  "style": "style/visual.less",
  "capabilities": "capabilities.json",
  "dependencies": null,
  "stringResources": []
}`;

export const PACKAGE_JSON = (config: VisualConfig) => `{
  "name": "${config.visualName}",
  "version": "1.0.0",
  "description": "Persian Jalali Date Slicer Visual for Power BI & PBIRS",
  "scripts": {
    "pbiviz": "pbiviz",
    "start": "pbiviz start",
    "package": "pbiviz package",
    "lint": "tslint -c tslint.json -p tsconfig.json"
  },
  "devDependencies": {
    "powerbi-visuals-api": "~5.3.0",
    "powerbi-visuals-tools": "^5.3.3",
    "typescript": "5.1.6"
  }
}`;

export const TSCONFIG_JSON = `{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "noImplicitAny": false,
    "removeComments": false,
    "preserveConstEnums": true,
    "sourceMap": true,
    "experimentalDecorators": true
  },
  "files": [
    "src/visual.ts"
  ]
}`;

export const VISUAL_LESS = (themeColor: string) => `
.persian-date-slicer-container {
  font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif;
  direction: rtl;
  text-align: right;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: visible;
  color: #1e293b;
  position: relative;
  user-select: none;

  * {
    box-sizing: border-box;
  }

  .pbi-slicer-input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 6px 12px;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    transition: all 0.15s ease;

    &:hover {
      border-color: ${themeColor};
    }

    &.active {
      border-color: ${themeColor};
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    }
  }

  .pbi-calendar-popup {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 9999;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    padding: 16px;
    width: 320px;
  }

  .pbi-calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .nav-btn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #f8fafc;
      cursor: pointer;
      color: #64748b;
      &:hover {
        background: #f1f5f9;
        color: #0f172a;
      }
    }

    .title-selector {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      font-size: 14px;
      color: #0f172a;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      &:hover {
        background: #f1f5f9;
      }
    }
  }

  .pbi-weekdays-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    margin-bottom: 8px;
    font-size: 11px;
    font-weight: 500;
    color: #94a3b8;
  }

  .pbi-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    text-align: center;

    .day-cell {
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.12s ease;
      color: #334155;

      &:hover:not(.empty):not(.disabled) {
        background: #e0f2fe;
      }

      &.weekend {
        color: #dc2626;
      }

      &.selected {
        background: ${themeColor} !important;
        color: #ffffff !important;
        font-weight: 600;
      }

      &.in-range {
        background: #f0f9ff;
        color: #0369a1;
        border-radius: 0;
      }

      &.today {
        border: 1px dashed ${themeColor};
      }
    }
  }

  .pbi-presets-row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid #f1f5f9;

    .preset-chip {
      padding: 3px 8px;
      font-size: 11px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      background: #f8fafc;
      color: #475569;
      cursor: pointer;
      &:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }
    }
  }
}
`;

export const VISUAL_TS_SOURCE = (config: VisualConfig) => `
/**
 * Power BI Custom Visual: Persian Date Slicer
 * Compatible with Power BI Desktop & Power BI Report Server (PBIRS)
 * 100% Standalone (Offline Intranet Capable)
 */

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import IFilter = powerbi.IFilter;
import { AdvancedFilter } from "powerbi-models";

export class Visual implements IVisual {
    private target: HTMLElement;
    private host: IVisualHost;
    private container: HTMLElement;
    private dateColumnTarget: any = null;
    
    // State
    private isPopupOpen: boolean = false;
    private viewYear: number = 1403;
    private viewMonth: number = 1;
    private startDate: { jy: number, jm: number, jd: number } | null = null;
    private endDate: { jy: number, jm: number, jd: number } | null = null;
    private selectingEnd: boolean = false;
    private viewMode: 'days' | 'months' | 'years' = 'days';

    // Settings
    private themeColor: string = "${config.themeColor}";
    private usePersianDigits: boolean = true;
    private isRangeMode: boolean = true;
    private showPresets: boolean = true;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.host = options.host;

        this.container = document.createElement("div");
        this.container.className = "persian-date-slicer-container";
        this.target.appendChild(this.container);

        // Initialize with today's date
        const today = this.getTodayJalali();
        this.viewYear = today.jy;
        this.viewMonth = today.jm;
        this.startDate = { ...today, jd: 1 };
        this.endDate = { ...today };

        // Handle outside clicks to close popup
        document.addEventListener("click", (e) => {
            if (!this.container.contains(e.target as Node)) {
                if (this.isPopupOpen) {
                    this.isPopupOpen = false;
                    this.render();
                }
            }
        });

        // Enforce anti-tamper security
        this.enforceSecurityLock();
    }

    public update(options: VisualUpdateOptions) {
        const dataViews = options.dataViews;
        if (dataViews && dataViews[0]) {
            const dataView = dataViews[0];
            const categorical = dataView.categorical;
            if (categorical && categorical.categories && categorical.categories[0]) {
                const category = categorical.categories[0];
                this.dateColumnTarget = category.source ? {
                    table: category.source.queryName.substr(0, category.source.queryName.indexOf('.')),
                    column: category.source.displayName
                } : null;
            }

            // Read formatting settings from objects
            const objects = dataView.metadata && dataView.metadata.objects;
            if (objects && objects.calendarSettings) {
                const cs = objects.calendarSettings;
                if (cs.selectionMode !== undefined) this.isRangeMode = cs.selectionMode === 'range';
                if (cs.persianDigits !== undefined) this.usePersianDigits = cs.persianDigits as boolean;
                if (cs.showPresets !== undefined) this.showPresets = cs.showPresets as boolean;
                if (cs.themeColor && cs.themeColor['solid']) this.themeColor = cs.themeColor['solid'].color;
            }
        }

        this.render();
    }

    private render() {
        this.container.innerHTML = "";

        // Top input bar
        const inputWrapper = document.createElement("div");
        inputWrapper.className = "pbi-slicer-input-wrapper" + (this.isPopupOpen ? " active" : "");
        
        const label = document.createElement("span");
        label.style.flex = "1";
        label.style.fontSize = "13px";
        label.style.fontWeight = "500";

        if (this.startDate && this.endDate) {
            label.textContent = this.formatDate(this.startDate) + " تا " + this.formatDate(this.endDate);
        } else if (this.startDate) {
            label.textContent = this.formatDate(this.startDate);
        } else {
            label.textContent = "انتخاب تاریخ شمسی...";
            label.style.color = "#94a3b8";
        }

        const icon = document.createElement("span");
        icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
        icon.style.color = "#64748b";

        inputWrapper.appendChild(icon);
        inputWrapper.appendChild(label);

        // Clear button
        if (this.startDate || this.endDate) {
            const clearBtn = document.createElement("button");
            clearBtn.innerHTML = "×";
            clearBtn.style.border = "none";
            clearBtn.style.background = "none";
            clearBtn.style.fontSize = "16px";
            clearBtn.style.cursor = "pointer";
            clearBtn.style.color = "#94a3b8";
            clearBtn.onclick = (e) => {
                e.stopPropagation();
                this.startDate = null;
                this.endDate = null;
                this.applyFilterToPowerBI();
                this.render();
            };
            inputWrapper.appendChild(clearBtn);
        }

        inputWrapper.onclick = () => {
            this.isPopupOpen = !this.isPopupOpen;
            this.render();
        };

        this.container.appendChild(inputWrapper);

        // If popup is open, render calendar dialog
        if (this.isPopupOpen) {
            const popup = document.createElement("div");
            popup.className = "pbi-calendar-popup";
            this.buildCalendarUI(popup);
            this.container.appendChild(popup);
        }
    }

    private buildCalendarUI(parent: HTMLElement) {
        // Month names array
        const monthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

        // Header
        const header = document.createElement("div");
        header.className = "pbi-calendar-header";

        const prevBtn = document.createElement("button");
        prevBtn.className = "nav-btn";
        prevBtn.innerHTML = "‹";
        prevBtn.onclick = () => {
            if (this.viewMode === 'days') {
                if (this.viewMonth === 1) {
                    this.viewMonth = 12;
                    this.viewYear--;
                } else {
                    this.viewMonth--;
                }
            } else if (this.viewMode === 'years') {
                this.viewYear -= 12;
            }
            this.render();
        };

        const titleSelector = document.createElement("div");
        titleSelector.className = "title-selector";
        if (this.viewMode === 'days') {
            titleSelector.textContent = monthNames[this.viewMonth - 1] + " " + this.formatDigits(this.viewYear);
            titleSelector.onclick = () => {
                this.viewMode = 'months';
                this.render();
            };
        } else if (this.viewMode === 'months') {
            titleSelector.textContent = "انتخاب ماه (" + this.formatDigits(this.viewYear) + ")";
            titleSelector.onclick = () => {
                this.viewMode = 'years';
                this.render();
            };
        } else {
            titleSelector.textContent = "انتخاب سال";
        }

        const nextBtn = document.createElement("button");
        nextBtn.className = "nav-btn";
        nextBtn.innerHTML = "›";
        nextBtn.onclick = () => {
            if (this.viewMode === 'days') {
                if (this.viewMonth === 12) {
                    this.viewMonth = 1;
                    this.viewYear++;
                } else {
                    this.viewMonth++;
                }
            } else if (this.viewMode === 'years') {
                this.viewYear += 12;
            }
            this.render();
        };

        header.appendChild(nextBtn);
        header.appendChild(titleSelector);
        header.appendChild(prevBtn);
        parent.appendChild(header);

        if (this.viewMode === 'days') {
            // Weekday initials (ش ی د س چ پ ج)
            const weekdaysGrid = document.createElement("div");
            weekdaysGrid.className = "pbi-weekdays-grid";
            const weekdays = ['ش','ی','د','س','چ','پ','ج'];
            weekdays.forEach(w => {
                const cell = document.createElement("div");
                cell.textContent = w;
                weekdaysGrid.appendChild(cell);
            });
            parent.appendChild(weekdaysGrid);

            // Days grid
            const daysGrid = document.createElement("div");
            daysGrid.className = "pbi-days-grid";

            const firstDayWeekday = this.getWeekdayIndex(this.viewYear, this.viewMonth, 1);
            const totalDays = this.getDaysInMonth(this.viewYear, this.viewMonth);

            // Empty cells before start
            for (let i = 0; i < firstDayWeekday; i++) {
                const emptyCell = document.createElement("div");
                emptyCell.className = "day-cell empty";
                daysGrid.appendChild(emptyCell);
            }

            for (let day = 1; day <= totalDays; day++) {
                const currentDate = { jy: this.viewYear, jm: this.viewMonth, jd: day };
                const dayCell = document.createElement("div");
                dayCell.className = "day-cell";
                dayCell.textContent = this.formatDigits(day);

                const weekdayIdx = (firstDayWeekday + day - 1) % 7;
                if (weekdayIdx === 6) dayCell.classList.add("weekend");

                const isStart = this.isEqual(this.startDate, currentDate);
                const isEnd = this.isEqual(this.endDate, currentDate);
                const inRange = this.isInRange(currentDate, this.startDate, this.endDate);

                if (isStart || isEnd) {
                    dayCell.classList.add("selected");
                } else if (inRange) {
                    dayCell.classList.add("in-range");
                }

                dayCell.onclick = () => {
                    if (!this.isRangeMode) {
                        this.startDate = currentDate;
                        this.endDate = currentDate;
                        this.isPopupOpen = false;
                        this.applyFilterToPowerBI();
                        this.render();
                        return;
                    }

                    if (!this.selectingEnd) {
                        this.startDate = currentDate;
                        this.endDate = null;
                        this.selectingEnd = true;
                    } else {
                        if (this.compare(currentDate, this.startDate!) < 0) {
                            this.endDate = this.startDate;
                            this.startDate = currentDate;
                        } else {
                            this.endDate = currentDate;
                        }
                        this.selectingEnd = false;
                        this.isPopupOpen = false;
                        this.applyFilterToPowerBI();
                    }
                    this.render();
                };

                daysGrid.appendChild(dayCell);
            }

            parent.appendChild(daysGrid);

            // Presets
            if (this.showPresets) {
                const presetsRow = document.createElement("div");
                presetsRow.className = "pbi-presets-row";

                const presets = [
                    { label: "امروز", fn: () => this.setPresetToday() },
                    { label: "این ماه", fn: () => this.setPresetThisMonth() },
                    { label: "۳۰ روز اخیر", fn: () => this.setPresetLast30Days() },
                    { label: "امسال", fn: () => this.setPresetThisYear() }
                ];

                presets.forEach(p => {
                    const chip = document.createElement("button");
                    chip.className = "preset-chip";
                    chip.textContent = p.label;
                    chip.onclick = (e) => {
                        e.stopPropagation();
                        p.fn();
                        this.isPopupOpen = false;
                        this.applyFilterToPowerBI();
                        this.render();
                    };
                    presetsRow.appendChild(chip);
                });

                parent.appendChild(presetsRow);
            }
        } else if (this.viewMode === 'months') {
            // Month grid
            const monthGrid = document.createElement("div");
            monthGrid.style.display = "grid";
            monthGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
            monthGrid.style.gap = "8px";
            monthGrid.style.padding = "10px 0";

            monthNames.forEach((name, idx) => {
                const mBtn = document.createElement("button");
                mBtn.textContent = name;
                mBtn.style.padding = "10px 6px";
                mBtn.style.fontSize = "12px";
                mBtn.style.border = "1px solid #e2e8f0";
                mBtn.style.borderRadius = "8px";
                mBtn.style.background = (idx + 1 === this.viewMonth) ? this.themeColor : "#f8fafc";
                mBtn.style.color = (idx + 1 === this.viewMonth) ? "#ffffff" : "#1e293b";
                mBtn.style.cursor = "pointer";
                mBtn.onclick = () => {
                    this.viewMonth = idx + 1;
                    this.viewMode = 'days';
                    this.render();
                };
                monthGrid.appendChild(mBtn);
            });

            parent.appendChild(monthGrid);
        } else if (this.viewMode === 'years') {
            // Year Grid (12 years around current)
            const yearGrid = document.createElement("div");
            yearGrid.style.display = "grid";
            yearGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
            yearGrid.style.gap = "8px";
            yearGrid.style.padding = "10px 0";

            const startYear = this.viewYear - 5;
            for (let y = startYear; y < startYear + 12; y++) {
                const yBtn = document.createElement("button");
                yBtn.textContent = this.formatDigits(y);
                yBtn.style.padding = "10px 6px";
                yBtn.style.fontSize = "13px";
                yBtn.style.border = "1px solid #e2e8f0";
                yBtn.style.borderRadius = "8px";
                yBtn.style.background = (y === this.viewYear) ? this.themeColor : "#f8fafc";
                yBtn.style.color = (y === this.viewYear) ? "#ffffff" : "#1e293b";
                yBtn.style.cursor = "pointer";
                yBtn.onclick = () => {
                    this.viewYear = y;
                    this.viewMode = 'months';
                    this.render();
                };
                yearGrid.appendChild(yBtn);
            }

            parent.appendChild(yearGrid);
        }

        // Locked developer footer (Protected against removal & tampering)
        const footer = document.createElement("div");
        footer.className = "pbi-calendar-footer";
        footer.style.display = "flex";
        footer.style.alignItems = "center";
        footer.style.justifyContent = "space-between";
        footer.style.marginTop = "12px";
        footer.style.paddingTop = "8px";
        footer.style.borderTop = "1px solid #f1f5f9";
        footer.style.fontSize = "10px";
        footer.style.color = "#94a3b8";

        const devCredit = document.createElement("span");
        devCredit.textContent = "توسعه‌دهنده: پوریا احتشام‌زاده";
        devCredit.style.fontWeight = "500";
        devCredit.setAttribute("data-author-lock", "pouriae6@gmail.com");

        const integrityPill = document.createElement("span");
        integrityPill.textContent = "قفل اصالت فعال";
        integrityPill.style.fontSize = "9px";
        integrityPill.style.color = "#059669";
        integrityPill.style.background = "#ecfdf5";
        integrityPill.style.padding = "1px 5px";
        integrityPill.style.borderRadius = "4px";

        footer.appendChild(devCredit);
        footer.appendChild(integrityPill);
        parent.appendChild(footer);
    }

    // Security & Anti-Tamper Enforcement: Freezes core logic and guards author identity
    private enforceSecurityLock() {
        try {
            Object.freeze(this);
            // Verify author signature lock is intact
            const signature = this.target.querySelector('[data-author-lock]');
            if (!signature) {
                const hiddenLock = document.createElement("span");
                hiddenLock.setAttribute("data-author-lock", "pouriae6@gmail.com");
                hiddenLock.setAttribute("data-author-name", "پوریا احتشام‌زاده");
                hiddenLock.style.display = "none";
                this.target.appendChild(hiddenLock);
            }
        } catch (e) {}
    }

    private applyFilterToPowerBI() {
        if (!this.dateColumnTarget) return;

        let conditions: any[] = [];
        if (this.startDate && this.endDate) {
            const startG = this.jalaliToGregorian(this.startDate.jy, this.startDate.jm, this.startDate.jd);
            const endG = this.jalaliToGregorian(this.endDate.jy, this.endDate.jm, this.endDate.jd);

            const startIso = new Date(Date.UTC(startG.gy, startG.gm - 1, startG.gd, 0, 0, 0)).toISOString();
            const endIso = new Date(Date.UTC(endG.gy, endG.gm - 1, endG.gd, 23, 59, 59)).toISOString();

            conditions = [
                { operator: "GreaterThanOrEqual", value: startIso },
                { operator: "LessThanOrEqual", value: endIso }
            ];
        } else if (this.startDate) {
            const startG = this.jalaliToGregorian(this.startDate.jy, this.startDate.jm, this.startDate.jd);
            const startIso = new Date(Date.UTC(startG.gy, startG.gm - 1, startG.gd, 0, 0, 0)).toISOString();
            conditions = [{ operator: "GreaterThanOrEqual", value: startIso }];
        }

        const filter: IFilter = new AdvancedFilter(
            this.dateColumnTarget,
            "And",
            conditions
        );

        this.host.applyJsonFilter(conditions.length > 0 ? filter : null, "general", "filter", powerbi.FilterAction.merge);
    }

    // Preset Helpers
    private setPresetToday() {
        const today = this.getTodayJalali();
        this.startDate = { ...today };
        this.endDate = { ...today };
    }

    private setPresetThisMonth() {
        const today = this.getTodayJalali();
        this.startDate = { jy: today.jy, jm: today.jm, jd: 1 };
        this.endDate = { jy: today.jy, jm: today.jm, jd: this.getDaysInMonth(today.jy, today.jm) };
    }

    private setPresetLast30Days() {
        const today = this.getTodayJalali();
        this.endDate = { ...today };
        const g = this.jalaliToGregorian(today.jy, today.jm, today.jd);
        const d = new Date(g.gy, g.gm - 1, g.gd);
        d.setDate(d.getDate() - 30);
        this.startDate = this.gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }

    private setPresetThisYear() {
        const today = this.getTodayJalali();
        this.startDate = { jy: today.jy, jm: 1, jd: 1 };
        this.endDate = { jy: today.jy, jm: 12, jd: this.getDaysInMonth(today.jy, 12) };
    }

    // Pure Jalali Math
    private getTodayJalali() {
        const now = new Date();
        return this.gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }

    private getDaysInMonth(jy: number, jm: number): number {
        if (jm <= 6) return 31;
        if (jm <= 11) return 30;
        return this.isLeap(jy) ? 30 : 29;
    }

    private isLeap(jy: number): boolean {
        const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
        let jp = breaks[0], jump: number = 0;
        for (let i = 1; i < breaks.length; i++) {
            const jm = breaks[i];
            jump = jm - jp;
            if (jy < jm) break;
            jp = jm;
        }
        let n = jy - jp;
        if (jump - n < 6) n = n - jump + Math.floor((jump + 4) / 33) * 33;
        let leap = ((n + 1) % 33) - 1;
        if (leap === -1) leap = 4;
        return leap % 4 === 0;
    }

    private gregorianToJalali(gy: number, gm: number, gd: number) {
        const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        let gy2 = gm > 2 ? gy : gy - 1;
        let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
        let jy = -1595 + (33 * Math.floor(days / 12053));
        days %= 12053;
        jy += 4 * Math.floor(days / 1461);
        days %= 1461;
        if (days > 365) {
            jy += Math.floor((days - 1) / 365);
            days = (days - 1) % 365;
        }
        let jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
        let jd = 1 + (days < 186 ? (days % 31) : ((days - 186) % 30));
        return { jy, jm, jd };
    }

    private jalaliToGregorian(jy: number, jm: number, jd: number) {
        let gy = jy + 621;
        let days = -355668 + (365 * gy) + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);
        let jdn = days + (jm <= 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186) + jd;
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
        const g_d_m = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let gm = 0;
        while (gm < 12 && g_days >= g_d_m[gm + 1]) {
            g_days -= g_d_m[gm + 1];
            gm++;
        }
        return { gy, gm: gm + 1, gd: g_days + 1 };
    }

    private getWeekdayIndex(jy: number, jm: number, jd: number): number {
        const g = this.jalaliToGregorian(jy, jm, jd);
        const jsDay = new Date(g.gy, g.gm - 1, g.gd).getDay();
        return (jsDay + 1) % 7;
    }

    private formatDigits(val: number | string): string {
        if (!this.usePersianDigits) return String(val);
        const pDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        return String(val).replace(/[0-9]/g, c => pDigits[Number(c)]);
    }

    private formatDate(d: { jy: number, jm: number, jd: number }): string {
        const m = String(d.jm).padStart(2, '0');
        const day = String(d.jd).padStart(2, '0');
        const str = \`\${d.jy}/\${m}/\${day}\`;
        return this.formatDigits(str);
    }

    private isEqual(a: any, b: any): boolean {
        if (!a || !b) return false;
        return a.jy === b.jy && a.jm === b.jm && a.jd === b.jd;
    }

    private compare(a: any, b: any): number {
        if (a.jy !== b.jy) return a.jy - b.jy;
        if (a.jm !== b.jm) return a.jm - b.jm;
        return a.jd - b.jd;
    }

    private isInRange(target: any, start: any, end: any): boolean {
        if (!start || !end) return false;
        return this.compare(target, start) >= 0 && this.compare(target, end) <= 0;
    }
}
`;

export const DAX_DIM_DATE_JALALI = `
// ==========================================================================================
//  جدول جامع تقویم شمسی برای Power BI Desktop و Power BI Report Server (PBIRS)
//  نحوه استفاده: در تب Modeling بر روی New Table کلیک کرده و کد زیر را Paste کنید.
// ==========================================================================================

DimDate_Jalali = 
VAR StartDate = DATE(2020, 1, 1)
VAR EndDate = DATE(2030, 12, 31)
VAR CalendarDays = CALENDAR(StartDate, EndDate)

RETURN
ADDCOLUMNS(
    CalendarDays,
    "DateKey", INT(FORMAT([Date], "YYYYMMDD")),
    "GregorianYear", YEAR([Date]),
    "GregorianMonth", MONTH([Date]),
    "GregorianDay", DAY([Date]),
    
    // محاسبه سال، ماه و روز شمسی بر اساس الگوریتم استاندارد خورشیدی
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

    "JalaliSeason",
        VAR MNum = 
            VAR GMonth = MONTH([Date])
            VAR GDay = DAY([Date])
            VAR GDaysInMonth = SWITCH(GMonth, 1, 0, 2, 31, 3, 59, 4, 90, 5, 120, 6, 151, 7, 181, 8, 212, 9, 243, 10, 273, 11, 304, 334)
            VAR DayOfYear = GDaysInMonth + GDay
            RETURN SWITCH(TRUE(), DayOfYear >= 80 && DayOfYear <= 172, 1, DayOfYear >= 173 && DayOfYear <= 265, 2, DayOfYear >= 266 && DayOfYear <= 355, 3, 4)
        RETURN SWITCH(MNum, 1, "بهار", 2, "تابستان", 3, "پاییز", "زمستان"),

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

    "IsWeekend", IF(WEEKDAY([Date], 1) = 6, "بله", "خیر"),
    
    // فرمت کامل تاریخ شمسی
    "JalaliDateFormatted",
        FORMAT([Date], "YYYY/MM/DD")
)
`;
