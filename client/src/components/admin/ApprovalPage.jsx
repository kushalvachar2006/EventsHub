const ApprovalsPage = () => {
  const [requests, setRequests] = useState(MOCK_PERMISSION_REQUESTS);

  const handleApprove = (id) => {
    setRequests(requests.filter(r => r.id !== id));
    alert('Request approved successfully!');
  };

  const handleReject = (id) => {
    setRequests(requests.filter(r => r.id !== id));
    alert('Request rejected.');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Permission Requests
        </h1>
        <p className="text-gray-600 text-lg">
          Review and approve student permission requests
        </p>
      </div>
      
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <ApprovalCard
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No pending permission requests at the moment.</p>
        </div>
      )}
    </div>
  );
};