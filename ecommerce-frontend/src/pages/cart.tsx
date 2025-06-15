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
            <input
              type="text"
              className="w-70 p-5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
              placeholder="Country"
            />
          </div>
        </div>

       
        <div>
          <h3 className="p-5 font-bold">Order Summary</h3>
         
        </div>
      </div>
    </div>
  );
};

export default Cart;