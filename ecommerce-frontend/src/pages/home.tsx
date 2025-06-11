const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black shadow-inner">
      <div className="flex flex-col md:flex-row items-center justify-between bg-black shadow-2xl w-full max-w-6xl rounded-lg p-6">
     
        <div className="flex-1 px-6 py-8 text-center md:text-left">
          <div className="font-bold text-4xl mb-4 text-white">
            <h2>Discover Your</h2>
            <h2>Style Today!</h2>
          </div>
          <div className="mb-6">
            <p className="text-white max-w-md mx-auto md:mx-0">
              "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
            </p>
          </div>
          <div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition">
              Shop Now
            </button>
          </div>
        </div>

       
        <div className="flex-1 px-6 py-8 flex justify-center items-center">
          <img 
            src="/nike.jpg"
            alt="Fashion styling"
            className="w-4/5 h-auto rounded-lg shadow-lg max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
