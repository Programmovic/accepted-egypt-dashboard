export default function calculateTimeDuration(startTime, endTime) {
    // Split the time strings into hours and minutes
    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

    // Convert hours and minutes to numbers
    const startHourNum = parseInt(startHour, 10);
    const startMinuteNum = parseInt(startMinute, 10);
    const endHourNum = parseInt(endHour, 10);
    const endMinuteNum = parseInt(endMinute, 10);

    // Calculate the duration in minutes
    const totalMinutesStart = startHourNum * 60 + startMinuteNum;
    const totalMinutesEnd = endHourNum * 60 + endMinuteNum;
    const duration = totalMinutesEnd - totalMinutesStart;

    return duration;
  }