import { Watch } from "react-loader-spinner";
import { useFetch } from "../hooks/fetchHook";
import { VictoryPie, VictoryTooltip } from "victory";
import { useTitle } from "../hooks/titleHook";
import { smallColormap, sumPercent } from "../utils/common";
import { useTranslation } from "react-i18next";

export const Tx = () => {
    const { t } = useTranslation();
    let [loaded, fetchData] = useFetch("/api/tx");

    useTitle(t("title", { page: t("navTx") }));

    return !loaded ? <Watch
        height="80"
        width="80"
        radius="48"
        color="#0c0c4f"
        ariaLabel="watch-loading"
        wrapperStyle={{}}
        visible={true}
    /> : fetchData.data === undefined ? <div>{fetchData.error}</div> :
        <div className="victoryPie">
            <h3 className="textCenter">{t("txTitle")}</h3>
            <div className="textCenter">{t("chartInstruction")}</div>
            <VictoryPie
                colorScale={smallColormap}
                style={{ labels: { fontSize: 12 } }}
                labelComponent={
                    <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                }
                data={[
                    { label: `${t("fromTo", { start: 1, end: 5 })} (${fetchData.data.users_by_tx[1]}, ${sumPercent(fetchData.data.users_by_tx, 1)}%)`, x: fetchData.data.users_by_tx[1], y: fetchData.data.users_by_tx[1] },
                    { label: `${t("fromTo", { start: 6, end: 9 })} (${fetchData.data.users_by_tx[5]}, ${sumPercent(fetchData.data.users_by_tx, 5)}%)`, x: fetchData.data.users_by_tx[5], y: fetchData.data.users_by_tx[5] },
                    { label: `${t("fromTo", { start: 10, end: 19 })} (${fetchData.data.users_by_tx[10]}, ${sumPercent(fetchData.data.users_by_tx, 10)}%)`, x: fetchData.data.users_by_tx[10], y: fetchData.data.users_by_tx[10] },
                    { label: `${t("fromTo", { start: 20, end: 29 })} (${fetchData.data.users_by_tx[20]}, ${sumPercent(fetchData.data.users_by_tx, 20)}%)`, x: fetchData.data.users_by_tx[20], y: fetchData.data.users_by_tx[20] },
                    { label: `30 ${t("more")} (${fetchData.data.users_by_tx[30]}, ${sumPercent(fetchData.data.users_by_tx, 30)}%)`, x: fetchData.data.users_by_tx[30], y: fetchData.data.users_by_tx[30] },
                ]}
            />
        </div>
};