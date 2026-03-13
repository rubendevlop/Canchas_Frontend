import { Outlet } from "react-router-dom";
import Navbar from "../components/layouts/Navbar"
import Footer from "../components/layouts/Footer";



const PagesLayout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default PagesLayout;