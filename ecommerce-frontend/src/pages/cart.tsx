import CountrySelector from "@/components/Country";

const Cart = () => {
  return (
    <div className="p-6">
      <h4 className="text-center font-bold text-3xl text-gray-800">Order Details</h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="p-5 font-bold">Address</h3>
          
          <div className="group">
            <input
              type="text"
              className="w-60 p-5 border-2 m-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
              placeholder="Enter city, state and ZIP code"
            />
            <input
              type="text"
              className="w-60 p-5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
              placeholder="Enter city, state and ZIP code"
            />
          </div>
          
          <input
            type="text"
            className="w-60 p-5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
            placeholder="Company"
          />
          
          <div className="group">
            <input
              type="email"
              className="w-70 p-5 border-2 m-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
              placeholder="Email"
            />
            <input
              type="text"
              className="w-60 p-5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
              placeholder="Phone Number"
            />
          </div>
          
          <div className="group">
            <input
              type="text"
              className="w-60 p-5 border-2 m-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
              placeholder="City"
            />
           <CountrySelector/>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="p-5 font-bold">Order Summary</h3>
            <div className="flex items-center space-x-4">
              <img
                src="/jordan.jpg"
                alt="Jordan"
                className="w-16 h-16 object-cover rounded-md shadow-sm"
              />
              <div>
                <p className="font-medium text-gray-800">The Shoe</p>
                <p className="text-sm text-gray-600">Size: 10</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">$129.99</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">$9.99</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">$11.20</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-red-600">$151.18</span>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-gray-800 hover:bg-blue text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;