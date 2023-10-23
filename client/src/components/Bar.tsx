/* eslint-disable jsx-a11y/anchor-is-valid */
import { CustomLink } from "./CustomLink";
import { useTranslation } from "react-i18next";

export const Bar = () => {
    const { t, i18n } = useTranslation();

    const handleClick = () => {
        const newLanguage = i18n.language === "en" ? "ru" : "en"
        i18n.changeLanguage(newLanguage)
    }

    return (
        <>
            <header>
                <h1><img src="logo.svg" alt="" className="logo" /> &nbsp;{t('header')}</h1>
                <CustomLink to="/">{t("navMain")}</CustomLink>
                <CustomLink to="/balance">{t("navBalance")}</CustomLink>
                <CustomLink to="/tx">{t("navTx")}</CustomLink>
                <CustomLink to="/activity">{t("navActivity")}</CustomLink>
                <CustomLink to="/volume">{t("navVolume")}</CustomLink>
                <CustomLink to="/internalvolume">{t("navInternalVolume")}</CustomLink>
                <CustomLink to="/batchcheck">{t("navBatchcheck")}</CustomLink>
                <a onClick={handleClick} title={t("languageSwitch")}>
                    <img src={`flag-${i18n.language}.svg.webp`} alt="" className="language-flag" />
                </a>
            </header>
        </>
    )
};