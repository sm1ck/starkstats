import { Watch } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import useTitle from "../hooks/useTitle";
import { sumPercent } from "../utils/common";
import useFetch from "../hooks/useFetch";
import useLangFetch from "../hooks/useLangFetch";
import LineChart from "../components/LineChart";
import ScatterChart from "../components/ScatterChart";

const Activity = () => {
  const { t } = useTranslation();
  const [loaded, fetchData] = useFetch("/api/activity");
  const [loadedAggregateUsers, langAggregateUsers] = useLangFetch(
    "/api/aggregateusers"
  );

  useTitle(t("title", { page: t("navActivityShort") }));

  return !loaded || !loadedAggregateUsers ? (
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
      <ScatterChart
        titleTranslate={"txActivityDay"}
        data={[
          {
            label: `1 ${t("day")} (${
              fetchData.data.users_by_days[1]
            }, ${sumPercent(fetchData.data.users_by_days, 1)}%)`,
            x: fetchData.data.users_by_days[1],
            y: fetchData.data.users_by_days[1],
          },
          {
            label: `2 ${t("days")} (${
              fetchData.data.users_by_days[2]
            }, ${sumPercent(fetchData.data.users_by_days, 2)}%)`,
            x: fetchData.data.users_by_days[2],
            y: fetchData.data.users_by_days[2],
          },
          {
            label: `3 ${t("days")} (${
              fetchData.data.users_by_days[3]
            }, ${sumPercent(fetchData.data.users_by_days, 3)}%)`,
            x: fetchData.data.users_by_days[3],
            y: fetchData.data.users_by_days[3],
          },
          {
            label: `4 ${t("days")} (${
              fetchData.data.users_by_days[4]
            }, ${sumPercent(fetchData.data.users_by_days, 4)}%)`,
            x: fetchData.data.users_by_days[4],
            y: fetchData.data.users_by_days[4],
          },
          {
            label: `5 ${t("days2")} (${
              fetchData.data.users_by_days[5]
            }, ${sumPercent(fetchData.data.users_by_days, 5)}%)`,
            x: fetchData.data.users_by_days[5],
            y: fetchData.data.users_by_days[5],
          },
          {
            label: `6 - 10 ${t("days2")} (${
              fetchData.data.users_by_days[10]
            }, ${sumPercent(fetchData.data.users_by_days, 10)}%)`,
            x: fetchData.data.users_by_days[10],
            y: fetchData.data.users_by_days[10],
          },
          {
            label: `11 - 20 ${t("days2")} (${
              fetchData.data.users_by_days[20]
            }, ${sumPercent(fetchData.data.users_by_days, 20)}%)`,
            x: fetchData.data.users_by_days[20],
            y: fetchData.data.users_by_days[20],
          },
          {
            label: `21 - 30 ${t("days2")} (${
              fetchData.data.users_by_days[30]
            }, ${sumPercent(fetchData.data.users_by_days, 30)}%)`,
            x: fetchData.data.users_by_days[30],
            y: fetchData.data.users_by_days[30],
          },
          {
            label: `30 ${t("more")} ${t("days2")} (${
              fetchData.data.users_by_days["all"]
            }, ${sumPercent(fetchData.data.users_by_days, "all")}%)`,
            x: fetchData.data.users_by_days["all"],
            y: fetchData.data.users_by_days["all"],
          },
        ]}
      />
      <ScatterChart
        titleTranslate={"txActivityWeek"}
        data={[
          {
            label: `1 ${t("week")} (${
              fetchData.data.users_by_weeks[1]
            }, ${sumPercent(fetchData.data.users_by_weeks, 1)}%)`,
            x: fetchData.data.users_by_weeks[1],
            y: fetchData.data.users_by_weeks[1],
          },
          {
            label: `2 ${t("weeks")} (${
              fetchData.data.users_by_weeks[2]
            }, ${sumPercent(fetchData.data.users_by_weeks, 2)}%)`,
            x: fetchData.data.users_by_weeks[2],
            y: fetchData.data.users_by_weeks[2],
          },
          {
            label: `3 ${t("weeks")} (${
              fetchData.data.users_by_weeks[3]
            }, ${sumPercent(fetchData.data.users_by_weeks, 3)}%)`,
            x: fetchData.data.users_by_weeks[3],
            y: fetchData.data.users_by_weeks[3],
          },
          {
            label: `4 ${t("weeks")} (${
              fetchData.data.users_by_weeks[4]
            }, ${sumPercent(fetchData.data.users_by_weeks, 4)}%)`,
            x: fetchData.data.users_by_weeks[4],
            y: fetchData.data.users_by_weeks[4],
          },
          {
            label: `5 ${t("weeks2")} (${
              fetchData.data.users_by_weeks[5]
            }, ${sumPercent(fetchData.data.users_by_weeks, 5)}%)`,
            x: fetchData.data.users_by_weeks[5],
            y: fetchData.data.users_by_weeks[5],
          },
          {
            label: `6 ${t("more")} ${t("weeks2")} (${
              fetchData.data.users_by_weeks["all"]
            }, ${sumPercent(fetchData.data.users_by_weeks, "all")}%)`,
            x: fetchData.data.users_by_weeks["all"],
            y: fetchData.data.users_by_weeks["all"],
          },
        ]}
      />
      <ScatterChart
        titleTranslate={"txActivityMonth"}
        data={[
          {
            label: `1 ${t("month")} (${
              fetchData.data.users_by_months[1]
            }, ${sumPercent(fetchData.data.users_by_months, 1)}%)`,
            x: fetchData.data.users_by_months[1],
            y: fetchData.data.users_by_months[1],
          },
          {
            label: `2 ${t("months")} (${
              fetchData.data.users_by_months[2]
            }, ${sumPercent(fetchData.data.users_by_months, 2)}%)`,
            x: fetchData.data.users_by_months[2],
            y: fetchData.data.users_by_months[2],
          },
          {
            label: `3 ${t("months")} (${
              fetchData.data.users_by_months[3]
            }, ${sumPercent(fetchData.data.users_by_months, 3)}%)`,
            x: fetchData.data.users_by_months[3],
            y: fetchData.data.users_by_months[3],
          },
          {
            label: `4 ${t("months")} (${
              fetchData.data.users_by_months[4]
            }, ${sumPercent(fetchData.data.users_by_months, 4)}%)`,
            x: fetchData.data.users_by_months[4],
            y: fetchData.data.users_by_months[4],
          },
          {
            label: `5 ${t("months2")} (${
              fetchData.data.users_by_months[5]
            }, ${sumPercent(fetchData.data.users_by_months, 5)}%)`,
            x: fetchData.data.users_by_months[5],
            y: fetchData.data.users_by_months[5],
          },
          {
            label: `6 ${t("more")} ${t("months2")} (${
              fetchData.data.users_by_months["all"]
            }, ${sumPercent(fetchData.data.users_by_months, "all")}%)`,
            x: fetchData.data.users_by_months["all"],
            y: fetchData.data.users_by_months["all"],
          },
        ]}
      />
      <LineChart
        data={langAggregateUsers?.data}
        titleTranslate={"usersAggregateTitle"}
      />
    </>
  );
};

export default Activity;
