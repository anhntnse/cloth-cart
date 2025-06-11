import { SessionProvider } from 'next-auth/react';
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps: { session, ...pageProps }, router }) {
  const hideNavbarRoutes = ["/login", "/create"];
  const showNavbar = !hideNavbarRoutes.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      {showNavbar && <Navbar />}
      <main>
        <Component {...pageProps} />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
          toastClassName="neutral-toast"
          bodyClassName="neutral-toast-body"
        />

        <Footer />
      </main>
    </SessionProvider>
  );
}
