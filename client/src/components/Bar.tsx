import { CustomLink } from "./CustomLink";
import { useTranslation } from "react-i18next";

export const Bar = () => {
    const { t, i18n } = useTranslation();

    const handleClick = () => {
        const newLanguage = i18n.language == "en" ? "ru" : "en"
        i18n.changeLanguage(newLanguage)
    }

    return (
        <>
            <header>
                <h1><img src="logo.svg" className="logo" /> &nbsp;{t('header')}</h1>
                <CustomLink to="/">{t("navMain")}</CustomLink>
                <CustomLink to="/balance">{t("navBalance")}</CustomLink>
                <CustomLink to="/tx">{t("navTx")}</CustomLink>
                <CustomLink to="/activity">{t("navActivity")}</CustomLink>
                <CustomLink to="/volume">{t("navVolume")}</CustomLink>
                <CustomLink to="/batchcheck">{t("navBatchcheck")}</CustomLink>
                <a onClick={handleClick}>
                    <img src={`flag-${i18n.language}.svg.webp`} className="language-flag" />
                </a>
            </header>
        </>
    )
};