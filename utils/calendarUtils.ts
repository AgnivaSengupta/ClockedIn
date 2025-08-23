import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek.js"
dayjs.extend(isoWeek)


export function generateMonthMatrix(currentDate: dayjs.Dayjs){
    const startofMonth = dayjs(currentDate).startOf("month")
    const endofMonth = dayjs(currentDate).endOf("month")
    const startOfCalendar = startofMonth.startOf("week")
    const endOfCalendar = endofMonth.endOf("week")


    let date = startOfCalendar;
    const weeks = [];
  
    while (date.isBefore(endOfCalendar)) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(date);
        date = date.add(1, "day");
      }
      weeks.push(week);
    }
  
    return weeks;
}


export function generateWeek(currentDate: dayjs.Dayjs) {
    const startOfWeek = dayjs(currentDate).startOf("week");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  }

