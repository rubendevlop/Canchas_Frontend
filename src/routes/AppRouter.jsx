import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../views/AdminDashboard'; 
import LoginScreen from '../views/auth/LoginScreen';
import HomeScreen from '../views/HomeScreen';
import ModalRegistro from '../components/ModalRegistro';
import PagesLayout from '../layout/PagesLayout';


export const AppRouter = () => {
  return (
    
    <Routes>
      <Route element = {<PagesLayout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path='/register' element={<ModalRegistro/>}/>
      </Route>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path='/login' element ={<LoginScreen/>}/>
    </Routes>
  );
};