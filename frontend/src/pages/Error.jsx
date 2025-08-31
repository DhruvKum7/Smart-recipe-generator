import React from "react";
import { AlertTriangle } from "lucide-react";

const Error = ({ message = "Something went wrong! Please try again." }) => {
  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 px-4">
        <div className="relative w-full max-w-md rounded-3xl border border-red-100 bg-white/70 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(239,68,68,.3)] p-8 text-center animate-fadeIn">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-5 rounded-full bg-red-100">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Oops! An Error Occurred</h1>
          <p className="text-gray-600 mb-8">{message}</p>
          <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-300/50 hover:bg-red-600 active:scale-[0.97] transition"
          >
            Retry
          </button>
        </div>

        {/* Animation */}
        <style>
          {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
        </style>
      </div>
  );
};

export default Error;
