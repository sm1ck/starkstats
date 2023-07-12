import { Watch } from "react-loader-spinner";
import { useFetch } from "../hooks/fetchHook";
import { VictoryPie, VictoryTooltip } from "victory";
import { useTitle } from "../hooks/titleHook";
import { sumPercent } from "../utils/common";

export const Tx = () => {
    let [loaded, fetchData] = useFetch("/api/tx");
    useTitle("Транзакции пользователей | Статистика по StarkNet");
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
            <h3 className="textCenter">Статистика по количеству транзакций пользователей</h3>
            <div className="textCenter">Наведите курсор на нужную часть графика</div>
            <VictoryPie
                colorScale={"warm"}
                style={{ labels: { fontSize: 12 } }}
                labelComponent={
                    <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                }
                data={[
                    { label: `От 1 до 5 (${fetchData.data.users_by_tx[1]}, ${sumPercent(fetchData.data.users_by_tx, 1)}%)`, x: fetchData.data.users_by_tx[1], y: fetchData.data.users_by_tx[1] },
                    { label: `От 6 до 9 (${fetchData.data.users_by_tx[5]}, ${sumPercent(fetchData.data.users_by_tx, 5)}%)`, x: fetchData.data.users_by_tx[5], y: fetchData.data.users_by_tx[5] },
                    { label: `От 10 до 19 (${fetchData.data.users_by_tx[10]}, ${sumPercent(fetchData.data.users_by_tx, 10)}%)`, x: fetchData.data.users_by_tx[10], y: fetchData.data.users_by_tx[10] },
                    { label: `От 20 до 29 (${fetchData.data.users_by_tx[20]}, ${sumPercent(fetchData.data.users_by_tx, 20)}%)`, x: fetchData.data.users_by_tx[20], y: fetchData.data.users_by_tx[20] },
                    { label: `От 30 и больше (${fetchData.data.users_by_tx[30]}, ${sumPercent(fetchData.data.users_by_tx, 30)}%)`, x: fetchData.data.users_by_tx[30], y: fetchData.data.users_by_tx[30] },
                ]}
            />
        </div>
};