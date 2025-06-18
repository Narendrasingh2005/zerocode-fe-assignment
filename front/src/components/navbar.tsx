export const Navbar = () => {
  return (
    <div className="px-10  ">
      <nav className="bg-gradient-to-r from-orange-200 to-blue-300 h-24 p-4 rounded-3xl">
        <div className="container mx-auto flex justify-between items-center">
          {/* Top Left */}
          <div className=" text-rose-400 mt-5 ">
            <a href="/" className="font-bold  italic  text-3xl ">
              Chat App
            </a>
          </div>

          {/* Top Right */}
          <div className="flex space-x-4">
            <h2 className="text-gray-600  mt-5 text-2xl">by</h2>
            <h2 className="text-gray-600 font-bold mt-5 text-2xl ">
              Narendra
            </h2>
          </div>
        </div>
      </nav>
    </div>
  );
};
