import { useState } from "react";

interface FormData {
  address1: string;
  address2: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

interface OrderData {
  subtotal: number;
  shipping: number;
  tax: number;
}

const Cart: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    address1: '',
    address2: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    country: ''
  });

  const [orderData, setOrderData] = useState<OrderData>({
    subtotal: 129.99,
    shipping: 9.99,
    tax: 11.20
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = (): string => {
    return (orderData.subtotal + orderData.shipping + orderData.tax).toFixed(2);
  };

  const handlePlaceOrder = (): void => {
    // Validate required fields
    const requiredFields: (keyof FormData)[] = ['address1', 'email', 'phone', 'city'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Process order
    console.log('Order placed successfully!', {
      customerInfo: formData,
      orderSummary: {
        ...orderData,
        total: calculateTotal()
      }
    });
    
    alert('Order placed successfully! Check console for details.');
  };

  return (
    <div className="p-6">
      <h4 className="text-center font-bold text-3xl text-gray-800">Order Details</h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="p-5 font-bold">Address</h3>
          
          <div className="group">
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleInputChange}
              className="w-60 p-5 border-2 m-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
              placeholder="Enter address line 1"
            />
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleInputChange}
              className="w-60 p-5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
              placeholder="Enter address line 2 (optional)"
            />
          </div>
          
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-60 p-5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
            placeholder="Company (optional)"
          />
          
          <div className="group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-70 p-5 border-2 m-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
              placeholder="Email"
              required
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-60 p-5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
              placeholder="Phone Number"
              required
            />
          </div>
          
          <div className="group">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-60 p-5 border-2 m-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
              placeholder="City"
              required
            />
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-60 p-5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none group-hover:border-gray-300"
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
              <option value="JP">Japan</option>
              <option value="KR">South Korea</option>
              <option value="CN">China</option>
              <option value="IN">India</option>
              <option value="BR">Brazil</option>
              <option value="MX">Mexico</option>
              <option value="GH">Ghana</option>
            </select>
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
                <span className="font-medium">${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">${orderData.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${orderData.tax.toFixed(2)}</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-gray-600">${calculateTotal()}</span>
              </div>
            </div>
            
            <button 
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-gray-800 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;