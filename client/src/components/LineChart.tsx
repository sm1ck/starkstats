import { useTranslation } from "react-i18next";
import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryZoomContainer,
} from "victory";

const LineChart = ({
  data,
  titleTranslate,
}: {
  data: any[];
  titleTranslate: string;
}) => {
  const { t } = useTranslation();

  return (
    <div className="victoryChart">
      <h3 className="textCenter">{t(titleTranslate)}</h3>
      <div className="textCenter">{t("chartInstruction")}</div>
      <div className="textCenter">{t("chartInstructionZoom")}</div>
      <VictoryChart
        domainPadding={20}
        padding={{ left: 60, right: 60, top: 40, bottom: 40 }}
        containerComponent={<VictoryZoomContainer />}
      >
        <VictoryGroup
          style={{
            data: { fill: "#0c0c4f", stroke: "#0c0c4f", strokeWidth: 2 },
            labels: { fontSize: 9 },
          }}
          labelComponent={<VictoryTooltip dy={0} centerOffset={{ x: 25 }} />}
          data={data}
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
            Number.isInteger(x) && x <= data?.length
              ? data[x]?.shortLabel
              : null
          }
        />
      </VictoryChart>
    </div>
  );
};

export default LineChart;
