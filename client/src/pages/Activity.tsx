import { useFetch } from "../hooks/fetchHook";
import { VictoryAxis, VictoryChart, VictoryScatter, VictoryTooltip } from "victory";
import { Watch } from "react-loader-spinner";
import { useTitle } from "../hooks/titleHook";
import { sumPercent } from "../utils/common";

export const Activity = () => {
    let [loaded, fetchData] = useFetch("/api/activity");
    useTitle("Активность пользователей | Статистика по StarkNet");
    return !loaded ? <Watch
        height="80"
        width="80"
        radius="48"
        color="#0c0c4f"
        ariaLabel="watch-loading"
        wrapperStyle={{}}
        visible={true}
    /> : fetchData.data === undefined ? <div>{fetchData.error}</div> :
        <div className="victoryChart">
            <h3 className="textCenter">Статистика уникальных дней по активности пользователей</h3>
            <div className="textCenter">Дни считаются не как календарные, а как разница в 24 часа</div>
            <div className="textCenter">Наведите курсор на нужную часть графика</div>
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
                        { label: `1 день (${fetchData.data.users_by_days[1]}, ${sumPercent(fetchData.data.users_by_days, 1)}%)`, x: fetchData.data.users_by_days[1], y: fetchData.data.users_by_days[1] },
                        { label: `2 дня (${fetchData.data.users_by_days[2]}, ${sumPercent(fetchData.data.users_by_days, 2)}%)`, x: fetchData.data.users_by_days[2], y: fetchData.data.users_by_days[2] },
                        { label: `3 дня (${fetchData.data.users_by_days[3]}, ${sumPercent(fetchData.data.users_by_days, 3)}%)`, x: fetchData.data.users_by_days[3], y: fetchData.data.users_by_days[3] },
                        { label: `4 дня (${fetchData.data.users_by_days[4]}, ${sumPercent(fetchData.data.users_by_days, 4)}%)`, x: fetchData.data.users_by_days[4], y: fetchData.data.users_by_days[4] },
                        { label: `5 дней (${fetchData.data.users_by_days[5]}, ${sumPercent(fetchData.data.users_by_days, 5)}%)`, x: fetchData.data.users_by_days[5], y: fetchData.data.users_by_days[5] },
                        { label: `6 - 10 дней (${fetchData.data.users_by_days[10]}, ${sumPercent(fetchData.data.users_by_days, 10)}%)`, x: fetchData.data.users_by_days[10], y: fetchData.data.users_by_days[10] },
                        { label: `11 - 20 дней (${fetchData.data.users_by_days[20]}, ${sumPercent(fetchData.data.users_by_days, 20)}%)`, x: fetchData.data.users_by_days[20], y: fetchData.data.users_by_days[20] },
                        { label: `21 - 30 дней (${fetchData.data.users_by_days[30]}, ${sumPercent(fetchData.data.users_by_days, 30)}%)`, x: fetchData.data.users_by_days[30], y: fetchData.data.users_by_days[30] },
                        { label: `30 и более дней (${fetchData.data.users_by_days["all"]}, ${sumPercent(fetchData.data.users_by_days, "all")}%)`, x: fetchData.data.users_by_days["all"], y: fetchData.data.users_by_days["all"] },
                    ]}
                />
                <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
                <VictoryAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
            </VictoryChart>
            <h3 className="textCenter">Статистика уникальных недель по активности пользователей</h3>
            <div className="textCenter">Недели считаются не как календарные, а как разница в 7 дней</div>
            <div className="textCenter">Наведите курсор на нужную часть графика</div>
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
                        { label: `1 неделя (${fetchData.data.users_by_weeks[1]}, ${sumPercent(fetchData.data.users_by_weeks, 1)}%)`, x: fetchData.data.users_by_weeks[1], y: fetchData.data.users_by_weeks[1] },
                        { label: `2 недели (${fetchData.data.users_by_weeks[2]}, ${sumPercent(fetchData.data.users_by_weeks, 2)}%)`, x: fetchData.data.users_by_weeks[2], y: fetchData.data.users_by_weeks[2] },
                        { label: `3 недели (${fetchData.data.users_by_weeks[3]}, ${sumPercent(fetchData.data.users_by_weeks, 3)}%)`, x: fetchData.data.users_by_weeks[3], y: fetchData.data.users_by_weeks[3] },
                        { label: `4 недели (${fetchData.data.users_by_weeks[4]}, ${sumPercent(fetchData.data.users_by_weeks, 4)}%)`, x: fetchData.data.users_by_weeks[4], y: fetchData.data.users_by_weeks[4] },
                        { label: `5 недель (${fetchData.data.users_by_weeks[5]}, ${sumPercent(fetchData.data.users_by_weeks, 5)}%)`, x: fetchData.data.users_by_weeks[5], y: fetchData.data.users_by_weeks[5] },
                        { label: `6 недель и более (${fetchData.data.users_by_weeks["all"]}, ${sumPercent(fetchData.data.users_by_weeks, "all")}%)`, x: fetchData.data.users_by_weeks["all"], y: fetchData.data.users_by_weeks["all"] },
                    ]}
                />
                <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
                <VictoryAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
            </VictoryChart>
            <h3 className="textCenter">Статистика уникальных месяцев по активности пользователей</h3>
            <div className="textCenter">Месяцы считаются не как календарные, а как разница в 30 дней</div>
            <div className="textCenter">Наведите курсор на нужную часть графика</div>
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
                        { label: `1 месяц (${fetchData.data.users_by_months[1]}, ${sumPercent(fetchData.data.users_by_months, 1)}%)`, x: fetchData.data.users_by_months[1], y: fetchData.data.users_by_months[1] },
                        { label: `2 месяца (${fetchData.data.users_by_months[2]}, ${sumPercent(fetchData.data.users_by_months, 2)}%)`, x: fetchData.data.users_by_months[2], y: fetchData.data.users_by_months[2] },
                        { label: `3 месяца (${fetchData.data.users_by_months[3]}, ${sumPercent(fetchData.data.users_by_months, 3)}%)`, x: fetchData.data.users_by_months[3], y: fetchData.data.users_by_months[3] },
                        { label: `4 месяца (${fetchData.data.users_by_months[4]}, ${sumPercent(fetchData.data.users_by_months, 4)}%)`, x: fetchData.data.users_by_months[4], y: fetchData.data.users_by_months[4] },
                        { label: `5 месяцев (${fetchData.data.users_by_months[5]}, ${sumPercent(fetchData.data.users_by_months, 5)}%)`, x: fetchData.data.users_by_months[5], y: fetchData.data.users_by_months[5] },
                        { label: `6 месяцев и более (${fetchData.data.users_by_months["all"]}, ${sumPercent(fetchData.data.users_by_months, "all")}%)`, x: fetchData.data.users_by_months["all"], y: fetchData.data.users_by_months["all"] },
                    ]}
                />
                <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
                <VictoryAxis style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }} tickFormat={(x) => (`${x}`)} />
            </VictoryChart>
        </div>
};