import { Watch } from "react-loader-spinner";
import { useForm } from "../hooks/formHook";
import { useTitle } from "../hooks/titleHook";
import { useId } from "react";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";

export const BatchCheck = () => {
    const { t } = useTranslation();
    let form = useForm();
    let id = useId();

    useTitle(t("title", { page: t("navBatchcheck") }));

    return <>
        <h3 className="textCenter">{t("batchcheckTitle")}</h3>
        <div className="line-break"></div>
        <div className="textCenter">{t("batchcheckDescription")}</div>
        <div className="line-break"></div>
        <div className="textCenter">{t("batchcheckDescription2")}</div>
        <div className="line-break"></div>
        <textarea ref={form.ref} rows={20} spellCheck={false} style={{ width: "60%", fontSize: "1rem" }} />
        <div className="line-break"></div>
        <button className="button-61" onClick={() => form.sendForm()}>{t("batchcheckCheckButton")}</button>
        <div className="line-break"></div>
        {form.result.data === undefined ? form.result.loading === undefined ? <div>{form.result.error}</div> : <Watch
            height="80"
            width="80"
            radius="48"
            color="#0c0c4f"
            ariaLabel="watch-loading"
            wrapperStyle={{}}
            visible={true}
        /> : <><ul ref={form.refScroll}>
            <li className="table-header">
                <div className="col col-0">#</div>
                <div className="col col-1">{t("address")}</div>
                <div className="col col-2">{t("balance")}</div>
                <div className="col col-3">{t("transactions")}</div>
                <div className="col col-4">{t("bridgeVolume")}</div>
                <div className="col col-5">{t("bridgeExchangesVolume")}</div>
                <div className="col col-6">{t("active")}</div>
                <div className="col col-7">{t("lastTransaction")}</div>
            </li>{form.result.data.map((v: any, index: number) =>
                <li className="table-row" key={id}>
                    <div className="col col-0" data-label="#">{index + 1}</div>
                    <div className="col col-1" data-label="Адрес123">{`${String(v.contract).substring(0, 6)}...${String(v.contract).substring(v.contract.length - 6)}`}</div>
                    <div className="col col-2" data-label="Баланс">{Number(v.balance).toFixed(5)} ETH</div>
                    <div className="col col-3" data-label="Транзакции">{v.nonce}</div>
                    <div className="col col-4" data-label="Объем через мост">{Number(v.bridgesVolume).toFixed(5)} ETH</div>
                    <div className="col col-5" data-label="Объем через мост + биржи">{Number(v.bridgesWithCexVolume).toFixed(5)} ETH</div>
                    <div className="col col-6" data-label="Активных дней / недель / месяцев">{v.txTimestamps}</div>
                    <div className="col col-7" data-label="Последняя транзакция">{v.lastTx}</div>
                </li>
            )}</ul>
            <CSVLink className="button-61" style={{ position: "fixed", bottom: "5px", right: "5px" }} data={form.resultCsv}>{t("export")}</CSVLink>
        </>
        }
    </>
};