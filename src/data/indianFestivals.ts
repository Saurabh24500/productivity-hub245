export interface Festival {
  date: string; // MM-DD
  name: string;
  type: 'national' | 'religious' | 'cultural';
}

// Major Indian festivals for 2025-2026 (approximate dates, some vary yearly)
export const indianFestivals2026: Festival[] = [
  { date: "01-01", name: "New Year's Day", type: "national" },
  { date: "01-14", name: "Makar Sankranti / Pongal", type: "cultural" },
  { date: "01-26", name: "Republic Day", type: "national" },
  { date: "02-26", name: "Maha Shivaratri", type: "religious" },
  { date: "03-14", name: "Holi", type: "cultural" },
  { date: "03-30", name: "Eid-ul-Fitr", type: "religious" },
  { date: "04-02", name: "Ram Navami", type: "religious" },
  { date: "04-06", name: "Mahavir Jayanti", type: "religious" },
  { date: "04-10", name: "Good Friday", type: "religious" },
  { date: "04-14", name: "Ambedkar Jayanti", type: "national" },
  { date: "04-14", name: "Baisakhi", type: "cultural" },
  { date: "05-01", name: "May Day", type: "national" },
  { date: "05-12", name: "Buddha Purnima", type: "religious" },
  { date: "06-07", name: "Eid-ul-Adha", type: "religious" },
  { date: "07-06", name: "Muharram", type: "religious" },
  { date: "08-15", name: "Independence Day", type: "national" },
  { date: "08-16", name: "Janmashtami", type: "religious" },
  { date: "09-05", name: "Milad-un-Nabi", type: "religious" },
  { date: "09-05", name: "Teachers' Day", type: "national" },
  { date: "10-02", name: "Gandhi Jayanti", type: "national" },
  { date: "10-02", name: "Dussehra", type: "cultural" },
  { date: "10-20", name: "Diwali", type: "cultural" },
  { date: "10-22", name: "Bhai Dooj", type: "cultural" },
  { date: "11-01", name: "Chhath Puja", type: "cultural" },
  { date: "11-15", name: "Guru Nanak Jayanti", type: "religious" },
  { date: "12-25", name: "Christmas", type: "religious" },
];

export function getFestivalsForMonth(month: number): Festival[] {
  const mm = String(month + 1).padStart(2, '0');
  return indianFestivals2026.filter(f => f.date.startsWith(mm));
}

export function getFestivalForDate(month: number, day: number): Festival | undefined {
  const key = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return indianFestivals2026.find(f => f.date === key);
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}
