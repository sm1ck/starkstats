import { Watch } from "react-loader-spinner";
import { useFetch } from "../hooks/fetchHook";
import { VictoryPie, VictoryTooltip } from "victory";
import { useTitle } from "../hooks/titleHook";
import { largeColorMap, sumPercentWithTotal } from "../utils/common";
import { useTranslation } from "react-i18next";

export const InternalVolume = () => {
    const { t } = useTranslation();
    let [loaded, fetchData] = useFetch("/api/internalvolume");

    useTitle(t("title", { page: t("navInternalVolume") }));

    return !loaded ? <Watch
        height="80"
        width="80"
        radius="48"
        color="#0c0c4f"
        ariaLabel="watch-loading"
        wrapperStyle={{}}
        visible={true}
    /> : fetchData.data === undefined ? <div>{fetchData.error}</div> :
        <> <div className="victoryPie">
            <h3 className="textCenter">{t("internalVolumeTitle")}</h3>
            <div className="textCenter">{t("chartInstruction")}</div>
            <VictoryPie
                colorScale={largeColorMap}
                style={{ labels: { fontSize: 12 } }}
                labelComponent={
                    <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                }
                data={[
                    { label: `${t("less")} 50$ (${fetchData.data.internal50}, ${sumPercentWithTotal(fetchData.data.internal50, fetchData.data.internal50 + fetchData.data.internal500 + fetchData.data.internal1000 + fetchData.data.internal5000 + fetchData.data.internal10000 + fetchData.data.internal50000 + fetchData.data.internalMore)}%)`, x: fetchData.data.internal50, y: fetchData.data.internal50 },
                    { label: `50$ - 500$ (${fetchData.data.internal500}, ${sumPercentWithTotal(fetchData.data.internal50, fetchData.data.internal50 + fetchData.data.internal500 + fetchData.data.internal1000 + fetchData.data.internal5000 + fetchData.data.internal10000 + fetchData.data.internal50000 + fetchData.data.internalMore)}%)`, x: fetchData.data.internal500, y: fetchData.data.internal500 },
                    { label: `500$ - 1000$ (${fetchData.data.internal1000}, ${sumPercentWithTotal(fetchData.data.internal50, fetchData.data.internal50 + fetchData.data.internal500 + fetchData.data.internal1000 + fetchData.data.internal5000 + fetchData.data.internal10000 + fetchData.data.internal50000 + fetchData.data.internalMore)}%)`, x: fetchData.data.internal1000, y: fetchData.data.internal1000 },
                    { label: `1000$ - 5000$ (${fetchData.data.internal5000}, ${sumPercentWithTotal(fetchData.data.internal50, fetchData.data.internal50 + fetchData.data.internal500 + fetchData.data.internal1000 + fetchData.data.internal5000 + fetchData.data.internal10000 + fetchData.data.internal50000 + fetchData.data.internalMore)}%)`, x: fetchData.data.internal5000, y: fetchData.data.internal5000 },
                    { label: `5000$ - 10000$ (${fetchData.data.internal10000}, ${sumPercentWithTotal(fetchData.data.internal50, fetchData.data.internal50 + fetchData.data.internal500 + fetchData.data.internal1000 + fetchData.data.internal5000 + fetchData.data.internal10000 + fetchData.data.internal50000 + fetchData.data.internalMore)}%)`, x: fetchData.data.internal10000, y: fetchData.data.internal10000 },
                    { label: `10000$ - 50000$ (${fetchData.data.internal50000}, ${sumPercentWithTotal(fetchData.data.internal50, fetchData.data.internal50 + fetchData.data.internal500 + fetchData.data.internal1000 + fetchData.data.internal5000 + fetchData.data.internal10000 + fetchData.data.internal50000 + fetchData.data.internalMore)}%)`, x: fetchData.data.internal50000, y: fetchData.data.internal50000 },
                    { label: `50000$ ${t("more")} (${fetchData.data.internalMore}, ${sumPercentWithTotal(fetchData.data.internal50, fetchData.data.internal50 + fetchData.data.internal500 + fetchData.data.internal1000 + fetchData.data.internal5000 + fetchData.data.internal10000 + fetchData.data.internal50000 + fetchData.data.internalMore)}%)`, x: fetchData.data.internalMore, y: fetchData.data.internalMore },
                ]}
            /></div>
        </>
};