import {Link} from 'react-router-dom';
 
 export const Navbar = () => 
    {
    return (
       
         <div className="bg-white shadow-md">
            <ul className='flex flex-row justify-end space-x-8 p-4 mt-5 text-gray-700 font-medium'>
                <li className="">
                    <Link to="/" className='hover:text-blue-500 transition'>Home</Link>
                </li>
                <li className="">
                    <Link to="/products" className='hover:text-blue-500 transition' >Products</Link>
                </li>
                <li className="">
                    <Link to="/cart"  className='hover:text-blue-500 transition'>Cart</Link>
                </li>
                <li className="">
                    <Link to="/profile "  className='hover:text-blue-500 transition'>Profile</Link>
                </li>
                <li className="">
                    <Link to="/login"  className='hover:text-blue-500 transition'>Login</Link>
                </li>
            </ul>
             

         </div>
    
    );

    }