import { Watch } from "react-loader-spinner";
import useFetch from "../hooks/useFetch";
import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryPie,
  VictoryScatter,
  VictoryTooltip,
  VictoryZoomContainer,
} from "victory";
import useTitle from "../hooks/useTitle";
import { midColormap, sumPercent } from "../utils/common";
import { useTranslation } from "react-i18next";
import useLangFetch from "../hooks/useLangFetch";

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
      <div className="victoryPie">
        <h3 className="textCenter">{t("txTitle")}</h3>
        <div className="textCenter">{t("chartInstruction")}</div>
        <VictoryPie
          colorScale={midColormap}
          style={{ labels: { fontSize: 12 } }}
          labelComponent={<VictoryTooltip dy={0} centerOffset={{ x: 25 }} />}
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
      </div>
      <div className="line-break"></div>
      <div className="victoryChart">
        <h3 className="textCenter">{t("txAggregateTitle")}</h3>
        <div className="textCenter">{t("chartInstruction")}</div>
        <div className="textCenter">{t("chartInstructionZoom")}</div>
        {langAggregateTx && (
          <VictoryChart
            domainPadding={20}
            padding={40}
            containerComponent={<VictoryZoomContainer />}
          >
            <VictoryGroup
              style={{
                data: { fill: "#0c0c4f", stroke: "#0c0c4f", strokeWidth: 2 },
                labels: { fontSize: 9 },
              }}
              labelComponent={
                <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
              }
              data={langAggregateTx?.data}
            >
              <VictoryLine interpolation={"natural"} />
              <VictoryScatter size={2} />
            </VictoryGroup>
            <VictoryAxis
              dependentAxis
              style={{
                tickLabels: { fontSize: 9 },
                axisLabel: { fontSize: 9 },
              }}
              tickFormat={(x) => `${x}`}
            />
            <VictoryAxis
              style={{
                tickLabels: { fontSize: 9 },
                axisLabel: { fontSize: 9 },
              }}
              tickFormat={(x) =>
                Number.isInteger(x) && x <= langAggregateTx?.data?.length
                  ? langAggregateTx?.data[x]?.shortLabel
                  : null
              }
            />
          </VictoryChart>
        )}
      </div>
      <div className="line-break"></div>
      <div className="victoryChart">
        <h3 className="textCenter">{t("tpsAggregateTitle")}</h3>
        <div className="textCenter">{t("chartInstruction")}</div>
        <div className="textCenter">{t("chartInstructionZoom")}</div>
        {langAggregateTps && (
          <VictoryChart
            domainPadding={20}
            padding={40}
            containerComponent={<VictoryZoomContainer />}
          >
            <VictoryGroup
              style={{
                data: { fill: "#0c0c4f", stroke: "#0c0c4f", strokeWidth: 2 },
                labels: { fontSize: 9 },
              }}
              labelComponent={
                <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
              }
              data={langAggregateTps?.data}
            >
              <VictoryLine interpolation={"natural"} />
              <VictoryScatter size={2} />
            </VictoryGroup>
            <VictoryAxis
              dependentAxis
              style={{
                tickLabels: { fontSize: 9 },
                axisLabel: { fontSize: 9 },
              }}
              tickFormat={(x) => `${x}`}
            />
            <VictoryAxis
              style={{
                tickLabels: { fontSize: 9 },
                axisLabel: { fontSize: 9 },
              }}
              tickFormat={(x) =>
                Number.isInteger(x) && x <= langAggregateTps?.data?.length
                  ? langAggregateTps?.data[x]?.shortLabel
                  : null
              }
            />
          </VictoryChart>
        )}
      </div>
    </>
  );
};

export default Tx;
