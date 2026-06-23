const MONTHS: Record<string, number> = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sep: 9, sept: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12,
};

function isValidDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    daysInMonth[1] = 29;
  }
  return day <= daysInMonth[month - 1];
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function validateBirthday(birthday: string): string {
  const s = birthday.trim();

  const yyyymmdd = /^(\d{4})(\d{2})(\d{2})$/;
  const m1 = yyyymmdd.exec(s);
  if (m1) {
    const y = parseInt(m1[1]), mo = parseInt(m1[2]), d = parseInt(m1[3]);
    if (isValidDate(y, mo, d)) return s;
  }

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/;
  const m2 = iso.exec(s);
  if (m2) {
    const y = parseInt(m2[1]), mo = parseInt(m2[2]), d = parseInt(m2[3]);
    if (isValidDate(y, mo, d)) return `${y}${pad(mo)}${pad(d)}`;
  }

  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const m3 = us.exec(s);
  if (m3) {
    const mo = parseInt(m3[1]), d = parseInt(m3[2]), y = parseInt(m3[3]);
    if (isValidDate(y, mo, d)) return `${y}${pad(mo)}${pad(d)}`;
  }

  const longMonth = /^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/;
  const m4 = longMonth.exec(s);
  if (m4) {
    const monthName = m4[1].toLowerCase();
    const mo = MONTHS[monthName];
    const d = parseInt(m4[2]), y = parseInt(m4[3]);
    if (mo && isValidDate(y, mo, d)) return `${y}${pad(mo)}${pad(d)}`;
  }

  const dmy = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/;
  const m5 = dmy.exec(s);
  if (m5) {
    const d = parseInt(m5[1]);
    const monthName = m5[2].toLowerCase();
    const mo = MONTHS[monthName];
    const y = parseInt(m5[3]);
    if (mo && isValidDate(y, mo, d)) return `${y}${pad(mo)}${pad(d)}`;
  }

  throw new Error(
    `Invalid birthday format: '${birthday}'. ` +
    "Expected YYYYMMDD or human-readable format like 'January 1, 1990'."
  );
}


