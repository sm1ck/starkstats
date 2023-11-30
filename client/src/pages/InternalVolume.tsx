import { Watch } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import useTitle from "../hooks/useTitle";
import Pie from "../components/Pie";
import {
  largeColorMap,
  sumPercentAllEntries,
  sumPercentWithTotal,
} from "../utils/common";

const InternalVolume = () => {
  const { t } = useTranslation();
  const [loaded, fetchData] = useFetch("/api/internalvolume");

  useTitle(t("title", { page: t("navInternalVolume") }));

  return !loaded ? (
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
    <Pie
      colorScale={largeColorMap}
      titleTranslate={"internalVolumeTitle"}
      data={[
        {
          label: `${t("less")} 50$ (${
            fetchData.data.internal50
          }, ${sumPercentWithTotal(
            fetchData.data.internal50,
            sumPercentAllEntries(fetchData.data)
          )}%)`,
          x: fetchData.data.internal50,
          y: fetchData.data.internal50,
        },
        {
          label: `50$ - 500$ (${
            fetchData.data.internal500
          }, ${sumPercentWithTotal(
            fetchData.data.internal500,
            sumPercentAllEntries(fetchData.data)
          )}%)`,
          x: fetchData.data.internal500,
          y: fetchData.data.internal500,
        },
        {
          label: `500$ - 1000$ (${
            fetchData.data.internal1000
          }, ${sumPercentWithTotal(
            fetchData.data.internal1000,
            sumPercentAllEntries(fetchData.data)
          )}%)`,
          x: fetchData.data.internal1000,
          y: fetchData.data.internal1000,
        },
        {
          label: `1000$ - 5000$ (${
            fetchData.data.internal5000
          }, ${sumPercentWithTotal(
            fetchData.data.internal5000,
            sumPercentAllEntries(fetchData.data)
          )}%)`,
          x: fetchData.data.internal5000,
          y: fetchData.data.internal5000,
        },
        {
          label: `5000$ - 10000$ (${
            fetchData.data.internal10000
          }, ${sumPercentWithTotal(
            fetchData.data.internal10000,
            sumPercentAllEntries(fetchData.data)
          )}%)`,
          x: fetchData.data.internal10000,
          y: fetchData.data.internal10000,
        },
        {
          label: `10000$ - 50000$ (${
            fetchData.data.internal50000
          }, ${sumPercentWithTotal(
            fetchData.data.internal50000,
            sumPercentAllEntries(fetchData.data)
          )}%)`,
          x: fetchData.data.internal50000,
          y: fetchData.data.internal50000,
        },
        {
          label: `50000$ ${t("more")} (${
            fetchData.data.internalMore
          }, ${sumPercentWithTotal(
            fetchData.data.internalMore,
            sumPercentAllEntries(fetchData.data)
          )}%)`,
          x: fetchData.data.internalMore,
          y: fetchData.data.internalMore,
        },
      ]}
    />
  );
};

export default InternalVolume;
