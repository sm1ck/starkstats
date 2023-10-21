import { Watch } from "react-loader-spinner";
import { useFetch } from "../hooks/fetchHook";
import { useTitle } from "../hooks/titleHook";
import { useTranslation } from "react-i18next";

export const Index: () => JSX.Element = () => {
    const { t } = useTranslation();
    let [loaded, fetchData] = useFetch("/api/total");

    useTitle(t("title", { page: t("navMain") }));

    return !loaded ? <Watch
        height="80"
        width="80"
        radius="48"
        color="#0c0c4f"
        ariaLabel="watch-loading"
        wrapperStyle={{}}
        visible={true}
    /> : fetchData.data === undefined ? <div>{fetchData.error}</div> : <div style={{ textAlign: "center", fontSize: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>{t("indexTotal")}</h3>
        <h3 style={{ color: "var(--color-bg)" }}>{fetchData.data.totalWallets}</h3>
        <h3>{t("indexTotalExcluding")}</h3>
        <h3 style={{ color: "var(--color-bg)" }}>{fetchData.data.totalWalletsFiltered}</h3>
        <div style={{ textAlign: "left" }}>
            {t("indexTotalExcludingDetails")}
            <br />
            {t("indexTotalExcludingDetails2")}
        </div>
        <h3>{t("indexDescription")}</h3>
        <div style={{ textAlign: "left" }}>
            {t("indexDescriptionDetails")}
            <br />
            {t("indexDescriptionDetails2")}
            {t("indexDescriptionDetails3")}
            <br />
            {t("indexDescriptionDetails4")}
        </div>
        <h3>{t("indexLinks")}</h3>
        Github: <a href="https://github.com/sm1ck/starkstats" target="_blank" rel="noreferrer">github.com/sm1ck/starkstats</a><br />
        {t("indexLinksAuthor")}: <a href="https://t.me/web3_coding" target="_blank" rel="noreferrer">t.me/web3_coding</a>
    </div>;
};