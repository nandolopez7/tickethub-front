import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {InitialPage} from './pages/initial_page'
import {BrowseEvent} from "./pages/browse-event_page"; 
import {Contact} from "./pages/contact_page";
import {About} from "./pages/about_page";
import {SignIn} from "./pages/signin_page";
import { UserEvents } from './pages/user_page'; 
import { UserAdmin } from './pages/admin_page.jsx';


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
      <Route path="/browse-event" element={<BrowseEvent />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/user" element={<UserEvents />} />
      <Route path="/admin" element={<UserAdmin />} />
    </Routes>

  </BrowserRouter>
  );
}

export default App;