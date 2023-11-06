import { useFetch } from "../hooks/fetchHook";
import { VictoryAxis, VictoryChart, VictoryGroup, VictoryLine, VictoryScatter, VictoryTooltip, VictoryZoomContainer } from "victory";
import { Watch } from "react-loader-spinner";
import { useTitle } from "../hooks/titleHook";
import { sumPercent } from "../utils/common";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const Activity = () => {
    const { t, i18n } = useTranslation();
    let [loaded, fetchData] = useFetch("/api/activity");
    let [loadedAggregateUsers, fetchDataAggregateUsers] = useFetch("/api/aggregateusers");
    let [langAggregateUsers, setLangAggregateUsers] = useState(null as any);

    useTitle(t("title", { page: t("navActivityShort") }));

    useEffect(() => {
        if (fetchDataAggregateUsers?.data?.length > 0) {
            setLangAggregateUsers({ data: fetchDataAggregateUsers.data.map((v: any) => {
                let dateSplitted = v.label.split(" ");
                let date = dateSplitted.length === 3 ? new Date(dateSplitted[0], dateSplitted[1], dateSplitted[2]) : new Date(dateSplitted[0], dateSplitted[1], 1);
                let options: Intl.DateTimeFormatOptions = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                };
                let label = `${v.y}, ${new Intl.DateTimeFormat(i18n.language === "ru" ? "ru-RU" : "en-US", options).format(date)}`;
                return {
                    label,
                    x: v.x,
                    y: v.y
                }
            })});
        }
    }, [fetchDataAggregateUsers, i18n, setLangAggregateUsers, i18n.language]);

    return !loaded || !loadedAggregateUsers ? <Watch
        height="80"
        width="80"
        radius="48"
        color="#0c0c4f"
        ariaLabel="watch-loading"
        wrapperStyle={{}}
        visible={true}
    /> : fetchData.data === undefined ? <div>{fetchData.error}</div> :
        <div className="victoryChart">
            <h3 className="textCenter">{t("txActivityDay")}</h3>
            <div className="textCenter">{t("chartInstruction")}</div>
            <VictoryChart domainPadding={20} padding={60}>
                <VictoryScatter
                    style={{ data: { fill: "#c43a31", stroke: "black", strokeWidth: 1 }, labels: { fontSize: 9 } }}
                    labelComponent={
                        <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                    }
                    bubbleProperty="x"
                    maxBubbleSize={15}
                    minBubbleSize={5}
                    data={[
                        { label: `1 ${t("day")} (${fetchData.data.users_by_days[1]}, ${sumPercent(fetchData.data.users_by_days, 1)}%)`, x: fetchData.data.users_by_days[1], y: fetchData.data.users_by_days[1] },
                        { label: `2 ${t("days")} (${fetchData.data.users_by_days[2]}, ${sumPercent(fetchData.data.users_by_days, 2)}%)`, x: fetchData.data.users_by_days[2], y: fetchData.data.users_by_days[2] },
                        { label: `3 ${t("days")} (${fetchData.data.users_by_days[3]}, ${sumPercent(fetchData.data.users_by_days, 3)}%)`, x: fetchData.data.users_by_days[3], y: fetchData.data.users_by_days[3] },
                        { label: `4 ${t("days")} (${fetchData.data.users_by_days[4]}, ${sumPercent(fetchData.data.users_by_days, 4)}%)`, x: fetchData.data.users_by_days[4], y: fetchData.data.users_by_days[4] },
                        { label: `5 ${t("days2")} (${fetchData.data.users_by_days[5]}, ${sumPercent(fetchData.data.users_by_days, 5)}%)`, x: fetchData.data.users_by_days[5], y: fetchData.data.users_by_days[5] },
                        { label: `6 - 10 ${t("days2")} (${fetchData.data.users_by_days[10]}, ${sumPercent(fetchData.data.users_by_days, 10)}%)`, x: fetchData.data.users_by_days[10], y: fetchData.data.users_by_days[10] },
                        { label: `11 - 20 ${t("days2")} (${fetchData.data.users_by_days[20]}, ${sumPercent(fetchData.data.users_by_days, 20)}%)`, x: fetchData.data.users_by_days[20], y: fetchData.data.users_by_days[20] },
                        { label: `21 - 30 ${t("days2")} (${fetchData.data.users_by_days[30]}, ${sumPercent(fetchData.data.users_by_days, 30)}%)`, x: fetchData.data.users_by_days[30], y: fetchData.data.users_by_days[30] },
                        { label: `30 ${t("more")} ${t("days2")} (${fetchData.data.users_by_days["all"]}, ${sumPercent(fetchData.data.users_by_days, "all")}%)`, x: fetchData.data.users_by_days["all"], y: fetchData.data.users_by_days["all"] },
                    ]}
                />
                <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
                <VictoryAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
            </VictoryChart>
            <h3 className="textCenter">{t("txActivityWeek")}</h3>
            <div className="textCenter">{t("chartInstruction")}</div>
            <VictoryChart domainPadding={20} padding={60}>
                <VictoryScatter
                    style={{ data: { fill: "#c43a31", stroke: "black", strokeWidth: 1 }, labels: { fontSize: 9 } }}
                    labelComponent={
                        <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                    }
                    bubbleProperty="x"
                    maxBubbleSize={15}
                    minBubbleSize={5}
                    data={[
                        { label: `1 ${t("week")} (${fetchData.data.users_by_weeks[1]}, ${sumPercent(fetchData.data.users_by_weeks, 1)}%)`, x: fetchData.data.users_by_weeks[1], y: fetchData.data.users_by_weeks[1] },
                        { label: `2 ${t("weeks")} (${fetchData.data.users_by_weeks[2]}, ${sumPercent(fetchData.data.users_by_weeks, 2)}%)`, x: fetchData.data.users_by_weeks[2], y: fetchData.data.users_by_weeks[2] },
                        { label: `3 ${t("weeks")} (${fetchData.data.users_by_weeks[3]}, ${sumPercent(fetchData.data.users_by_weeks, 3)}%)`, x: fetchData.data.users_by_weeks[3], y: fetchData.data.users_by_weeks[3] },
                        { label: `4 ${t("weeks")} (${fetchData.data.users_by_weeks[4]}, ${sumPercent(fetchData.data.users_by_weeks, 4)}%)`, x: fetchData.data.users_by_weeks[4], y: fetchData.data.users_by_weeks[4] },
                        { label: `5 ${t("weeks2")} (${fetchData.data.users_by_weeks[5]}, ${sumPercent(fetchData.data.users_by_weeks, 5)}%)`, x: fetchData.data.users_by_weeks[5], y: fetchData.data.users_by_weeks[5] },
                        { label: `6 ${t("more")} ${t("weeks2")} (${fetchData.data.users_by_weeks["all"]}, ${sumPercent(fetchData.data.users_by_weeks, "all")}%)`, x: fetchData.data.users_by_weeks["all"], y: fetchData.data.users_by_weeks["all"] },
                    ]}
                />
                <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
                <VictoryAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
            </VictoryChart>
            <h3 className="textCenter">{t("txActivityMonth")}</h3>
            <div className="textCenter">{t("chartInstruction")}</div>
            <VictoryChart domainPadding={20} padding={60}>
                <VictoryScatter
                    style={{ data: { fill: "#c43a31", stroke: "black", strokeWidth: 1 }, labels: { fontSize: 9 } }}
                    labelComponent={
                        <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                    }
                    bubbleProperty="x"
                    maxBubbleSize={15}
                    minBubbleSize={5}
                    data={[
                        { label: `1 ${t("month")} (${fetchData.data.users_by_months[1]}, ${sumPercent(fetchData.data.users_by_months, 1)}%)`, x: fetchData.data.users_by_months[1], y: fetchData.data.users_by_months[1] },
                        { label: `2 ${t("months")} (${fetchData.data.users_by_months[2]}, ${sumPercent(fetchData.data.users_by_months, 2)}%)`, x: fetchData.data.users_by_months[2], y: fetchData.data.users_by_months[2] },
                        { label: `3 ${t("months")} (${fetchData.data.users_by_months[3]}, ${sumPercent(fetchData.data.users_by_months, 3)}%)`, x: fetchData.data.users_by_months[3], y: fetchData.data.users_by_months[3] },
                        { label: `4 ${t("months")} (${fetchData.data.users_by_months[4]}, ${sumPercent(fetchData.data.users_by_months, 4)}%)`, x: fetchData.data.users_by_months[4], y: fetchData.data.users_by_months[4] },
                        { label: `5 ${t("months2")} (${fetchData.data.users_by_months[5]}, ${sumPercent(fetchData.data.users_by_months, 5)}%)`, x: fetchData.data.users_by_months[5], y: fetchData.data.users_by_months[5] },
                        { label: `6 ${t("more")} ${t("months2")} (${fetchData.data.users_by_months["all"]}, ${sumPercent(fetchData.data.users_by_months, "all")}%)`, x: fetchData.data.users_by_months["all"], y: fetchData.data.users_by_months["all"] },
                    ]}
                />
                <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
                <VictoryAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
            </VictoryChart>
            <h3 className="textCenter">{t("usersAggregateTitle")}</h3>
            <div className="textCenter">{t("chartInstruction")}</div>
            <div className="textCenter">{t("chartInstructionZoom")}</div>
            {langAggregateUsers && <VictoryChart domainPadding={20} padding={60} containerComponent={<VictoryZoomContainer />}>
                <VictoryGroup
                    style={{ data: { stroke: "#0c0c4f", strokeWidth: 2 }, labels: { fontSize: 9 } }}
                    labelComponent={
                        <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                    }
                    data={langAggregateUsers.data}
                >
                    <VictoryLine />
                    <VictoryScatter size={2} />
                </VictoryGroup>
                <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
                <VictoryAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
            </VictoryChart>}
        </div>
};