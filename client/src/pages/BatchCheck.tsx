import { Watch } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import useForm from "../hooks/useForm";
import useTitle from "../hooks/useTitle";
import { useId } from "react";
import { CSVLink } from "react-csv";
import { replaceRuEngDates } from "../utils/common";

const BatchCheck = () => {
  const { t, i18n } = useTranslation();
  const form = useForm();
  const id = useId();

  useTitle(t("title", { page: t("navBatchcheck") }));

  return (
    <>
      <h3 className="textCenter">{t("batchcheckTitle")}</h3>
      <div className="line-break"></div>
      <div className="textCenter">{t("batchcheckDescription")}</div>
      <div className="line-break"></div>
      <div className="textCenter">{t("batchcheckDescription2")}</div>
      <div className="line-break"></div>
      <textarea
        ref={form.ref}
        rows={20}
        spellCheck={false}
        style={{ width: "60%", fontSize: "1rem" }}
      />
      <div className="line-break"></div>
      <div className="form-group">
        <input type="checkbox" ref={form.refCheckBox} id="batchCheckBox" />{" "}
        <label htmlFor="batchCheckBox">{t("batchcheckFreshData")}</label>
      </div>
      <div className="line-break"></div>
      <button className="button-61" onClick={() => form.sendForm()}>
        {t("batchcheckCheckButton")}
      </button>
      <div className="line-break"></div>
      {form.result.data === undefined ? (
        form.result.loading === undefined ? (
          <div>{form.result.error}</div>
        ) : (
          <Watch
            height="80"
            width="80"
            radius="48"
            color="#0c0c4f"
            ariaLabel="watch-loading"
            wrapperStyle={{}}
            visible={true}
          />
        )
      ) : (
        <>
          <ul ref={form.refScroll}>
            <li className="table-header">
              <div className="col col-0">#</div>
              <div className="col col-1">{t("address")}</div>
              <div className="col col-2">{t("balance")}</div>
              <div className="col col-3">{t("transactions")}</div>
              <div className="col col-4">{t("bridgeVolume")}</div>
              <div className="col col-5">{t("bridgeExchangesVolume")}</div>
              <div className="col col-5">{t("navInternalVolume")}</div>
              <div className="col col-6">{t("active")}</div>
              <div className="col col-7">{t("lastTransaction")}</div>
            </li>
            {form.result.data.map((v: any, index: number) => (
              <li className="table-row" key={id}>
                <div className="col col-0" data-label="#">
                  {index + 1}
                </div>
                <div className="col col-1" data-label="Адрес123">{`${String(
                  v.contract
                ).substring(0, 6)}...${String(v.contract).substring(
                  v.contract.length - 6
                )}`}</div>
                <div className="col col-2" data-label="Баланс">
                  {Number(v.balance).toFixed(5)} ETH
                </div>
                <div className="col col-3" data-label="Транзакции">
                  {v.nonce}
                </div>
                <div className="col col-4" data-label="Объем через мост">
                  {Number(v.bridgesVolume).toFixed(3)} ETH
                </div>
                <div
                  className="col col-5"
                  data-label="Объем через мост + биржи"
                >
                  {Number(v.bridgesWithCexVolume).toFixed(3)} ETH
                </div>
                <div className="col col-6" data-label="Объем внутри сети">
                  {Number(v.internalVolume) < 1 && Number(v.internalVolume) > 0
                    ? Number(v.internalVolume).toFixed(2)
                    : Math.floor(Number(v.internalVolume))}
                  $
                </div>
                <div
                  className="col col-7"
                  data-label="Активных дней / недель / месяцев"
                >
                  {v.txTimestamps}
                </div>
                <div className="col col-8" data-label="Последняя транзакция">
                  {i18n.language === "ru"
                    ? String(v.lastTx)
                    : replaceRuEngDates(String(v.lastTx))}
                </div>
              </li>
            ))}
          </ul>
          <CSVLink
            className="button-61"
            style={{ position: "fixed", bottom: "5px", right: "5px" }}
            data={form.resultCsv}
          >
            {t("export")}
          </CSVLink>
        </>
      )}
    </>
  );
};

export default BatchCheck;
