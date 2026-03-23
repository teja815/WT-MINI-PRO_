import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiPost } from '../../lib/api';
import { uploadIssuePhoto } from '../../lib/upload';
import { useAuth } from '../../context/AuthContext';

export default function FinalComplaintForm({ hidePhotoUpload = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  
  const complaintPath = location.state?.complaintPath || [];
  // Derive category from the first element of path, default to 'classroom' if not found
  const rootCategory = complaintPath.length > 0 ? complaintPath[0].toLowerCase() : 'classroom';

  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);

  async function submitIssue(e) {
    e.preventDefault();
    setErr('');
    if (!desc.trim() || desc.trim().length < 10) {
      setErr('Please enter a description (min 10 characters).');
      return;
    }
    setSubmitting(true);
    try {
      let photoUrl = '';
      if (file && !hidePhotoUpload) {
        photoUrl = await uploadIssuePhoto(file, { uid: firebaseUser.uid });
      }
      await apiPost('/api/issues', { 
        category: rootCategory, 
        description: desc.trim(), 
        photoUrl,
        complaintPath 
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/complaints'); // Redirect to dashboard after success
      }, 2000);
    } catch (e2) {
      setErr(e2?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fadeIn">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Complaint Submitted Successfully!</h2>
        <p className="text-gray-500">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      {complaintPath.length > 0 && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-1">Issue Location</p>
          <div className="flex flex-wrap items-center gap-2 text-blue-600 font-medium">
            {complaintPath.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span>{crumb}</span>
                {idx < complaintPath.length - 1 && <span>&gt;</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="card p-8 border border-gray-100 shadow-xl rounded-2xl">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 border-b pb-4">
          Submit Issue Details
        </h1>

        <form onSubmit={submitIssue} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Description</label>
            <textarea
              className="w-full text-gray-800 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-3"
              rows={5}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Explain the issue clearly (min 10 characters)..."
            />
          </div>

          {!hidePhotoUpload && (
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">Photo (optional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    {file && <p className="mt-2 text-sm font-bold text-blue-600">{file.name}</p>}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
          )}

          {err && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-start gap-2">
              <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {err}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4">
            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Status will be pending until admin approves.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
