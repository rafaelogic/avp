import React from 'react';

function ProgressBar({ status }) {
  const steps = [
    'Sending prompt to AI',
    'Generating video',
    'Uploading to YouTube',
    'Uploading to Facebook',
    'Uploading to TikTok',
    'Done',
  ];

  const currentStep = steps.indexOf(status);

  if (currentStep === -1) {
    return null;
  }

  return (
    <div className="w-full max-w-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Progress</h2>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-green-500' : 'bg-gray-700'
              }`}
            >
              {index < currentStep ? (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : (
                <span className="text-white">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-700'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="mt-4 text-center">{status}</p>
    </div>
  );
}

export default ProgressBar;
