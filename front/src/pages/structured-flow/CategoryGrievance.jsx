import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CategoryGrievance({ category }) {
  const location = useLocation();
  const navigate = useNavigate();
  const complaintPath = location.state?.complaintPath || [category];

  const handleProceed = () => {
    // Navigate to respective route. For Classroom, it goes to academic blocks.
    if (category === 'Classroom') {
      // It's handled by ClassroomBlock page for Classroom, but if it ends up here by mistake, redirect.
      navigate('/classroom-grievance');
    } else {
      // For Mess and Hostel, maybe redirect straight to the final complaint form since no blocks are defined.
      navigate('/classroom', { state: { complaintPath } }); // reusing the form component route
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{category} Grievance</h1>
        <p className="text-gray-500">You are reporting under {complaintPath.join(' > ')}</p>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={handleProceed}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Proceed to Complaint Form
        </button>
      </div>
    </div>
  );
}
