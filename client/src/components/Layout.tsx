import { Outlet } from "react-router-dom";
import { Bar } from "./Bar";
export const Layout = () => {
    return (
        <>
            <Bar />
            <div className="container">
                <Outlet />
            </div>
        </>
    )
};