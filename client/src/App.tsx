import {BrowserRouter, Routes, Route} from "react-router-dom";
import { AuthProvider } from "./context/auth";
import System from "./pages/system";
import SignIn from './pages/login/signin';
import SignUp from './pages/login/signup';
import PageProtector from './pages/pageProtector';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/signin' element={<SignIn />}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/:tab' element={<PageProtector><System /></PageProtector>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
