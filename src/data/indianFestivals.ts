export interface Festival {
  date: string; // MM-DD
  name: string;
  nameGu: string; // Gujarati name
  type: 'national' | 'religious' | 'cultural';
  description?: string;
}

// Gujarat-centric festivals for 2026 (approximate dates)
export const indianFestivals2026: Festival[] = [
  { date: "01-01", name: "New Year's Day", nameGu: "નવું વર્ષ", type: "national" },
  { date: "01-14", name: "Uttarayan / Makar Sankranti", nameGu: "ઉત્તરાયણ", type: "cultural", description: "Gujarat's grand kite festival" },
  { date: "01-26", name: "Republic Day", nameGu: "પ્રજાસત્તાક દિન", type: "national" },
  { date: "02-26", name: "Maha Shivaratri", nameGu: "મહા શિવરાત્રી", type: "religious" },
  { date: "03-14", name: "Holi", nameGu: "હોળી", type: "cultural", description: "Festival of colors" },
  { date: "03-15", name: "Dhuleti", nameGu: "ધુળેટી", type: "cultural", description: "Gujarat celebrates Dhuleti the day after Holi" },
  { date: "03-30", name: "Eid-ul-Fitr", nameGu: "ઈદ-ઉલ-ફિત્ર", type: "religious" },
  { date: "04-02", name: "Ram Navami", nameGu: "રામ નવમી", type: "religious" },
  { date: "04-06", name: "Mahavir Jayanti", nameGu: "મહાવીર જયંતી", type: "religious" },
  { date: "04-10", name: "Good Friday", nameGu: "ગુડ ફ્રાઈડે", type: "religious" },
  { date: "04-14", name: "Ambedkar Jayanti", nameGu: "આંબેડકર જયંતી", type: "national" },
  { date: "05-01", name: "Gujarat Day / May Day", nameGu: "ગુજરાત દિવસ", type: "national", description: "Gujarat Foundation Day" },
  { date: "05-12", name: "Buddha Purnima", nameGu: "બુદ્ધ પૂર્ણિમા", type: "religious" },
  { date: "06-07", name: "Eid-ul-Adha", nameGu: "ઈદ-ઉલ-અઝહા", type: "religious" },
  { date: "07-06", name: "Muharram", nameGu: "મોહરમ", type: "religious" },
  { date: "07-12", name: "Rath Yatra", nameGu: "રથયાત્રા", type: "religious", description: "Ahmedabad's famous Jagannath Rath Yatra" },
  { date: "07-20", name: "Guru Purnima", nameGu: "ગુરુ પૂર્ણિમા", type: "religious" },
  { date: "08-09", name: "Nag Panchami", nameGu: "નાગ પંચમી", type: "religious" },
  { date: "08-15", name: "Independence Day", nameGu: "સ્વાતંત્ર્ય દિન", type: "national" },
  { date: "08-16", name: "Janmashtami", nameGu: "જન્માષ્ટમી", type: "religious", description: "Lord Krishna's birthday — grand celebrations across Gujarat" },
  { date: "08-27", name: "Ganesh Chaturthi", nameGu: "ગણેશ ચતુર્થી", type: "religious" },
  { date: "09-05", name: "Teachers' Day", nameGu: "શિક્ષક દિન", type: "national" },
  { date: "10-02", name: "Gandhi Jayanti", nameGu: "ગાંધી જયંતી", type: "national", description: "Mahatma Gandhi born in Porbandar, Gujarat" },
  { date: "10-02", name: "Navratri Begins", nameGu: "નવરાત્રી શરૂ", type: "cultural", description: "9 nights of Garba — Gujarat's biggest festival" },
  { date: "10-11", name: "Dussehra / Vijayadashami", nameGu: "દશેરા / વિજયાદશમી", type: "cultural" },
  { date: "10-12", name: "Sharad Purnima", nameGu: "શરદ પૂર્ણિમા", type: "cultural" },
  { date: "10-20", name: "Diwali", nameGu: "દિવાળી", type: "cultural", description: "Festival of lights — Gujarati New Year follows" },
  { date: "10-21", name: "Gujarati New Year (Bestu Varas)", nameGu: "બેસતું વર્ષ", type: "cultural", description: "Gujarati Nutan Varsh — New Year in Vikram Samvat" },
  { date: "10-22", name: "Bhai Bij", nameGu: "ભાઈ બીજ", type: "cultural" },
  { date: "10-24", name: "Labh Pancham", nameGu: "લાભ પાંચમ", type: "cultural", description: "Auspicious day to start new ventures" },
  { date: "11-15", name: "Dev Diwali / Guru Nanak Jayanti", nameGu: "દેવ દિવાળી / ગુરુ નાનક જયંતી", type: "religious" },
  { date: "12-25", name: "Christmas", nameGu: "ક્રિસમસ", type: "religious" },
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
