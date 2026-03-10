import { Routes, Route } from "react-router-dom";
import LoginScreen from './views/auth/LoginScreen'
import HomeScreen from "./views/HomeScreen";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<HomeScreen />} />
    </Routes>
  )
}

export default App