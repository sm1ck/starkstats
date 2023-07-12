import { Watch } from "react-loader-spinner";
import { useFetch } from "../hooks/fetchHook";
import { useTitle } from "../hooks/titleHook";

export const Index: () => JSX.Element = () => {
    let [loaded, fetchData] = useFetch("/api/total");
    useTitle("Главная | Статистика по StarkNet");
    return !loaded ? <Watch
        height="80"
        width="80"
        radius="48"
        color="#0c0c4f"
        ariaLabel="watch-loading"
        wrapperStyle={{}}
        visible={true}
    /> : fetchData.data === undefined ? <div>{fetchData.error}</div> : <div style={{ textAlign: "center", fontSize: "1rem" }}>
        <h3>Всего адресов</h3>
        <h3 style={{ color: "var(--color-bg)" }}>{fetchData.data.totalWallets}</h3>
        <h3>Всего адресов без учета устаревших кошельков</h3>
        <h3 style={{ color: "var(--color-bg)" }}>{fetchData.data.totalWalletsFiltered}</h3>
        <div style={{ textAlign: "left" }}>Данные кошельки можно было создать бесплатно в старой версии StarkNet.<br />
            Эти кошельки с нулевым балансом и одной транзакцией исключены из расчета во всех графиках.</div>
        <h3>Описание</h3>
        <div style={{ textAlign: "left" }}>Статистика по StarkNet в виде графиков. Новые адреса добавляются каждые 30 минут.<br />
            Данные берутся со <a href="https://starkscan.co" target="_blank" rel="noreferrer">starkscan.co</a>, обновление старой базы данных долгий процесс и происходит раз в 6 часов.</div>
        <h3>Ссылки</h3>
        Github: <a href="https://github.com/sm1ck/starkstats" target="_blank" rel="noreferrer">github.com/sm1ck/starkstats</a><br />
        Автор: <a href="https://t.me/web3_coding" target="_blank" rel="noreferrer">t.me/web3_coding</a>
    </div>;
};