import React from "react";

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-lg font-bold">Student Portal</h1>
        <ul className="flex space-x-4">
          <li><a href="#home" className="hover:underline">Home</a></li>
          <li><a href="#registration" className="hover:underline">Registration</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
