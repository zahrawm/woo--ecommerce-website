import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Products = () => {
   const navigate = useNavigate();

  const handleClick = () => {
    navigate('/cart');
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h4 className="text-center font-bold text-3xl text-gray-800">Products</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full">
          <div className="mb-4">
            <img
              src="/nike.jpg"
              alt="Nike Shoes"
              className="w-full h-40 sm:h-48 object-cover rounded-md shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            <h5 className="text-lg sm:text-xl font-semibold text-gray-800">Nike Shoes</h5>
            <p className="text-sm sm:text-base text-gray-600">Premium quality athletic footwear</p>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
              <span className="text-xl sm:text-2xl font-bold text-black">$55</span>
              <button onClick={handleClick}
              className="bg-black hover:bg-gray-800 text-white px-3 py-2 sm:px-4 rounded-md transition duration-200 text-sm sm:text-base w-full sm:w-auto">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full">
          <div className="mb-4">
            <img
              src="/reebok.jpg"
              alt="Reebok Shoes"
              className="w-full h-40 sm:h-48 object-cover rounded-md shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            <h5 className="text-lg sm:text-xl font-semibold text-gray-800">Reebok Shoes</h5>
            <p className="text-sm sm:text-base text-gray-600">Premium quality athletic footwear</p>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
              <span className="text-xl sm:text-2xl font-bold text-black">$60</span>
              <button onClick={handleClick}
              className="bg-black hover:bg-gray-800 text-white px-3 py-2 sm:px-4 rounded-md transition duration-200 text-sm sm:text-base w-full sm:w-auto">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

      
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full">
          <div className="mb-4">
            <img
              src="/vans.jpg"
              alt="Vans"
              className="w-full h-40 sm:h-48 object-cover rounded-md shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            <h5 className="text-lg sm:text-xl font-semibold text-gray-800">Vans </h5>
            <p className="text-sm sm:text-base text-gray-600">Premium quality athletic footwear</p>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
              <span className="text-xl sm:text-2xl font-bold text-black">$65</span>
              <button 
              onClick={handleClick} className="bg-black hover:bg-gray-800 text-white px-3 py-2 sm:px-4 rounded-md transition duration-200 text-sm sm:text-base w-full sm:w-auto">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full">
          <div className="mb-4">
            <img
              src="/converse.jpg"
              alt="Converse"
              className="w-full h-40 sm:h-48 object-cover rounded-md shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            <h5 className="text-lg sm:text-xl font-semibold text-gray-800">Converse</h5>
            <p className="text-sm sm:text-base text-gray-600">Premium quality athletic footwear</p>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
              <span className="text-xl sm:text-2xl font-bold text-black">$70</span>
              <button
              onClick={handleClick}
              className="bg-black hover:bg-gray-800 text-white px-3 py-2 sm:px-4 rounded-md transition duration-200 text-sm sm:text-base w-full sm:w-auto">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full">
          <div className="mb-4">
            <img
              src="/balance.jpg"
              alt="Balance"
              className="w-full h-40 sm:h-48 object-cover rounded-md shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            <h5 className="text-lg sm:text-xl font-semibold text-gray-800">Balance</h5>
            <p className="text-sm sm:text-base text-gray-600">Premium quality athletic footwear</p>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
              <span className="text-xl sm:text-2xl font-bold text-black">$90</span>
              <button 
              onClick={handleClick}
              className="bg-black hover:bg-gray-800 text-white px-3 py-2 sm:px-4 rounded-md transition duration-200 text-sm sm:text-base w-full sm:w-auto">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full">
          <div className="mb-4">
            <img
              src="/jordan.jpg"
              alt="Jordan"
              className="w-full h-40 sm:h-48 object-cover rounded-md shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            <h5 className="text-lg sm:text-xl font-semibold text-gray-800">Jordan</h5>
            <p className="text-sm sm:text-base text-gray-600">Premium quality athletic footwear</p>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
              <span className="text-xl sm:text-2xl font-bold text-black">$95</span>
              <button 
              onClick={handleClick}
              className="bg-black hover:bg-gray-800 text-white px-3 py-2 sm:px-4 rounded-md transition duration-200 text-sm sm:text-base w-full sm:w-auto">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
};

export default Products;