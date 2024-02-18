import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";

function App() {

  return (
    <BrowserRouter>

        <Routes>
            <Route path="/" element = {
              <Layout>
                  <p>Home Page</p>
              </Layout>
            } />
            
            <Route path="/search" element = {
              <Layout>
                  <p>Search Page</p>
              </Layout>
            } />

            <Route path="/register" element = {
              <Layout>
                <Register />
              </Layout>
            }  />
            <Route path="/sign-in" element = {
              <Layout>
                <SignIn  />
              </Layout>
            }  />
        </Routes>
    </BrowserRouter>
  );
}

export default App
