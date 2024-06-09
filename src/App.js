import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {InitialPage} from './pages/initial_page'
import {BrowseEvent} from "./pages/browse-event_page"; 
import {Contact} from "./pages/contact_page";
import {About} from "./pages/about_page";
import {SignIn} from "./pages/signin_page";
import { UserProfile } from './pages/user_page'; 
import { UserEvent } from './pages/events_user_page.jsx'; 
import { UserAdmin } from './pages/admin_page.jsx';
import { AddEvent } from './pages/add_event_page.jsx';
import { MyEvents } from './pages/events_purchased_page.jsx';
import {ChatBot} from './pages/chatbot.jsx'


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
      <Route path="/user" element={<UserProfile />} />
      <Route path="/buy-event" element={<UserEvent />} />
      <Route path="/admin" element={<UserAdmin />} />
      <Route path="/add-event" element={<AddEvent />} />
      <Route path="/myevents" element={<MyEvents />} />
      <Route path="/chat" element={<ChatBot />} />
    </Routes>

  </BrowserRouter>
  );
}

export default App;