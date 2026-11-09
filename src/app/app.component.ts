import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { RoutineIconComponent } from './routine-icon.component';

type Language = 'ar' | 'en';
type RoutineItem = { id: string; ar: string; en: string; water?: boolean };
type RoutineSection = { id: string; ar: string; en: string; items: RoutineItem[]; tone: string };
type DayRecord = { date: Date; checked: number; total: number };
type WeekRecord = { start: Date; days: DayRecord[] };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RoutineIconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  language: Language = 'en';
  weekOffset = 0;
  checked = new Set<string>();
  statsOpen = false;
  backupNotice = '';
  statsMonth = new Date().getMonth();
  statsYear = new Date().getFullYear();

  readonly labels: Record<string, { ar: string; en: string }> = {
    eyebrow: { ar: 'مساحة هادئة لعاداتك اليومية', en: 'A calmer space for your daily habits' },
    title: { ar: 'متابعة الروتين', en: 'Routine tracker' },
    subtitle: { ar: 'خطوة صغيرة كل يوم تصنع فرقًا كبيرًا.', en: 'Small steps, repeated daily, add up.' },
    previous: { ar: 'الأسبوع السابق', en: 'Previous week' }, next: { ar: 'الأسبوع التالي', en: 'Next week' }, current: { ar: 'هذا الأسبوع', en: 'This week' },
    stats: { ar: 'الإحصائيات', en: 'Statistics' }, print: { ar: 'طباعة', en: 'Print' }, reset: { ar: 'إعادة ضبط الأسبوع', en: 'Reset week' },
    progress: { ar: 'إنجاز الأسبوع', en: 'Weekly progress' }, completed: { ar: 'مهمة مكتملة', en: 'tasks completed' },
    today: { ar: 'تقدّمك هذا الأسبوع', en: 'Your progress this week' }, tracker: { ar: 'جدول العادات', en: 'Weekly overview' },
    trackerHint: { ar: 'اختاري المربع عند إتمام العادة في يومها.', en: 'Check a box when you complete a habit.' },
    routine: { ar: 'العادة', en: 'Habit' }, saved: { ar: 'يُحفظ تقدمك تلقائيًا على هذا الجهاز', en: 'Your progress is saved on this device' },
    water: { ar: 'حصة', en: 'serving' }, waterGoal: { ar: '٢٫٥ لتر يوميًا', en: '2.5 liters daily' },
    allPrayers: { ar: 'إتمام الصلوات', en: 'All prayers completed' }, allSunnah: { ar: 'إتمام السنن والنوافل', en: 'Sunnah and voluntary prayers completed' },
    prayers: { ar: 'الصلوات المفروضة', en: 'Daily prayers' }, sunnah: { ar: 'السنن الرواتب والنوافل', en: 'Sunnah & voluntary prayers' },
    devotionalGroup: { ar: 'الأذكار والقرآن', en: 'Daily remembrance & Quran' },
    qiyam: { ar: 'قيام الليل والوتر', en: 'Night prayer & Witr' }, tasbeeh: { ar: 'ورد التسبيح', en: 'Zikr' }, waterTitle: { ar: 'شرب المياه', en: 'Water' },
    morning: { ar: 'أذكار الصباح', en: 'Morning Azkar' }, evening: { ar: 'أذكار المساء', en: 'Evening Azkar' }, quran: { ar: 'ورد القرآن', en: 'Quran reading' },
    fajr: { ar: 'الفجر', en: 'Fajr' }, dhuhr: { ar: 'الظهر', en: 'Dhuhr' }, asr: { ar: 'العصر', en: 'Asr' }, maghrib: { ar: 'المغرب', en: 'Maghrib' }, isha: { ar: 'العشاء', en: 'Isha' },
    before2: { ar: '٢ قبل', en: '2 before' }, before4after2: { ar: '٤ قبل، ٢ بعد', en: '4 before, 2 after' }, before4optional: { ar: '٤ قبل اختيارية', en: '4 before, optional' }, after2: { ar: '٢ بعد', en: '2 after' }, after2witr: { ar: '٢ بعد + وتر', en: '2 after + Witr' },
    statsTitle: { ar: 'إحصائيات الروتين', en: 'Routine statistics' }, statsHint: { ar: 'ملخص من الأسابيع المحفوظة على هذا المتصفح', en: 'Summary of the weeks saved in this browser' }, month: { ar: 'الشهر', en: 'Month' }, year: { ar: 'السنة', en: 'Year' },
    monthlyRate: { ar: 'معدل الإنجاز', en: 'Completion rate' }, tasksDone: { ar: 'المهام المنجزة', en: 'Tasks completed' }, recordedDays: { ar: 'الأيام المسجلة', en: 'Days recorded' },
    weekBreakdown: { ar: 'تفصيل الأسابيع في الشهر', en: 'Weeks this month' }, yearBreakdown: { ar: 'الشهور خلال السنة', en: 'Months this year' }, noData: { ar: 'لا توجد بيانات محفوظة لهذا الشهر بعد.', en: 'No saved data for this month yet.' }, close: { ar: 'إغلاق', en: 'Close' },
    weekFrom: { ar: 'الأسبوع من', en: 'Week of' }, to: { ar: 'إلى', en: 'to' }, day: { ar: 'يوم', en: 'days' }, of: { ar: 'من', en: 'of' },
    resetConfirm: { ar: 'هل تريدين حذف علامات هذا الأسبوع؟', en: 'Clear the checkmarks for this week?' },
    export: { ar: 'تصدير نسخة احتياطية', en: 'Export backup' }, import: { ar: 'استيراد بيانات', en: 'Import data' }, imported: { ar: 'تم استيراد البيانات بنجاح', en: 'Data imported successfully' }, importError: { ar: 'ملف النسخة الاحتياطية غير صالح', en: 'This backup file is not valid' },
  };

  readonly weekdays = [
    { ar: 'أحد', en: 'Sun' }, { ar: 'إثن', en: 'Mon' }, { ar: 'ثلا', en: 'Tue' },
    { ar: 'أرب', en: 'Wed' }, { ar: 'خمي', en: 'Thu' }, { ar: 'جمع', en: 'Fri' }, { ar: 'سبت', en: 'Sat' },
  ];
  readonly months = {
    ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  readonly sections: RoutineSection[] = [
    { id: 'prayers', ar: 'الصلوات المفروضة', en: 'Daily prayers', tone: 'indigo', items: [
      { id: 'fard-fajr', ar: 'الفجر', en: 'Fajr' }, { id: 'fard-dhuhr', ar: 'الظهر', en: 'Dhuhr' }, { id: 'fard-asr', ar: 'العصر', en: 'Asr' },
      { id: 'fard-maghrib', ar: 'المغرب', en: 'Maghrib' }, { id: 'fard-isha', ar: 'العشاء', en: 'Isha' }, { id: 'fard-all', ar: 'إتمام الصلوات', en: 'All prayers completed' },
    ] },
    { id: 'sunnah', ar: 'السنن الرواتب والنوافل', en: 'Sunnah & voluntary prayers', tone: 'teal', items: [
      { id: 'sunnah-fajr', ar: 'الفجر · ٢ قبل', en: 'Fajr · 2 before' }, { id: 'sunnah-dhuhr', ar: 'الظهر · ٤ قبل، ٢ بعد', en: 'Dhuhr · 4 before, 2 after' },
      { id: 'sunnah-asr', ar: 'العصر · ٤ قبل اختيارية', en: 'Asr · 4 before, optional' }, { id: 'sunnah-maghrib', ar: 'المغرب · ٢ بعد', en: 'Maghrib · 2 after' },
      { id: 'sunnah-isha', ar: 'العشاء · ٢ بعد + وتر', en: 'Isha · 2 after + Witr' }, { id: 'sunnah-all', ar: 'إتمام السنن والنوافل', en: 'All completed' },
    ] },
    { id: 'qiyam', ar: 'قيام الليل والوتر', en: 'Night prayer & Witr', tone: 'violet', items: [{ id: 'qiyam', ar: 'تم الإنجاز', en: 'Completed' }] },
    { id: 'tasbeeh', ar: 'ورد التسبيح · ١٠٠٠ مرة', en: 'Zikr · 1,000 times', tone: 'amber', items: [{ id: 'tasbeeh', ar: 'تم الورد', en: 'Completed' }] },
    { id: 'water', ar: 'شرب المياه · ٢٫٥ لتر', en: 'Water · 2.5 liters', tone: 'blue', items: [{ id: 'water', ar: '٤ حصص · ٦٢٥ مل', en: '4 servings · 625 ml', water: true }] },
    { id: 'morning', ar: 'أذكار الصباح', en: 'Morning Azkar', tone: 'orange', items: [{ id: 'azkar-sabah', ar: 'تمت الأذكار', en: 'Completed' }] },
    { id: 'evening', ar: 'أذكار المساء', en: 'Evening Azkar', tone: 'slate', items: [{ id: 'azkar-misaa', ar: 'تمت الأذكار', en: 'Completed' }] },
    { id: 'quran', ar: 'ورد القرآن الكريم', en: 'Quran reading', tone: 'emerald', items: [{ id: 'quran', ar: 'تم الورد', en: 'Completed' }] },
  ];

  ngOnInit(): void {
    try {
      this.language = localStorage.getItem('routine_language') === 'ar' ? 'ar' : 'en';
    } catch { this.language = 'en'; }
    this.loadWeek();
    this.setDocumentLanguage();
  }

  t(key: string): string { return this.labels[key]?.[this.language] ?? key; }
  get footerNote(): string { return this.language === 'ar' ? 'خطوات ثابتة، تقدم مستمر' : 'Made for steady progress'; }
  text(item: RoutineItem): string { return item[this.language]; }
  sectionTitle(section: RoutineSection): string { return section[this.language]; }
  get dir(): string { return this.language === 'ar' ? 'rtl' : 'ltr'; }
  get todayString(): string { return new Date().toDateString(); }
  get weekStart(): Date {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + this.weekOffset * 7);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  get weekDays(): Date[] { return Array.from({ length: 7 }, (_, index) => this.addDays(this.weekStart, index)); }
  get weekLabel(): string {
    const start = this.formatDate(this.weekDays[0]);
    const end = this.formatDate(this.weekDays[6]);
    return this.language === 'ar' ? `${this.t('weekFrom')} ${start} ${this.t('to')} ${end}` : `${this.t('weekFrom')} ${start} – ${end}`;
  }
  get totalTasks(): number { return this.sections.reduce((sum, section) => sum + section.items.reduce((n, item) => n + (item.water ? 4 : 1), 0) * 7, 0); }
  get completedTasks(): number { return this.checked.size; }
  get progress(): number { return this.totalTasks ? Math.round(this.completedTasks / this.totalTasks * 100) : 0; }
  get yearOptions(): number[] {
    const years = new Set([new Date().getFullYear(), ...this.getRecords().map((record) => record.start.getFullYear())]);
    return [...years].sort((a, b) => b - a);
  }
  get monthNames(): string[] { return this.months[this.language]; }
  get statsDays(): DayRecord[] {
    return this.getRecords().flatMap((record) => record.days).filter((day) => day.date.getFullYear() === this.statsYear && day.date.getMonth() === this.statsMonth);
  }
  get statsChecked(): number { return this.statsDays.reduce((sum, day) => sum + day.checked, 0); }
  get statsTotal(): number { return this.statsDays.reduce((sum, day) => sum + day.total, 0); }
  get statsProgress(): number { return this.statsTotal ? Math.round(this.statsChecked / this.statsTotal * 100) : 0; }
  get statsWeeks(): WeekRecord[] {
    return this.getRecords().filter((record) => record.days.some((day) => day.date.getFullYear() === this.statsYear && day.date.getMonth() === this.statsMonth));
  }

  toggleLanguage(): void {
    this.language = this.language === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('routine_language', this.language); } catch { /* keep the choice for this session */ }
    this.setDocumentLanguage();
  }
  setDocumentLanguage(): void {
    document.documentElement.lang = this.language;
    document.documentElement.dir = this.dir;
    document.title = 'Weekly Routine';
  }
  formatDate(date: Date): string {
    const month = this.monthNames[date.getMonth()];
    return this.language === 'ar' ? `${date.getDate()} ${month}` : `${month.slice(0, 3)} ${date.getDate()}`;
  }
  formatCompactDate(date: Date): string { return `${date.getDate()}/${date.getMonth() + 1}`; }
  addDays(date: Date, count: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + count);
    return next;
  }
  monthDayCount(month: number): number { return new Date(this.statsYear, month + 1, 0).getDate(); }
  keyFor(item: RoutineItem, dayIndex: number, cup = 0): string {
    return item.water ? `water-${dayIndex}-${cup + 1}` : `${item.id}-${dayIndex}`;
  }
  isChecked(item: RoutineItem, dayIndex: number, cup = 0): boolean { return this.checked.has(this.keyFor(item, dayIndex, cup)); }
  setChecked(item: RoutineItem, dayIndex: number, event: Event, cup = 0): void {
    const key = this.keyFor(item, dayIndex, cup);
    (event.target as HTMLInputElement).checked ? this.checked.add(key) : this.checked.delete(key);
    this.saveWeek();
  }
  allDaysChecked(item: RoutineItem): boolean { return this.weekdays.every((_, index) => this.isChecked(item, index)); }
  isWideSection(section: RoutineSection): boolean { return ['prayers', 'sunnah', 'water'].includes(section.id); }
  isCompactSection(section: RoutineSection): boolean { return ['qiyam', 'tasbeeh'].includes(section.id); }
  printPage(): void { window.print(); }
  changeWeek(amount: number): void { this.weekOffset += amount; this.loadWeek(); }
  goToCurrentWeek(): void { this.weekOffset = 0; this.loadWeek(); }
  resetWeek(): void {
    const message = this.t('resetConfirm');
    if (!window.confirm(message)) return;
    try { localStorage.removeItem(this.storageKey()); } catch { /* the visible state still resets */ }
    this.checked.clear();
  }
  exportBackup(): void {
    const weeks: Record<string, unknown> = {};
    try {
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (key && /^girly_routine_\d{4}_W\d{1,2}_\d{1,2}$/.test(key)) weeks[key] = JSON.parse(localStorage.getItem(key) || '{}');
      }
    } catch { /* export any weeks already read */ }
    const blob = new Blob([JSON.stringify({ version: 1, weeks }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'routine-backup.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async importBackup(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const backup = JSON.parse(await file.text()) as { weeks?: Record<string, Record<string, boolean>> };
      if (!backup.weeks || typeof backup.weeks !== 'object') throw new Error('Invalid backup format');
      Object.entries(backup.weeks).forEach(([key, value]) => {
        if (/^girly_routine_\d{4}_W\d{1,2}_\d{1,2}$/.test(key) && value && typeof value === 'object') localStorage.setItem(key, JSON.stringify(value));
      });
      this.loadWeek();
      this.backupNotice = this.t('imported');
    } catch {
      this.backupNotice = this.t('importError');
    }
    input.value = '';
  }
  openStats(): void { this.statsMonth = new Date().getMonth(); this.statsYear = new Date().getFullYear(); this.statsOpen = true; }
  closeStats(): void { this.statsOpen = false; }
  @HostListener('document:keydown.escape') closeStatsOnEscape(): void { this.statsOpen = false; }
  percentForWeek(record: WeekRecord): number {
    const days = record.days.filter((day) => day.date.getFullYear() === this.statsYear && day.date.getMonth() === this.statsMonth);
    const done = days.reduce((sum, day) => sum + day.checked, 0);
    const total = days.reduce((sum, day) => sum + day.total, 0);
    return total ? Math.round(done / total * 100) : 0;
  }
  isViewingWeek(record: WeekRecord): boolean { return record.start.getTime() === this.weekStart.getTime(); }
  goToWeek(record: WeekRecord): void {
    const weeksApart = Math.round((record.start.getTime() - this.weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    this.weekOffset += weeksApart;
    this.loadWeek();
    this.closeStats();
  }
  percentForMonth(month: number): number {
    const days = this.getRecords().flatMap((record) => record.days).filter((day) => day.date.getFullYear() === this.statsYear && day.date.getMonth() === month);
    const done = days.reduce((sum, day) => sum + day.checked, 0);
    const total = days.reduce((sum, day) => sum + day.total, 0);
    return total ? Math.round(done / total * 100) : 0;
  }
  getRecordedDays(month: number): number {
    return this.getRecords().flatMap((record) => record.days).filter((day) => day.date.getFullYear() === this.statsYear && day.date.getMonth() === month).length;
  }

  private storageKey(): string {
    const date = this.weekStart;
    return `girly_routine_${date.getFullYear()}_W${date.getMonth() + 1}_${date.getDate()}`;
  }
  private loadWeek(): void {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey()) || '{}') as Record<string, boolean>;
      this.checked = new Set(Object.keys(data).filter((key) => data[key]));
    } catch { this.checked = new Set(); }
  }
  private saveWeek(): void {
    try { localStorage.setItem(this.storageKey(), JSON.stringify(Object.fromEntries([...this.checked].map((key) => [key, true])))); } catch { /* preserve the current in-memory state */ }
  }
  private getRecords(): WeekRecord[] {
    const records: WeekRecord[] = [];
    const dailyTotal = this.sections.reduce((sum, section) => sum + section.items.reduce((n, item) => n + (item.water ? 4 : 1), 0), 0);
    try {
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        const match = key?.match(/^girly_routine_(\d{4})_W(\d{1,2})_(\d{1,2})$/);
        if (!key || !match) continue;
        const start = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
        const data = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, boolean>;
        const days = Array.from({ length: 7 }, (_, dayIndex) => {
          const date = this.addDays(start, dayIndex);
          const checked = Object.keys(data).filter((entry) => {
            const day = entry.startsWith('water-') ? Number(entry.match(/^water-(\d+)-/)?.[1]) : Number(entry.match(/-(\d+)$/)?.[1]);
            return data[entry] && day === dayIndex;
          }).length;
          return { date, checked, total: dailyTotal };
        });
        records.push({ start, days });
      }
    } catch { /* malformed or unavailable browser storage is ignored */ }
    return records.sort((a, b) => a.start.getTime() - b.start.getTime());
  }
}
