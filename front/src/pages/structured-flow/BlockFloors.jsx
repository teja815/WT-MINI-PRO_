import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function BlockFloors() {
  const location = useLocation();
  const navigate = useNavigate();
  const { block } = useParams(); // 'ab-1', 'ab-2', 'ab-3'
  
  const basePath = location.state?.complaintPath || ['Classroom', block];

  const floors = [
    { name: 'Ground Floor', path: '/ground-classes' },
    { name: 'First Floor', path: '/first-classes' },
    { name: 'Second Floor', path: '/second-classes' },
    { name: 'Third Floor', path: '/third-classes' },
  ];

  const handleFloorSelection = (floor) => {
    navigate(floor.path, { 
      state: { complaintPath: [...basePath, floor.name] } 
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600 mb-2">{basePath.join(' > ')}</p>
        <h1 className="text-3xl font-bold text-gray-800">Select Floor</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {floors.map((floor) => (
          <div 
            key={floor.name}
            onClick={() => handleFloorSelection(floor)}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer p-6 flex flex-col items-center justify-center border border-gray-100 group"
          >
            <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <span className="font-bold text-lg">{floor.name.charAt(0)}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{floor.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
