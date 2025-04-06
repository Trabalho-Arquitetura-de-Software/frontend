import { Routes, Route } from 'react-router-dom'
import {Login} from '../pages/auth/Login'; 

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
  );
}

export default AppRoutes;