import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function App({ Component, pageProps, router }) {
  const hideNavbarRoutes = ['/login', '/create'];
  const showNavbar = !hideNavbarRoutes.includes(router.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <main >
        <Component {...pageProps} />
        <Footer />
      </main>
    </>
  );
}
