import { Outlet } from "react-router-dom";
import { Bar } from "./Bar";
import { Footer } from "./Footer";
export const Layout = () => {
    return (
        <div className="layout">
            <Bar />
            <div className="container">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
};