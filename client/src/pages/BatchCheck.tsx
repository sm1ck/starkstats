import { Watch } from "react-loader-spinner";
import { useForm } from "../hooks/formHook";
import { useTitle } from "../hooks/titleHook";
import { useId } from "react";
import { CSVLink } from "react-csv";

export const BatchCheck = () => {
    useTitle("Проверить свои адреса | Статистика по StarkNet");
    let form = useForm();
    let id = useId();
    return <>
        <h3 className="textCenter">Получите статистику по своим адресам</h3>
        <div className="line-break"></div>
        <div className="textCenter">Дни, недели и месяцы считаются не как календарные, а как 24 часа, 7 дней и 30 дней</div>
        <div className="line-break"></div>
        <textarea ref={form.ref} rows={20} spellCheck={false} style={{ width: "60%", fontSize: "1rem" }} />
        <div className="line-break"></div>
        <button className="button-61" onClick={() => form.sendForm()}>Отправить</button>
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
                <div className="col col-1">Адрес</div>
                <div className="col col-2">Баланс</div>
                <div className="col col-3">Транзакции</div>
                <div className="col col-4">Объем через мост</div>
                <div className="col col-5">Объем через мост + биржи</div>
                <div className="col col-6">Активных дней / недель / месяцев</div>
                <div className="col col-7">Последняя транзакция</div>
            </li>{form.result.data.map((v: any, index: number) =>
                <li className="table-row" key={id}>
                    <div className="col col-0" data-label="#">{index + 1}</div>
                    <div className="col col-1" data-label="Адрес">{`${String(v.contract).substring(0, 6)}...${String(v.contract).substring(v.contract.length - 6)}`}</div>
                    <div className="col col-2" data-label="Баланс">{Number(v.balance).toFixed(5)} ETH</div>
                    <div className="col col-3" data-label="Транзакции">{v.nonce}</div>
                    <div className="col col-4" data-label="Объем через мост">{Number(v.bridgesVolume).toFixed(5)} ETH</div>
                    <div className="col col-5" data-label="Объем через мост + биржи">{Number(v.bridgesWithCexVolume).toFixed(5)} ETH</div>
                    <div className="col col-6" data-label="Активных дней / недель / месяцев">{v.txTimestamps}</div>
                    <div className="col col-7" data-label="Последняя транзакция">{v.lastTx}</div>
                </li>
            )}</ul>
            <CSVLink className="button-61" style={{ position: "fixed", bottom: "5px", right: "5px" }} data={form.resultCsv}>Скачать .csv</CSVLink>
        </>
        }
    </>
};