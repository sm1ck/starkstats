import { Watch } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import useTitle from "../hooks/useTitle";
import Pie from "../components/Pie";
import {
  smallColormap,
  sumPercentAllEntries,
  sumPercentWithTotal,
} from "../utils/common";

const Volume = () => {
  const { t } = useTranslation();
  const [loaded, fetchData] = useFetch("/api/volume");

  useTitle(t("title", { page: t("navVolume") }));

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
    <>
      <Pie
        colorScale={smallColormap}
        titleTranslate={"volumeTitle"}
        data={[
          {
            label: `${t("less")} 0.01 ETH (${
              fetchData.data.bridgesVolume.lessThan5of1000
            }, ${sumPercentWithTotal(
              fetchData.data.bridgesVolume.lessThan5of1000,
              sumPercentAllEntries(fetchData.data.bridgesVolume)
            )}%)`,
            x: fetchData.data.bridgesVolume.lessThan5of1000,
            y: fetchData.data.bridgesVolume.lessThan5of1000,
          },
          {
            label: `0.01 ETH - 0.05 ETH (${
              fetchData.data.bridgesVolume.lessThan1of100
            }, ${sumPercentWithTotal(
              fetchData.data.bridgesVolume.lessThan1of100,
              sumPercentAllEntries(fetchData.data.bridgesVolume)
            )}%)`,
            x: fetchData.data.bridgesVolume.lessThan1of100,
            y: fetchData.data.bridgesVolume.lessThan1of100,
          },
          {
            label: `0.05 ETH - 0.1 ETH (${
              fetchData.data.bridgesVolume.lessThan1of10
            }, ${sumPercentWithTotal(
              fetchData.data.bridgesVolume.lessThan1of10,
              sumPercentAllEntries(fetchData.data.bridgesVolume)
            )}%)`,
            x: fetchData.data.bridgesVolume.lessThan1of10,
            y: fetchData.data.bridgesVolume.lessThan1of10,
          },
          {
            label: `0.1 ETH - 0.5 ETH (${
              fetchData.data.bridgesVolume.lessThan1of2
            }, ${sumPercentWithTotal(
              fetchData.data.bridgesVolume.lessThan1of2,
              sumPercentAllEntries(fetchData.data.bridgesVolume)
            )}%)`,
            x: fetchData.data.bridgesVolume.lessThan1of2,
            y: fetchData.data.bridgesVolume.lessThan1of2,
          },
          {
            label: `0.5 ETH - 1 ETH ${t("more")} (${
              fetchData.data.bridgesVolume.lessThan1
            }, ${sumPercentWithTotal(
              fetchData.data.bridgesVolume.lessThan1,
              sumPercentAllEntries(fetchData.data.bridgesVolume)
            )}%)`,
            x: fetchData.data.bridgesVolume.lessThan1,
            y: fetchData.data.bridgesVolume.lessThan1,
          },
        ]}
      />
      <div className="line-break"></div>
      <Pie
        colorScale={smallColormap}
        titleTranslate={"volumeTitle2"}
        data={[
          {
            label: `${t("less")} 0.01 ETH (${
              fetchData.data.bridgesWithCexVolume.lessThan5of1000
            }, ${sumPercentWithTotal(
              fetchData.data.bridgesWithCexVolume.lessThan5of1000,
              sumPercentAllEntries(fetchData.data.bridgesWithCexVolume)
            )}%)`,
            x: fetchData.data.bridgesWithCexVolume.lessThan5of1000,
            y: fetchData.data.bridgesWithCexVolume.lessThan5of1000,
          },
          {
            label: `0.01 ETH - 0.05 ETH (${
              fetchData.data.bridgesWithCexVolume.lessThan1of100
            }, ${sumPercentWithTotal(
              fetchData.data.bridgesWithCexVolume.lessThan1of100,
              sumPercentAllEntries(fetchData.data.bridgesWithCexVolume)
            )}%)`,
            x: fetchData.data.bridgesWithCexVolume.lessThan1of100,
            y: fetchData.data.bridgesWithCexVolume.lessThan1of100,
          },
          {
            label: `0.05 ETH - 0.1 ETH (${
              fetchData.data.bridgesWithCexVolume.lessThan1of10
            }, ${sumPercentWithTotal(
              fetchData.data.bridgesWithCexVolume.lessThan1of10,
              sumPercentAllEntries(fetchData.data.bridgesWithCexVolume)
            )}%)`,
            x: fetchData.data.bridgesWithCexVolume.lessThan1of10,
            y: fetchData.data.bridgesWithCexVolume.lessThan1of10,
          },
          {
            label: `0.1 ETH - 0.5 ETH (${
              fetchData.data.bridgesWithCexVolume.lessThan1of2
            }, ${sumPercentWithTotal(
              fetchData.data.bridgesWithCexVolume.lessThan1of2,
              sumPercentAllEntries(fetchData.data.bridgesWithCexVolume)
            )}%)`,
            x: fetchData.data.bridgesWithCexVolume.lessThan1of2,
            y: fetchData.data.bridgesWithCexVolume.lessThan1of2,
          },
          {
            label: `0.5 ETH - 1 ETH ${t("more")} (${
              fetchData.data.bridgesWithCexVolume.lessThan1
            }, ${sumPercentWithTotal(
              fetchData.data.bridgesWithCexVolume.lessThan1,
              sumPercentAllEntries(fetchData.data.bridgesWithCexVolume)
            )}%)`,
            x: fetchData.data.bridgesWithCexVolume.lessThan1,
            y: fetchData.data.bridgesWithCexVolume.lessThan1,
          },
        ]}
      />
    </>
  );
};

export default Volume;
