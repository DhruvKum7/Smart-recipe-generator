import React from "react";
import { Heart, Mail, Github, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
      <footer className="w-full bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
            <h2 className="text-lg font-bold">Dhruv Kumar</h2>
            <p className="text-sm text-gray-200 flex items-center gap-1">
              Crafted with <Heart size={16} className="text-red-400 animate-bounce" /> & passion
            </p>
          </div>

          {/* Right Section - Social Links */}
          <div className="flex items-center gap-5">
            <a
                href="mailto:dhruvkumar04553@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-300 hover:text-yellow-300"
            >
              <Mail size={22} />
            </a>
            <a
                href="https://github.com/dhruvkumar04553"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-300 hover:text-green-300"
            >
              <Github size={22} />
            </a>
            <a
                href="https://www.linkedin.com/in/dhruvkumar04553"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-300 hover:text-blue-300"
            >
              <Linkedin size={22} />
            </a>
            <a
                href="https://instagram.com/dhruv.codes"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-300 hover:text-pink-300"
            >
              <Instagram size={22} />
            </a>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs text-gray-200 mt-4 border-t border-gray-400 pt-3">
          © {new Date().getFullYear()} Dhruv Kumar. Built with React & TailwindCSS.
        </p>
      </footer>
  );
};

export default Footer;
