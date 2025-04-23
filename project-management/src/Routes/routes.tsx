import { Routes, Route } from 'react-router-dom'
import { LoginPage } from '../pages/auth/Login'; 
import { Home } from '../pages/Home';
import Users from '@/pages/users';
import Projects from '@/pages/projects';

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Adicione outras rotas aqui conforme necessário */}
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
        {/* <Route path="/tasks" element={<Tasks />} /> */}
        <Route path="/projects" element={<Projects/>} />
      </Routes>
  );
}

export default AppRoutes;