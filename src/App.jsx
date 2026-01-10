import Home from './Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreatePage from './Create/CreatePage'
import UserProfile from './Pages/UserProfile'
import EditProfile from './Pages/EditProfile'
import Root from './Root/Root'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root hamma sahifalar uchun ota-ona bo'ladi */}
        <Route element={<Root />}>
          {/* '/' ga kirganda Home chiqadi, lekin Root ichidagi Outlet o'rniga */}
          <Route path="/" element={<Home />} />

          <Route path="/create" element={<CreatePage />} />

          {/* Profil sahifasi */}
          <Route path="/:username" element={<UserProfile />} />

          <Route path="/edit" element={<EditProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
