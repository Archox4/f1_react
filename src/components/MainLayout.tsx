import { Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';

const MainLayout = () => {
  return (
    <div className="app-container">
      <Navbar /> 
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;