import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Registration from "./components/Registration";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-gray-100 text-gray-900">
      <Navbar />
      <HeroSection />
      <Registration />
      <Footer />
    </div>
  );
}

export default App;
