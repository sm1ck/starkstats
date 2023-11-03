import { useTranslation } from "react-i18next";

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer>
            <span>{t("footerForEcosystem1")} StarkNet {t("footerForEcosystem2")}, 2023.</span> <a href="https://github.com/sm1ck/starkstats" target="_blank" rel="noreferrer"><img src="icons/github.svg" alt="" className="links-logo" /></a> <a href="https://t.me/web3_coding" target="_blank" rel="noreferrer"><img src="icons/telegram.svg" alt="" className="links-logo" /></a>
        </footer>
    )
};