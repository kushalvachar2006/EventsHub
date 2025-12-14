import React from 'react';
import { Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { formatDate } from '../../utils/date';

const ApprovalCard = ({ request, onApprove, onReject }) => {
  const student = request.student || {};
  const event = request.event || {};
  const teamMembers = Array.isArray(request.teamMembers) ? request.teamMembers : [];
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{student.name} ({student.email})</h3>
          <p className="text-sm text-gray-600">{student.department ? `${student.department} • ` : ''}{student.college}</p>
          <p className="text-sm text-gray-600 mt-2">
            Event: <span className="text-indigo-600 font-semibold">{event.title}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {event.date ? formatDate(event.date) : ''} • {event.location}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
          <Clock className="h-3 w-3" />
          {request.status}
        </span>
      </div>

      <div className="bg-gray-50 border-l-4 border-indigo-500 p-4 rounded-lg mb-4">
        <p className="text-gray-700 text-sm italic">"{request.reasonForAttending}"</p>
      </div>

      {teamMembers.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Users className="h-4 w-4" /> Team Members
          </div>
          <ul className="text-sm text-gray-700 list-disc pl-5">
            {teamMembers.map((m, idx) => (
              <li key={idx}>{m.name} {m.email ? `(${m.email})` : ''} {m.role ? `– ${m.role}` : ''}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onReject(request._id)}
          className="w-full sm:flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
        >
          <XCircle className="h-4 w-4" />
          Reject
        </button>
        <button
          onClick={() => onApprove(request._id)}
          className="w-full sm:flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Approve
        </button>
      </div>
    </div>
  );
};

export default ApprovalCard;