import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FloorDetails({ floorPrefix }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Ensure we have a base path
  const basePath = location.state?.complaintPath || ['Classroom', 'Academic Block', 'Floor'];

  // Generate class cards (1-10)
  const classes = Array.from({ length: 10 }, (_, i) => ({
    id: `${floorPrefix}${i + 1}`,
    name: `Class ${floorPrefix.toUpperCase()}${i + 1}`,
    type: 'class'
  }));

  // Special rooms
  const specialRooms = [
    { id: 'washroom', name: 'Washroom', type: 'washroom' },
    { id: 'lab', name: 'Lab', type: 'other' },
    { id: 'hod', name: 'HOD Office', type: 'other' }
  ];

  const allRooms = [...classes, ...specialRooms];

  const handleRoomSelection = (room) => {
    const updatedPath = [...basePath, room.name];

    if (room.type === 'washroom') {
      navigate('/washroom-ff', { state: { complaintPath: updatedPath } });
    } else if (room.type === 'class') {
      navigate(`/${floorPrefix}f-classroom`, { state: { complaintPath: updatedPath } });
    } else {
      // HOD or Lab directly goes to final classroom form
      navigate('/classroom', { state: { complaintPath: updatedPath } });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600 mb-2">{basePath.join(' > ')}</p>
        <h1 className="text-3xl font-bold text-gray-800">Select Room / Location</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allRooms.map((room) => (
          <div 
            key={room.id}
            onClick={() => handleRoomSelection(room)}
            className="bg-white rounded border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer p-4 flex items-center space-x-3 group"
          >
            <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-sm
              ${room.type === 'class' ? 'bg-blue-100 text-blue-700' : ''}
              ${room.type === 'washroom' ? 'bg-cyan-100 text-cyan-700' : ''}
              ${room.type === 'other' ? 'bg-purple-100 text-purple-700' : ''}
            `}>
              {room.id.substring(0, 2).toUpperCase()}
            </div>
            <span className="font-medium text-gray-700 group-hover:text-blue-600">{room.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
