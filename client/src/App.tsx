import {BrowserRouter, Routes, Route} from "react-router-dom";
import SignIn from './pages/login/signin';
import SignUp from './pages/login/signup';
import PageProtector from './pages/pageProtector';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signin' element={<SignIn />}/>
        <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
