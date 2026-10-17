/**
 * Official Microsoft Power BI Custom Visual (.pbiviz) Package Builder
 * Fully compliant with PowerBI-visuals-tools schema and Power BI Desktop / PBIRS parsers.
 */

import JSZip from 'jszip';
import { VisualConfig, CAPABILITIES_JSON } from './visualTemplate';

export const VISUAL_GUID = "persianDateSlicerA54B98E710F347DA9B2C";

/**
 * Creates a valid base64 PNG icon for Power BI visual
 */
export function generateVisualIconBase64(): string {
  if (typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 48;
      canvas.height = 48;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw rounded container
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(4, 4, 40, 40, 8);
        ctx.fill();

        // White calendar card
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(8, 12, 32, 28, 4);
        ctx.fill();

        // Top header strip
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(8, 12, 32, 8, [4, 4, 0, 0]);
        ctx.fill();

        // Date grid dots
        ctx.fillStyle = '#0284c7';
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 4; c++) {
            ctx.fillRect(12 + c * 7, 24 + r * 7, 4, 4);
          }
        }

        return canvas.toDataURL('image/png');
      }
    } catch (e) {
      console.warn('Canvas not available for icon generation', e);
    }
  }

  // Fallback 1x1 transparent PNG data URI
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgbw50AAABVb8r0AAAAABJRU5ErkJggg==';
}

/**
 * Generates the pure, self-contained JavaScript bundle for the Power BI custom visual.
 * Conforms to powerbi.extensibility.visual.IVisual and powerbi.visuals.plugins.
 */
export function generateCompiledVisualJs(config: VisualConfig): string {
  return `
var powerbi = window.powerbi || {};
(function (powerbi) {
    var visuals = powerbi.visuals = powerbi.visuals || {};
    var plugins = visuals.plugins = visuals.plugins || {};

    // =========================================================================
    // Persian Jalali Date Engine (Pure Astronomical Conversion - No External Dependencies)
    // =========================================================================
    var PERSIAN_MONTH_NAMES = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

    function isJalaliLeapYear(jy) {
        var breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
        var jp = breaks[0], jump = 0;
        for (var i = 1; i < breaks.length; i++) {
            var jm = breaks[i];
            jump = jm - jp;
            if (jy < jm) break;
            jp = jm;
        }
        var n = jy - jp;
        if (jump - n < 6) n = n - jump + Math.floor((jump + 4) / 33) * 33;
        var leap = ((n + 1) % 33) - 1;
        if (leap === -1) leap = 4;
        return leap % 4 === 0;
    }

    function getDaysInJalaliMonth(jy, jm) {
        if (jm <= 6) return 31;
        if (jm <= 11) return 30;
        return isJalaliLeapYear(jy) ? 30 : 29;
    }

    function gregorianToJalali(gy, gm, gd) {
        var g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var gy2 = gm > 2 ? gy : gy - 1;
        var days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
        var jy = -1595 + (33 * Math.floor(days / 12053));
        days %= 12053;
        jy += 4 * Math.floor(days / 1461);
        days %= 1461;
        if (days > 365) {
            jy += Math.floor((days - 1) / 365);
            days = (days - 1) % 365;
        }
        var jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
        var jd = 1 + (days < 186 ? (days % 31) : ((days - 186) % 30));
        return { jy: jy, jm: jm, jd: jd };
    }

    function jalaliToGregorian(jy, jm, jd) {
        var gy = jy + 621;
        var days = -355668 + (365 * gy) + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);
        var jdn = days + (jm <= 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186) + jd;
        var g_days = jdn - 355666;
        gy = 400 * Math.floor(g_days / 146097);
        g_days %= 146097;
        var leap = true;
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
        var g_d_m = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var gm = 0;
        while (gm < 12 && g_days >= g_d_m[gm + 1]) {
            g_days -= g_d_m[gm + 1];
            gm++;
        }
        return { gy: gy, gm: gm + 1, gd: g_days + 1 };
    }

    function getWeekdayIndex(jy, jm, jd) {
        var g = jalaliToGregorian(jy, jm, jd);
        var jsDay = new Date(g.gy, g.gm - 1, g.gd).getDay();
        return (jsDay + 1) % 7;
    }

    function toPersianDigits(val) {
        var pDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        return String(val).replace(/[0-9]/g, function (c) { return pDigits[Number(c)]; });
    }

    // =========================================================================
    // Power BI Custom Visual Implementation
    // =========================================================================
    var Visual = (function () {
        function Visual(options) {
            this.target = options.element;
            this.host = options.host;
            this.dateColumnTarget = null;
            this.isPopupOpen = false;
            this.viewMode = 'days';
            this.selectingEnd = false;

            // Settings
            this.themeColor = "${config.themeColor}";
            this.usePersianDigits = true;
            this.isRangeMode = true;
            this.showPresets = true;

            // Initialize with today's Jalali date
            var now = new Date();
            var today = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
            this.viewYear = today.jy;
            this.viewMonth = today.jm;
            this.startDate = { jy: today.jy, jm: 1, jd: 1 };
            this.endDate = { jy: today.jy, jm: today.jm, jd: today.jd };

            this.container = document.createElement("div");
            this.container.className = "persian-date-slicer-container";
            this.target.appendChild(this.container);

            var self = this;
            document.addEventListener("click", function (e) {
                if (!self.container.contains(e.target)) {
                    if (self.isPopupOpen) {
                        self.isPopupOpen = false;
                        self.render();
                    }
                }
            });

            this.enforceSecurityLock();
            this.render();
        }

        Visual.prototype.enforceSecurityLock = function () {
            try {
                var sig = this.target.querySelector('[data-author-lock]');
                if (!sig) {
                    var el = document.createElement("span");
                    el.setAttribute("data-author-lock", "pouriae6@gmail.com");
                    el.style.display = "none";
                    this.target.appendChild(el);
                }
            } catch (e) {}
        };

        Visual.prototype.update = function (options) {
            var dataViews = options.dataViews;
            if (dataViews && dataViews[0]) {
                var dataView = dataViews[0];
                var categorical = dataView.categorical;
                if (categorical && categorical.categories && categorical.categories[0]) {
                    var category = categorical.categories[0];
                    if (category.source) {
                        var qName = category.source.queryName || "";
                        var dotIdx = qName.indexOf('.');
                        this.dateColumnTarget = {
                            table: dotIdx > -1 ? qName.substring(0, dotIdx) : "",
                            column: category.source.displayName
                        };
                    }
                }

                var objects = dataView.metadata && dataView.metadata.objects;
                if (objects && objects.calendarSettings) {
                    var cs = objects.calendarSettings;
                    if (cs.selectionMode !== undefined) this.isRangeMode = cs.selectionMode === 'range';
                    if (cs.persianDigits !== undefined) this.usePersianDigits = Boolean(cs.persianDigits);
                    if (cs.showPresets !== undefined) this.showPresets = Boolean(cs.showPresets);
                    if (cs.themeColor && cs.themeColor.solid) this.themeColor = cs.themeColor.solid.color;
                }
            }

            this.render();
        };

        Visual.prototype.formatDigits = function (num) {
            return this.usePersianDigits ? toPersianDigits(num) : String(num);
        };

        Visual.prototype.formatDate = function (d) {
            var m = String(d.jm).padStart(2, '0');
            var day = String(d.jd).padStart(2, '0');
            return this.formatDigits(d.jy + '/' + m + '/' + day);
        };

        Visual.prototype.render = function () {
            var self = this;
            this.container.innerHTML = "";

            // Input wrapper
            var inputWrapper = document.createElement("div");
            inputWrapper.className = "pbi-slicer-input-wrapper" + (this.isPopupOpen ? " active" : "");

            var icon = document.createElement("span");
            icon.className = "slicer-cal-icon";
            icon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';

            var label = document.createElement("span");
            label.className = "slicer-date-label";

            if (this.startDate && this.endDate) {
                label.textContent = this.formatDate(this.startDate) + " تا " + this.formatDate(this.endDate);
            } else if (this.startDate) {
                label.textContent = this.formatDate(this.startDate);
            } else {
                label.textContent = "انتخاب تاریخ شمسی...";
                label.style.color = "#94a3b8";
            }

            inputWrapper.appendChild(icon);
            inputWrapper.appendChild(label);

            if (this.startDate || this.endDate) {
                var clearBtn = document.createElement("button");
                clearBtn.className = "slicer-clear-btn";
                clearBtn.innerHTML = "&times;";
                clearBtn.onclick = function (e) {
                    e.stopPropagation();
                    self.startDate = null;
                    self.endDate = null;
                    self.applyFilterToPowerBI();
                    self.render();
                };
                inputWrapper.appendChild(clearBtn);
            }

            inputWrapper.onclick = function () {
                self.isPopupOpen = !self.isPopupOpen;
                self.render();
            };

            this.container.appendChild(inputWrapper);

            if (this.isPopupOpen) {
                var popup = document.createElement("div");
                popup.className = "pbi-calendar-popup";
                this.buildCalendarUI(popup);
                this.container.appendChild(popup);
            }
        };

        Visual.prototype.buildCalendarUI = function (parent) {
            var self = this;

            // Header with navigation
            var header = document.createElement("div");
            header.className = "pbi-calendar-header";

            var nextBtn = document.createElement("button");
            nextBtn.className = "nav-btn";
            nextBtn.innerHTML = "&#8250;";
            nextBtn.onclick = function () {
                if (self.viewMode === 'days') {
                    if (self.viewMonth === 12) {
                        self.viewMonth = 1;
                        self.viewYear++;
                    } else {
                        self.viewMonth++;
                    }
                } else if (self.viewMode === 'years') {
                    self.viewYear += 12;
                }
                self.render();
            };

            var titleSelector = document.createElement("div");
            titleSelector.className = "title-selector";
            if (this.viewMode === 'days') {
                titleSelector.textContent = PERSIAN_MONTH_NAMES[this.viewMonth - 1] + " " + this.formatDigits(this.viewYear);
                titleSelector.onclick = function () {
                    self.viewMode = 'months';
                    self.render();
                };
            } else if (this.viewMode === 'months') {
                titleSelector.textContent = "انتخاب ماه (" + this.formatDigits(this.viewYear) + ")";
                titleSelector.onclick = function () {
                    self.viewMode = 'years';
                    self.render();
                };
            } else {
                titleSelector.textContent = "انتخاب سال شمسی";
            }

            var prevBtn = document.createElement("button");
            prevBtn.className = "nav-btn";
            prevBtn.innerHTML = "&#8249;";
            prevBtn.onclick = function () {
                if (self.viewMode === 'days') {
                    if (self.viewMonth === 1) {
                        self.viewMonth = 12;
                        self.viewYear--;
                    } else {
                        self.viewMonth--;
                    }
                } else if (self.viewMode === 'years') {
                    self.viewYear -= 12;
                }
                self.render();
            };

            header.appendChild(nextBtn);
            header.appendChild(titleSelector);
            header.appendChild(prevBtn);
            parent.appendChild(header);

            if (this.viewMode === 'days') {
                var weekdaysGrid = document.createElement("div");
                weekdaysGrid.className = "pbi-weekdays-grid";
                var weekdays = ['ش','ی','د','س','چ','پ','ج'];
                weekdays.forEach(function (w, idx) {
                    var cell = document.createElement("div");
                    cell.textContent = w;
                    if (idx === 6) cell.className = "weekend";
                    weekdaysGrid.appendChild(cell);
                });
                parent.appendChild(weekdaysGrid);

                var daysGrid = document.createElement("div");
                daysGrid.className = "pbi-days-grid";

                var firstDayWeekday = getWeekdayIndex(this.viewYear, this.viewMonth, 1);
                var totalDays = getDaysInJalaliMonth(this.viewYear, this.viewMonth);

                for (var i = 0; i < firstDayWeekday; i++) {
                    var emptyCell = document.createElement("div");
                    emptyCell.className = "day-cell empty";
                    daysGrid.appendChild(emptyCell);
                }

                for (var d = 1; d <= totalDays; d++) {
                    (function (day) {
                        var curr = { jy: self.viewYear, jm: self.viewMonth, jd: day };
                        var dayCell = document.createElement("div");
                        dayCell.className = "day-cell";
                        dayCell.textContent = self.formatDigits(day);

                        var isStart = self.isEqual(self.startDate, curr);
                        var isEnd = self.isEqual(self.endDate, curr);
                        var inRange = self.isInRange(curr, self.startDate, self.endDate);

                        if (isStart || isEnd) {
                            dayCell.classList.add("selected");
                            dayCell.style.backgroundColor = self.themeColor;
                        } else if (inRange) {
                            dayCell.classList.add("in-range");
                        }

                        var wIdx = (firstDayWeekday + day - 1) % 7;
                        if (wIdx === 6) dayCell.classList.add("weekend");

                        dayCell.onclick = function () {
                            if (!self.isRangeMode) {
                                self.startDate = curr;
                                self.endDate = curr;
                                self.isPopupOpen = false;
                                self.applyFilterToPowerBI();
                                self.render();
                                return;
                            }

                            if (!self.selectingEnd || !self.startDate) {
                                self.startDate = curr;
                                self.endDate = null;
                                self.selectingEnd = true;
                            } else {
                                if (self.compare(curr, self.startDate) < 0) {
                                    self.endDate = self.startDate;
                                    self.startDate = curr;
                                } else {
                                    self.endDate = curr;
                                }
                                self.selectingEnd = false;
                                self.isPopupOpen = false;
                                self.applyFilterToPowerBI();
                            }
                            self.render();
                        };

                        daysGrid.appendChild(dayCell);
                    })(d);
                }

                parent.appendChild(daysGrid);

                // Quick Presets
                if (this.showPresets) {
                    var presetsRow = document.createElement("div");
                    presetsRow.className = "pbi-presets-row";

                    var presets = [
                        { label: "امروز", fn: function () { self.setPresetToday(); } },
                        { label: "این ماه", fn: function () { self.setPresetThisMonth(); } },
                        { label: "۳۰ روز اخیر", fn: function () { self.setPresetLast30Days(); } },
                        { label: "امسال", fn: function () { self.setPresetThisYear(); } }
                    ];

                    presets.forEach(function (p) {
                        var btn = document.createElement("button");
                        btn.className = "preset-chip";
                        btn.textContent = p.label;
                        btn.onclick = function (e) {
                            e.stopPropagation();
                            p.fn();
                            self.isPopupOpen = false;
                            self.applyFilterToPowerBI();
                            self.render();
                        };
                        presetsRow.appendChild(btn);
                    });

                    parent.appendChild(presetsRow);
                }
            } else if (this.viewMode === 'months') {
                var monthGrid = document.createElement("div");
                monthGrid.className = "pbi-month-grid";

                PERSIAN_MONTH_NAMES.forEach(function (mName, idx) {
                    var mBtn = document.createElement("button");
                    mBtn.className = "month-btn" + (idx + 1 === self.viewMonth ? " active" : "");
                    mBtn.textContent = mName;
                    if (idx + 1 === self.viewMonth) {
                        mBtn.style.backgroundColor = self.themeColor;
                    }
                    mBtn.onclick = function () {
                        self.viewMonth = idx + 1;
                        self.viewMode = 'days';
                        self.render();
                    };
                    monthGrid.appendChild(mBtn);
                });

                parent.appendChild(monthGrid);
            } else if (this.viewMode === 'years') {
                var yearGrid = document.createElement("div");
                yearGrid.className = "pbi-year-grid";

                var startY = this.viewYear - 5;
                for (var y = startY; y < startY + 12; y++) {
                    (function (yr) {
                        var yBtn = document.createElement("button");
                        yBtn.className = "year-btn" + (yr === self.viewYear ? " active" : "");
                        yBtn.textContent = self.formatDigits(yr);
                        if (yr === self.viewYear) {
                            yBtn.style.backgroundColor = self.themeColor;
                        }
                        yBtn.onclick = function () {
                            self.viewYear = yr;
                            self.viewMode = 'months';
                            self.render();
                        };
                        yearGrid.appendChild(yBtn);
                    })(y);
                }

                parent.appendChild(yearGrid);
            }

            // Locked Developer Credit Footer
            var footer = document.createElement("div");
            footer.className = "pbi-calendar-footer";
            footer.setAttribute("data-author-lock", "pouriae6@gmail.com");

            var authorText = document.createElement("span");
            authorText.className = "author-credit";
            authorText.textContent = "توسعه‌دهنده: پوریا احتشام‌زاده";

            var confirmBtn = document.createElement("button");
            confirmBtn.className = "confirm-btn";
            confirmBtn.textContent = "تایید";
            confirmBtn.onclick = function () {
                self.isPopupOpen = false;
                self.render();
            };

            footer.appendChild(authorText);
            footer.appendChild(confirmBtn);
            parent.appendChild(footer);
        };

        Visual.prototype.setPresetToday = function () {
            var now = new Date();
            var today = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
            this.startDate = { jy: today.jy, jm: today.jm, jd: today.jd };
            this.endDate = { jy: today.jy, jm: today.jm, jd: today.jd };
        };

        Visual.prototype.setPresetThisMonth = function () {
            var now = new Date();
            var today = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
            this.startDate = { jy: today.jy, jm: today.jm, jd: 1 };
            this.endDate = { jy: today.jy, jm: today.jm, jd: getDaysInJalaliMonth(today.jy, today.jm) };
        };

        Visual.prototype.setPresetLast30Days = function () {
            var now = new Date();
            var today = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
            this.endDate = { jy: today.jy, jm: today.jm, jd: today.jd };

            var d = new Date();
            d.setDate(d.getDate() - 30);
            this.startDate = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
        };

        Visual.prototype.setPresetThisYear = function () {
            var now = new Date();
            var today = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
            this.startDate = { jy: today.jy, jm: 1, jd: 1 };
            this.endDate = { jy: today.jy, jm: 12, jd: getDaysInJalaliMonth(today.jy, 12) };
        };

        Visual.prototype.isEqual = function (a, b) {
            if (!a || !b) return false;
            return a.jy === b.jy && a.jm === b.jm && a.jd === b.jd;
        };

        Visual.prototype.compare = function (a, b) {
            if (a.jy !== b.jy) return a.jy - b.jy;
            if (a.jm !== b.jm) return a.jm - b.jm;
            return a.jd - b.jd;
        };

        Visual.prototype.isInRange = function (target, start, end) {
            if (!start || !end) return false;
            return this.compare(target, start) >= 0 && this.compare(target, end) <= 0;
        };

        Visual.prototype.applyFilterToPowerBI = function () {
            if (!this.dateColumnTarget || !this.host) return;

            var conditions = [];
            if (this.startDate && this.endDate) {
                var sG = jalaliToGregorian(this.startDate.jy, this.startDate.jm, this.startDate.jd);
                var eG = jalaliToGregorian(this.endDate.jy, this.endDate.jm, this.endDate.jd);

                var sIso = new Date(Date.UTC(sG.gy, sG.gm - 1, sG.gd, 0, 0, 0)).toISOString();
                var eIso = new Date(Date.UTC(eG.gy, eG.gm - 1, eG.gd, 23, 59, 59)).toISOString();

                conditions = [
                    { operator: "GreaterThanOrEqual", value: sIso },
                    { operator: "LessThanOrEqual", value: eIso }
                ];
            } else if (this.startDate) {
                var sG1 = jalaliToGregorian(this.startDate.jy, this.startDate.jm, this.startDate.jd);
                var sIso1 = new Date(Date.UTC(sG1.gy, sG1.gm - 1, sG1.gd, 0, 0, 0)).toISOString();
                conditions = [{ operator: "GreaterThanOrEqual", value: sIso1 }];
            }

            var filter = null;
            if (conditions.length > 0) {
                filter = {
                    $schema: "https://powerbi.com/product/schema#advanced",
                    target: this.dateColumnTarget,
                    logicalOperator: "And",
                    conditions: conditions
                };
            }

            try {
                this.host.applyJsonFilter(filter, "general", "filter", 1);
            } catch (err) {
                console.warn("Could not apply json filter", err);
            }
        };

        return Visual;
    })();

    // Register plugin with exact Power BI schema
    plugins["${VISUAL_GUID}"] = {
        name: "${VISUAL_GUID}",
        displayName: "${config.displayName}",
        class: "Visual",
        version: "1.0.0",
        apiVersion: "5.3.0",
        create: function (options) {
            return new Visual(options);
        },
        custom: true
    };

})(window.powerbi || (window.powerbi = {}));
`;
}

/**
 * Generates compiled CSS for Power BI Visual
 */
export function generateCompiledVisualCss(themeColor: string): string {
  return `
.persian-date-slicer-container {
  font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif;
  direction: rtl;
  text-align: right;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: visible;
  position: relative;
  user-select: none;
}
.persian-date-slicer-container * {
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
}
.pbi-slicer-input-wrapper:hover {
  border-color: ${themeColor};
}
.pbi-slicer-input-wrapper.active {
  border-color: ${themeColor};
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}
.slicer-cal-icon {
  color: #64748b;
  display: flex;
  align-items: center;
}
.slicer-date-label {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.slicer-clear-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
}
.slicer-clear-btn:hover {
  color: #ef4444;
}
.pbi-calendar-popup {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 99999;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
  padding: 14px;
  width: 310px;
}
.pbi-calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.pbi-calendar-header .nav-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #f8fafc;
  cursor: pointer;
  color: #475569;
  font-size: 14px;
}
.pbi-calendar-header .nav-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}
.pbi-calendar-header .title-selector {
  font-weight: 600;
  font-size: 13px;
  color: #0f172a;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}
.pbi-calendar-header .title-selector:hover {
  background: #f1f5f9;
}
.pbi-weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
}
.pbi-weekdays-grid .weekend {
  color: #ef4444;
}
.pbi-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
}
.day-cell {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #334155;
  transition: all 0.12s ease;
}
.day-cell:hover:not(.empty) {
  background: #e0f2fe;
}
.day-cell.weekend {
  color: #dc2626;
}
.day-cell.selected {
  background-color: ${themeColor} !important;
  color: #ffffff !important;
  font-weight: bold;
}
.day-cell.in-range {
  background: #f0f9ff;
  color: #0369a1;
  border-radius: 0;
}
.pbi-presets-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}
.preset-chip {
  padding: 3px 8px;
  font-size: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: #f8fafc;
  color: #475569;
  cursor: pointer;
}
.preset-chip:hover {
  background: #f1f5f9;
}
.pbi-month-grid, .pbi-year-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 8px 0;
}
.month-btn, .year-btn {
  padding: 8px 4px;
  font-size: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  color: #1e293b;
  cursor: pointer;
  text-align: center;
}
.month-btn.active, .year-btn.active {
  background-color: ${themeColor} !important;
  color: #ffffff !important;
  font-weight: bold;
}
.pbi-calendar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}
.author-credit {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
}
.confirm-btn {
  padding: 3px 10px;
  background: #0f172a;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
}
`;
}

/**
 * Builds the genuine official .pbiviz zip package that Power BI Desktop and PBIRS require.
 */
export async function buildOfficialPbivizPackage(config: VisualConfig): Promise<Blob> {
  const zip = new JSZip();

  const iconBase64 = generateVisualIconBase64();
  const compiledJs = generateCompiledVisualJs(config);
  const compiledCss = generateCompiledVisualCss(config.themeColor);

  let capabilitiesObj: any = {};
  try {
    capabilitiesObj = JSON.parse(CAPABILITIES_JSON);
  } catch (e) {
    console.error('Failed to parse capabilities JSON', e);
  }

  // 1. Root package.json
  // Power BI strictly inspects resources[0].file to locate the visual definition
  const rootPackageJson = {
    name: VISUAL_GUID,
    version: "1.0.0",
    author: {
      name: "پوریا احتشام‌زاده",
      email: "pouriae6@gmail.com"
    },
    resources: [
      {
        resourceId: "rId0",
        sourceType: 5,
        file: `resources/${VISUAL_GUID}.pbiviz.json`
      }
    ],
    visual: {
      name: VISUAL_GUID,
      displayName: config.displayName,
      version: "1.0.0",
      description: "کاستوم ویژوال اسلایسر و تقویم تاریخ شمسی ویژه Power BI Desktop و Power BI Report Server (PBIRS)",
      supportUrl: "https://github.com",
      gitHubUrl: "https://github.com"
    }
  };
  zip.file("package.json", JSON.stringify(rootPackageJson, null, 2));

  // 2. resources/<guid>.pbiviz.json
  // This is the core binary payload that Power BI Desktop deserializes
  const resourcePayload = {
    visual: {
      name: VISUAL_GUID,
      displayName: config.displayName,
      guid: VISUAL_GUID,
      visualClassName: "Visual",
      version: "1.0.0",
      description: "کاستوم ویژوال اسلایسر و تقویم تاریخ شمسی ویژه Power BI Desktop و Power BI Report Server (PBIRS)",
      supportUrl: "https://github.com",
      gitHubUrl: "https://github.com"
    },
    content: {
      js: compiledJs,
      css: compiledCss,
      iconBase64: iconBase64,
      capabilities: capabilitiesObj,
      stringResources: {}
    }
  };

  const resourcesFolder = zip.folder("resources");
  if (resourcesFolder) {
    resourcesFolder.file(`${VISUAL_GUID}.pbiviz.json`, JSON.stringify(resourcePayload, null, 2));
    // Also include standalone visual.js and visual.css in resources as recommended by PowerBI-visuals-tools
    resourcesFolder.file("visual.js", compiledJs);
    resourcesFolder.file("visual.css", compiledCss);
  }

  // Generate the zip with standard deflate compression
  return await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}
