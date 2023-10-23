import { useRef, useState } from "react";
import { Data } from "react-csv/components/CommonPropTypes";
import { useTranslation } from "react-i18next";
import { replaceRuEngDates } from "../utils/common";

export const useForm = () => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const refScroll = useRef(null as any);
  const refCheckBox = useRef(null as any);
  const [result, setResult] = useState({ status: false, error: "" } as any);
  const [resultCsv, setResultCsv] = useState<
    string | Data | (() => string | Data)
  >([]);
  const { t, i18n } = useTranslation();

  const sendForm = () => {
    if (ref.current === null) return;
    setResult({ loading: true });
    let requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          wallets: ref.current.value.split("\n"),
          isFreshData: refCheckBox.current?.checked,
        },
      }),
    };
    fetch("/api/batchcheck", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setResult(data);
        if (data.data !== undefined) {
          setResultCsv([
            t("csvTabs", { returnObjects: true }),
            ...data.data.map((v: any, index: number) => [
              String(index + 1),
              String(v.contract),
              String(v.balance),
              String(v.nonce),
              String(v.bridgesVolume),
              String(v.bridgesWithCexVolume),
              String(v.internalVolume),
              String(v.txTimestamps),
              i18n.language === "ru"
                ? String(v.lastTx)
                : replaceRuEngDates(String(v.lastTx)),
            ]),
          ]);
        }
        setTimeout(() => refScroll.current.scrollIntoView(), 500);
      });
  };

  return { sendForm, ref, refScroll, result, resultCsv, refCheckBox };
};
