import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./contexts/AppContext";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";

function App() {

  const {isLoggedIn} = useAppContext();
  return (
    <BrowserRouter>

        <Routes>
            <Route path="/" element = {
              <Layout>
                  <p>Home Page</p>
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

             <Route path="/search" element = {
                <Layout>
                    <Search  />
                </Layout>
            } />

             <Route path="/detail/:hotelId" element = {
                <Layout>
                    <Detail  />
                </Layout>
            } />
            {
              isLoggedIn && (
                <>
                  <Route path="/add-hotel" element = {
                    <Layout>
                      <AddHotel  />
                    </Layout>
                  } />
                  
                  <Route path="/my-hotels" element = {
                    <Layout>
                      <MyHotels  />
                    </Layout>
                  } />

                  <Route path="/edit-hotel/:hotelId" element = {
                    <Layout>
                      <EditHotel  />
                    </Layout>
                  } />
                </>
              )
              
            }
  
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App
