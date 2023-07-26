import { CustomLink } from "./CustomLink";

export const Bar = () => {
    return (
        <>
            <header>
                <h1><img src="logo.svg" className="logo" /> &nbsp;Статистика по StarkNet</h1>
                <CustomLink to="/">Главная</CustomLink>
                <CustomLink to="/balance">Балансы</CustomLink>
                <CustomLink to="/tx">Транзакции</CustomLink>
                <CustomLink to="/activity">Активность по дням / неделям / месяцам</CustomLink>
                <CustomLink to="/volume">Объем</CustomLink>
                <CustomLink to="/batchcheck">Проверить свои адреса</CustomLink>
            </header>
        </>
    )
};