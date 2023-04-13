import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route} from "react-router-dom"
import FrontPage from "./pages/frontpage"
import SearchPage from "./pages/search"
import AddService from "./pages/addservice"
import PageNotFound from "./pages/PageNotFound"
import GetServices from "./pages/queryResultList"
import ServicePage from "./pages/ServicePage"
import ApiError from "./pages/ApiError"
import Layout from './components/Layout';
import Disclaimer from './pages/Disclaimer';

import useToken from './components/App/useToken.js';
import LoginIndex from "./components/Login/login_index"

function App() {
  //token for user identification
  const { token, setToken } = useToken();
  //if ((!token) || (token === "invalid_user")) {
  //  return <LoginIndex />
  //}

  return (

    <Layout>
      <Routes>
        <Route path="/" element={<FrontPage token={token} />}></Route>
        <Route path="/search" element={<SearchPage />}></Route>
        <Route path="/query/:type/:keyword/" element={<GetServices />}></Route>
        <Route path="/addService" element={<AddService />}></Route>
        <Route path="/service/:id" element={<ServicePage token={token} />}></Route> 
        <Route path="/error" element={<ApiError />}></Route>
        <Route path="/disclaimer" element={<Disclaimer />}></Route>

        <Route path="/*" element={<PageNotFound />}></Route>

      </Routes>
    </Layout>


  )
}
export default App;
