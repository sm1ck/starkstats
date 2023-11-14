import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import { useTranslation } from "react-i18next";

const useLangFetch = (url: string, isDayShortLabel: boolean = false) => {
  const { i18n } = useTranslation();
  const [loaded, fetchData] = useFetch(url);
  const [lang, setLang] = useState(null as any);

  useEffect(() => {
    if (fetchData?.data?.length > 0) {
      setLang({
        data: fetchData.data.map((v: any) => {
          let dateSplitted = v.label.split(" ");
          let date =
            dateSplitted.length === 3
              ? new Date(dateSplitted[0], dateSplitted[1], dateSplitted[2])
              : new Date(dateSplitted[0], dateSplitted[1], 1);
          let options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
          };
          let label = `${v.y}, ${new Intl.DateTimeFormat(
            i18n.language === "ru" ? "ru-RU" : "en-US",
            options
          ).format(date)}`;
          options = {
            year: "numeric",
            month: "short",
          };
          if (isDayShortLabel) {
            options = { ...options, day: "numeric", year: "2-digit" };
          }
          let shortLabel = new Intl.DateTimeFormat(
            i18n.language === "ru" ? "ru-RU" : "en-US",
            options
          ).format(date);
          return {
            label,
            shortLabel,
            x: v.x,
            y: v.y,
          };
        }),
      });
    }
  }, [fetchData, i18n, setLang, i18n.language, isDayShortLabel]);

  return [loaded, lang];
};

export default useLangFetch;
