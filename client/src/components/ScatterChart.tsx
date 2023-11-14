import { useTranslation } from "react-i18next";
import {
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
  VictoryTooltip,
} from "victory";

const ScatterChart = ({
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
      <VictoryChart
        domainPadding={20}
        padding={{ left: 60, right: 60, top: 40, bottom: 40 }}
      >
        <VictoryScatter
          style={{
            data: { fill: "#c43a31", stroke: "black", strokeWidth: 1 },
            labels: { fontSize: 9 },
          }}
          labelComponent={<VictoryTooltip dy={0} centerOffset={{ x: 25 }} />}
          bubbleProperty="x"
          maxBubbleSize={15}
          minBubbleSize={5}
          data={data}
        />
        <VictoryAxis
          dependentAxis
          style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }}
          tickFormat={(x) => `${x}`}
        />
        <VictoryAxis
          style={{ tickLabels: { fontSize: 9 }, axisLabel: { fontSize: 9 } }}
          tickFormat={(x) => `${x}`}
        />
      </VictoryChart>
    </div>
  );
};

export default ScatterChart;
