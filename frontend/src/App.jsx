import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Properties from './pages/Properties'
import Projects from './pages/Projects'
import Neighborhoods from './pages/Neighborhoods'
import Agents from './pages/Agents'
import PropertyDetail from './pages/PropertyDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:slug" element={<PropertyDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/neighborhoods" element={<Neighborhoods />} />
        <Route path="/agents" element={<Agents />} />
      </Routes>
    </BrowserRouter>
  )
}
