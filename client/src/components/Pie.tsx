import { useTranslation } from "react-i18next";
import { ColorScalePropType, VictoryPie, VictoryTooltip } from "victory";

const Pie = ({
  data,
  colorScale,
  titleTranslate,
}: {
  data: any[];
  colorScale: ColorScalePropType;
  titleTranslate: string;
}) => {
  const { t } = useTranslation();

  return (
    <div className="victoryPie">
      <h3 className="textCenter">{t(titleTranslate)}</h3>
      <div className="textCenter">{t("chartInstruction")}</div>
      <VictoryPie
        colorScale={colorScale}
        style={{ labels: { fontSize: 12 } }}
        padding={{ top: 40, bottom: 40 }}
        labelComponent={<VictoryTooltip dy={0} centerOffset={{ x: 25 }} />}
        data={data}
      />
    </div>
  );
};

export default Pie;
