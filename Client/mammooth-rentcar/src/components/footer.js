import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { FaGamepad } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Mammoth Car Rental</h2>
          <p className="text-sm text-gray-400">
            Our mission is to equip modern explorers with cutting-edge, functional, and stylish bags that elevate every adventure.
          </p>
          <p className="text-xs text-gray-500 mt-4">© 2025 Mammoth Car Rental. All rights reserved.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">About</h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Career</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Support</h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Return</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Get Updates</h3>
          <div className="flex mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 rounded-l-md bg-gray-700 text-white placeholder-gray-400"
            />
            <button className="px-4 py-2 bg-white text-black font-medium rounded-r-md cursor-pointer">
              Subscribe
            </button>
          </div>
          <div className="flex gap-3 mt-2">
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700">
              <FaInstagram />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700">
              <FaXTwitter />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700">
              <FaGamepad />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700">
              <FaTiktok />
            </a>
          </div>
          <div className="flex gap-4 text-sm text-gray-400 mt-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
