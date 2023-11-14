import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import useElementSize from "../hooks/useElementSize";
import Bar from "./Bar";
import Footer from "./Footer";

const Layout = () => {
  const [boxRef, { width, height }] = useElementSize();

  useEffect(() => {
    document.body.style.backgroundSize = `${width}px ${height}px`;
  }, [width, height]);

  return (
    <div className="layout" ref={boxRef}>
      <Bar />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
