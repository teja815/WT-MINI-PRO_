import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function WashroomSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = location.state?.complaintPath || ['Classroom', 'Academic Block', 'Floor', 'Washroom'];

  const genders = [
    { id: 'male', name: 'Male', route: '/male-wash', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'female', name: 'Female', route: '/female-wash', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const handleGenderSelection = (gender) => {
    navigate(gender.route, { 
      state: { complaintPath: [...basePath, gender.name] } 
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium text-blue-600 mb-2">{basePath.join(' > ')}</p>
        <h1 className="text-3xl font-bold text-gray-800">Select Washroom Type</h1>
      </div>

      <div className="flex justify-center space-x-6">
        {genders.map((gender) => (
          <div 
            key={gender.id}
            onClick={() => handleGenderSelection(gender)}
            className="w-64 bg-white rounded-lg border border-gray-100 shadow-md hover:shadow-xl transition-shadow cursor-pointer p-8 flex flex-col items-center justify-center text-center group"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors
              ${gender.id === 'male' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white'}
            `}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={gender.icon} />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{gender.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
