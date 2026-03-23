import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddStructuredComplaint() {
  const navigate = useNavigate();

  const handleNavigation = (category) => {
    // Navigate and initialize the complaint path
    navigate(`/${category}-grievance`, { state: { complaintPath: [capitalize(category)] } });
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4 tracking-tight">Select Complaint Category</h1>
        <p className="text-gray-600 text-lg">Please select the area related to your issue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hostel Card */}
        <div 
          onClick={() => handleNavigation('hostel')}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100"
        >
          <div className="h-32 bg-red-500 flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hostel</h3>
            <p className="text-sm text-gray-500">Report issues related to hostel rooms, facilities, or maintenance.</p>
          </div>
        </div>

        {/* Mess Card */}
        <div 
          onClick={() => handleNavigation('mess')}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100"
        >
          <div className="h-32 bg-yellow-500 flex items-center justify-center group-hover:bg-yellow-600 transition-colors">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mess</h3>
            <p className="text-sm text-gray-500">Raise complaints regarding food quality, hygiene or mess services.</p>
          </div>
        </div>

        {/* Classroom Card */}
        <div 
          onClick={() => handleNavigation('classroom')}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100"
        >
          <div className="h-32 bg-blue-500 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Classroom</h3>
            <p className="text-sm text-gray-500">Report problems with classroom infrastructure, equipment, or cleanliness.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
