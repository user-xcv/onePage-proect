import Home from './Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreatePage from './Create/CreatePage'
import UserProfile from './Pages/UserProfile'
import EditProfile from './Pages/EditProfile'
import Root from './Root/Root' // Root deb nomlash mantiqan to'g'riroq

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Root>  <Home /> </Root>} />
        <Route path='/create' element={<CreatePage />} />
        <Route path='/:username' element={<UserProfile />} />
        <Route path="/edit-profile" element={<Root> <EditProfile />  </Root>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App