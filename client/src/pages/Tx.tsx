import { Watch } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import useTitle from "../hooks/useTitle";
import useLangFetch from "../hooks/useLangFetch";
import Pie from "../components/Pie";
import LineChart from "../components/LineChart";
import { midColormap, sumPercent } from "../utils/common";

const Tx = () => {
  const { t } = useTranslation();
  const [loaded, fetchData] = useFetch("/api/tx");
  const [loadedAggregateTx, langAggregateTx] = useLangFetch("/api/aggregatetx");
  const [loadedAggregateTps, langAggregateTps] = useLangFetch(
    "/api/aggregatetps",
    true
  );

  useTitle(t("title", { page: t("navTx") }));

  return !loaded || !loadedAggregateTx || !loadedAggregateTps ? (
    <Watch
      height="80"
      width="80"
      radius="48"
      color="#0c0c4f"
      ariaLabel="watch-loading"
      wrapperStyle={{}}
      visible={true}
    />
  ) : fetchData.data === undefined ? (
    <div>{fetchData.error}</div>
  ) : (
    <>
      <Pie
        colorScale={midColormap}
        titleTranslate={"txTitle"}
        data={[
          {
            label: `${t("fromTo", { start: 1, end: 5 })} (${
              fetchData.data.users_by_tx[1]
            }, ${sumPercent(fetchData.data.users_by_tx, 1)}%)`,
            x: fetchData.data.users_by_tx[1],
            y: fetchData.data.users_by_tx[1],
          },
          {
            label: `${t("fromTo", { start: 6, end: 9 })} (${
              fetchData.data.users_by_tx[5]
            }, ${sumPercent(fetchData.data.users_by_tx, 5)}%)`,
            x: fetchData.data.users_by_tx[5],
            y: fetchData.data.users_by_tx[5],
          },
          {
            label: `${t("fromTo", { start: 10, end: 19 })} (${
              fetchData.data.users_by_tx[10]
            }, ${sumPercent(fetchData.data.users_by_tx, 10)}%)`,
            x: fetchData.data.users_by_tx[10],
            y: fetchData.data.users_by_tx[10],
          },
          {
            label: `${t("fromTo", { start: 20, end: 29 })} (${
              fetchData.data.users_by_tx[20]
            }, ${sumPercent(fetchData.data.users_by_tx, 20)}%)`,
            x: fetchData.data.users_by_tx[20],
            y: fetchData.data.users_by_tx[20],
          },
          {
            label: `${t("fromTo", { start: 30, end: 49 })} (${
              fetchData.data.users_by_tx[30]
            }, ${sumPercent(fetchData.data.users_by_tx, 30)}%)`,
            x: fetchData.data.users_by_tx[30],
            y: fetchData.data.users_by_tx[30],
          },
          {
            label: `50 ${t("more")} (${
              fetchData.data.users_by_tx[50]
            }, ${sumPercent(fetchData.data.users_by_tx, 50)}%)`,
            x: fetchData.data.users_by_tx[50],
            y: fetchData.data.users_by_tx[50],
          },
        ]}
      />
      <div className="line-break"></div>
      <LineChart
        titleTranslate={"txAggregateTitle"}
        data={langAggregateTx?.data}
      />
      <div className="line-break"></div>
      <LineChart
        titleTranslate={"tpsAggregateTitle"}
        data={langAggregateTps?.data}
      />
    </>
  );
};

export default Tx;
