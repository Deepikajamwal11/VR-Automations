import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from './common/Layout';
import Dashboard from './Dashboard';
import PrivateRoute from './Private';
import UsersList from "./admin/UsersList";


function App() {
  return (
    <Router>
      <Routes>
   
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} /> 
            <Route path="/userlist" element={<UsersList />} /> 
          
            
     
        

             

          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
