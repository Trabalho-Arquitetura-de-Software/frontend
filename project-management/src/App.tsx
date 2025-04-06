import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppRoutes from './Routes/routes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
