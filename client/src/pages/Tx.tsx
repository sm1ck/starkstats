import { Watch } from "react-loader-spinner";
import { useFetch } from "../hooks/fetchHook";
import { VictoryAxis, VictoryChart, VictoryGroup, VictoryLine, VictoryPie, VictoryScatter, VictoryTooltip, VictoryZoomContainer } from "victory";
import { useTitle } from "../hooks/titleHook";
import { midColormap, sumPercent } from "../utils/common";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const Tx = () => {
    const { t, i18n } = useTranslation();
    let [loaded, fetchData] = useFetch("/api/tx");
    let [loadedAggregateTx, fetchDataAggregateTx] = useFetch("/api/aggregatetx");
    let [langAggregateTx, setLangAggregateTx] = useState(null as any);

    useTitle(t("title", { page: t("navTx") }));

    useEffect(() => {
        if (fetchDataAggregateTx?.data?.length > 0) {
            setLangAggregateTx({ data: fetchDataAggregateTx.data.map((v: any) => {
                let dateSplitted = v.label.split(" ");
                let date = dateSplitted.length === 3 ? new Date(dateSplitted[0], dateSplitted[1], dateSplitted[2]) : new Date(dateSplitted[0], dateSplitted[1], 1);
                let options: Intl.DateTimeFormatOptions = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                };
                let label = `${v.y}, ${new Intl.DateTimeFormat(i18n.language === "ru" ? "ru-RU" : "en-US", options).format(date)}`;
                options = {
                    year: "numeric",
                    month: "short",
                };
                let shortLabel = new Intl.DateTimeFormat(i18n.language === "ru" ? "ru-RU" : "en-US", options).format(date);
                return {
                    label,
                    shortLabel,
                    x: v.x,
                    y: v.y
                }
            })});
        }
    }, [fetchDataAggregateTx, i18n, setLangAggregateTx, i18n.language]);

    return !loaded || !loadedAggregateTx ? <Watch
        height="80"
        width="80"
        radius="48"
        color="#0c0c4f"
        ariaLabel="watch-loading"
        wrapperStyle={{}}
        visible={true}
    /> : fetchData.data === undefined ? <div>{fetchData.error}</div> :
    <>
        <div className="victoryPie">
            <h3 className="textCenter">{t("txTitle")}</h3>
            <div className="textCenter">{t("chartInstruction")}</div>
            <VictoryPie
                colorScale={midColormap}
                style={{ labels: { fontSize: 12 } }}
                labelComponent={
                    <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                }
                data={[
                    { label: `${t("fromTo", { start: 1, end: 5 })} (${fetchData.data.users_by_tx[1]}, ${sumPercent(fetchData.data.users_by_tx, 1)}%)`, x: fetchData.data.users_by_tx[1], y: fetchData.data.users_by_tx[1] },
                    { label: `${t("fromTo", { start: 6, end: 9 })} (${fetchData.data.users_by_tx[5]}, ${sumPercent(fetchData.data.users_by_tx, 5)}%)`, x: fetchData.data.users_by_tx[5], y: fetchData.data.users_by_tx[5] },
                    { label: `${t("fromTo", { start: 10, end: 19 })} (${fetchData.data.users_by_tx[10]}, ${sumPercent(fetchData.data.users_by_tx, 10)}%)`, x: fetchData.data.users_by_tx[10], y: fetchData.data.users_by_tx[10] },
                    { label: `${t("fromTo", { start: 20, end: 29 })} (${fetchData.data.users_by_tx[20]}, ${sumPercent(fetchData.data.users_by_tx, 20)}%)`, x: fetchData.data.users_by_tx[20], y: fetchData.data.users_by_tx[20] },
                    { label: `${t("fromTo", { start: 30, end: 49 })} (${fetchData.data.users_by_tx[30]}, ${sumPercent(fetchData.data.users_by_tx, 30)}%)`, x: fetchData.data.users_by_tx[30], y: fetchData.data.users_by_tx[30] },
                    { label: `50 ${t("more")} (${fetchData.data.users_by_tx[50]}, ${sumPercent(fetchData.data.users_by_tx, 50)}%)`, x: fetchData.data.users_by_tx[50], y: fetchData.data.users_by_tx[50] },
                ]}
            />
        </div>
        <div className="line-break"></div>
        <div className="victoryChart">
            <h3 className="textCenter">{t("txAggregateTitle")}</h3>
            <div className="textCenter">{t("chartInstruction")}</div>
            <div className="textCenter">{t("chartInstructionZoom")}</div>
            {langAggregateTx && <VictoryChart domainPadding={20} padding={60} containerComponent={<VictoryZoomContainer />}>
                <VictoryGroup
                    style={{ data: { stroke: "#0c0c4f", strokeWidth: 2 }, labels: { fontSize: 9 } }}
                    labelComponent={
                        <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                    }
                    data={langAggregateTx?.data}
                >
                    <VictoryLine />
                    <VictoryScatter size={2} />
                </VictoryGroup>
                <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
                <VictoryAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => Number.isInteger(x) && x <= langAggregateTx?.data?.length ? langAggregateTx?.data[x]?.shortLabel : null} />
            </VictoryChart>}
        </div>
    </>
};