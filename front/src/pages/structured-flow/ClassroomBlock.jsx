import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ClassroomBlock() {
  const location = useLocation();
  const navigate = useNavigate();
  // Ensure we have a base path
  const basePath = location.state?.complaintPath || ['Classroom'];

  const blocks = [
    { id: 'ab-1', name: 'Academic Block 1', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'ab-2', name: 'Academic Block 2', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'ab-3', name: 'Academic Block 3', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  ];

  const handleBlockSelection = (block) => {
    navigate(`/classroom-grievance/${block.id}`, { 
      state: { complaintPath: [...basePath, block.name] } 
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600 mb-2">{basePath.join(' > ')}</p>
        <h1 className="text-3xl font-bold text-gray-800">Select Academic Block</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blocks.map((block) => (
          <div 
            key={block.id}
            onClick={() => handleBlockSelection(block)}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 p-6 flex flex-col items-center justify-center text-center group"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={block.icon} />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{block.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
