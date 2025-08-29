import React from "react";
import { AlertTriangle } from "lucide-react";

const Error = ({ message = "Something went wrong! Please try again." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Error</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default Error;
