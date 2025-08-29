import React from "react";
import { Heart, Mail, Github, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-purple-600 via-teal-500 to-purple-500 text-white py-4 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">

        <div className="flex items-center gap-2 text-m md:text-base">
          <span>Made with</span>
          <Heart size={20} className="animate-pulse" fill="red" stroke="none" />
          <span>by</span>
          <span className="font-bold">Pranjal</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="mailto:pranjal10092005@gmail.com" target="_blank" rel="noopener noreferrer"
             className="hover:text-yellow-400 hover:drop-shadow-[0_0_8px_#fff] transition-all duration-300">
            <Mail size={20} />
          </a>
          <a href="https://github.com/789pranj" target="_blank" rel="noopener noreferrer"
             className="hover:text-green-400 hover:drop-shadow-[0_0_8px_#fff] transition-all duration-300">
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/pranjal-46b015262" target="_blank" rel="noopener noreferrer"
             className="hover:text-blue-400 hover:drop-shadow-[0_0_8px_#fff] transition-all duration-300">
            <Linkedin size={20} />
          </a>
          <a href="https://instagram.com/pranjal_p1" target="_blank" rel="noopener noreferrer"
             className="hover:text-red-400 hover:drop-shadow-[0_0_8px_#fff] transition-all duration-300">
            <Instagram size={20} />
          </a>
        </div>
      </div>

      <p className="text-center text-gray-100 text-s mt-2">
        &copy; {new Date().getFullYear()} Pranjal. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
