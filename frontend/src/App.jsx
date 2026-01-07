
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './components/pages/login'
import Register from './components/pages/Register'


function App() {


  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/account/login' element={<Login/>}/>
      <Route path='/account/register' element={<Register/>}/>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
