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
                <CustomLink to="/">Главная</CustomLink>
                <CustomLink to="/balance">Балансы</CustomLink>
                <CustomLink to="/tx">Транзакции</CustomLink>
                <CustomLink to="/activity">Активность по дням / неделям / месяцам</CustomLink>
                <CustomLink to="/volume">Объем</CustomLink>
                <CustomLink to="/batchcheck">Проверить свои адреса</CustomLink>
                <a onClick={handleClick}>
                    <img src={`flag-${i18n.language}.svg.webp`} className="language-flag" />
                </a>
            </header>
        </>
    )
};