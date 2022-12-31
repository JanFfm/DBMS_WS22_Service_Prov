// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useParams } from "react-router-dom"
import FrontPage from "./pages/frontpage"
import LoginPage from "./pages/login"
import SearchPage from "./pages/search"
import AddService from "./pages/addservice"
import PageNotFound from "./pages/PageNotFound"
import Services from "./pages/queryResultList"

import Layout from './components/Layout';

function App() {
  return (

    <Layout>
      <Routes>
        <Route path="/" element={<FrontPage />}></Route>
        <Route path="/search" element={<SearchPage />}></Route>
        <Route path="/result/query/:name/:sector" element={<Services />}></Route>
        <Route path="/addService" element={<AddService />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>

        <Route path="/*" element={<PageNotFound />}></Route>

      </Routes>
    </Layout>


  )
}
export default App;
