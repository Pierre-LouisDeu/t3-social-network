import dayjs from "dayjs";
import { useEffect, useState } from "react";

const secondsInMinute = 60;
const secondsInHour = 3600;
const hoursInDay = 24;
const oneThousand = 1000;

export const useTimeAgo = (date: Date): string => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor(
        (new Date().getTime() - date.getTime()) / oneThousand
      );
      if (seconds < secondsInMinute) {
        setTimeAgo("just now");
      } else if (seconds < secondsInHour) {
        setTimeAgo(`${Math.floor(seconds / secondsInMinute)} minutes ago`);
      } else if (seconds < secondsInHour * hoursInDay) {
        setTimeAgo(`${Math.floor(seconds / secondsInHour)} hours ago`);
      } else {
        setTimeAgo(dayjs(date).format("DD/MM/YYYY HH:mm"));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return timeAgo;
};
