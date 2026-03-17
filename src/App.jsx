<<<<<<< HEAD
import HomeScreen from "./views/public/HomeScreen"


function App() {

  return (
    <>
    <HomeScreen/>
    </>
  )
=======
import { Routes, Route } from "react-router-dom";
import { AppRouter } from './routes/AppRouter';
import LoginScreen from './views/auth/LoginScreen'
import HomeScreen from "./views/HomeScreen";




function App() {
  return (
    <AppRouter />
  );
>>>>>>> dev
}

export default App;

