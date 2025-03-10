import React from "react";
import { NavLink, Link } from "react-router-dom";
import { CiBellOn } from "react-icons/ci";


const Navbar = () => {
  return (
    <nav className="bg-black text-white ">
      <div className="container mx-auto grid grid-cols-3 items-center justify-between py-4 px-6 shadow-md shadow-white">
       
        <div className="flex items-center">
          <img
            src="./images/Mandip ko fanatics.png"
            alt="Fanatic Books Logo"
            className="h-10 w-10 mr-2"
          />
         
        </div>

        
        <ul className="flex space-x-8 justify-between items-center  w-full">
          <li>
            <NavLink className={({isActive}) =>
                    isActive ? 'text-purple-500' : 'hover:text-purple-600'
                  } to="/">Home</NavLink>

          </li>
          <li>
            <NavLink className={({isActive}) =>
                    isActive ? 'text-purple-500' : 'hover:text-purple-600'
                  } to="/shop">Shop</NavLink>

          </li>
          <li>
        <NavLink className={({isActive}) =>
                    isActive ? 'text-purple-500' : 'hover:text-purple-600'
                  } to="/about">About</NavLink>
            
          </li>
          <li>
            <NavLink className={({isActive}) =>
                    isActive ? 'text-purple-500' : 'hover:text-purple-600'
                  } to="/cart">Cart</NavLink>

          </li>
          <li>
            <NavLink className={({isActive}) =>
                    isActive ? 'text-purple-500' : 'hover:text-purple-600'
                  } to="/contact">Contact</NavLink>
          </li>
        </ul>

        
        <div className="flex gap-5 items-center justify-end">
         <Link to={"/notification"}><CiBellOn size={30} />
</Link>
         

          <Link to={"/login"}>Login</Link>
          <Link to={"/register"}>Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
