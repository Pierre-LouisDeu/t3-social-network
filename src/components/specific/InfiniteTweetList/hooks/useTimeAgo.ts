import dayjs from "dayjs";
import { useEffect, useState } from "react";

const secInOneMin = 60;
const secInOneHour = 3600;

export const useTimeAgo = (date: Date): string => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    const secSinceDate = dayjs().diff(date, "second");
    const secSinceToday = dayjs().diff(dayjs().startOf("day"), "second");
    const secSinceYesterday = dayjs().diff(
      dayjs().subtract(1, "day").startOf("day"),
      "second"
    );
    const interval = setInterval(() => {
      if (secSinceDate < secInOneMin) {
        setTimeAgo("just now");
      } else if (secSinceDate < secInOneHour) {
        setTimeAgo(`${Math.floor(secSinceDate / secInOneMin)} min`);
      } else if (secSinceDate < secSinceToday) {
        setTimeAgo(`${Math.floor(secSinceDate / secInOneHour)}h`);
      } else if (secSinceDate < secSinceYesterday) {
        setTimeAgo("yesterday");
      } else {
        setTimeAgo(dayjs(date).format("DD MMM YYYY"));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return timeAgo;
};
