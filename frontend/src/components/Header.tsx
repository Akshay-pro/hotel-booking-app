import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {

  const { isLoggedIn } = useAppContext();
 
  return (
    <div className="bg-red-800 py-5 px-3 "> 
        <div className="container mx-auto flex justify-between flex-wrap">
            <span className="text-2xl min-[360px]:text-xl text-white font-bold tracking-tight">
                <Link to="/">Holiday.com</Link>
            </span>
            <span className="flex space-x-2">
                {isLoggedIn ? 
                  <>
                      <Link to="/my-bookings" className="flex items-center text-white px-3 font-bold hover:bg-blue-600">My Bookings</Link>
                      <Link to="/my-hotels" className="flex items-center text-white px-3 font-bold hover:bg-blue-600" >My Hotels</Link>
                      <SignOutButton />
                  </>
                  :
                  <>
                      <Link to="/sign-in" className="flex bg-white items-center text-blue-600 px-3 hover:bg-gray-100">Sign In</Link>
                  </>
                }

            </span>
        </div>
    </div>
  )
}


export default Header;