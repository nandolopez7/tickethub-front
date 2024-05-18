import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {InitialPage} from './pages/initial_page'



/**Como crear rutas  
 * Importacion
 * import { Login_template } from './pages/Login_template'
 * Implementación
 * <Route path='/login' element ={<Login_template/>} />  
 * */  
function App() {
  return (
    <BrowserRouter>

    <Routes>
      <Route path='/' element ={<InitialPage/>} />
    </Routes>

  </BrowserRouter>
  );
}

export default App;