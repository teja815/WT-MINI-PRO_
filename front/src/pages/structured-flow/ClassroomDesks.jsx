import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ClassroomDesks({ floorName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = location.state?.complaintPath || ['Classroom', 'Academic Block', floorName || 'Floor', 'Class'];

  // 6 desks
  const desks = Array.from({ length: 6 }, (_, i) => ({
    id: `desk-${i + 1}`,
    name: `Desk ${i + 1}`
  }));

  const handleDeskSelection = (desk) => {
    navigate('/classroom', { 
      state: { complaintPath: [...basePath, desk.name] } 
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600 mb-2">{basePath.join(' > ')}</p>
        <h1 className="text-3xl font-bold text-gray-800">Select Desk</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {desks.map((desk) => (
          <div 
            key={desk.id}
            onClick={() => handleDeskSelection(desk)}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer p-6 flex flex-col items-center justify-center group"
          >
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded mb-4 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{desk.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
