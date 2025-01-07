import React from 'react';

export default function Tools() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full pl-[100px]">
        <div className="w-full h-full relative">
          <iframe
            src="http://34.121.176.86/tools"
            // src="http://localhost:8080/tools"
            style={{
              width: 'calc(100% - 100px)', // Dynamically adjust width based on the sidebar
              height: '100vh',
              border: 'none',
              position: 'fixed',
              top: 0,
              left: '100px', // Account for sidebar width
              backgroundColor: 'white',
            }}
            title="AgentFlows"
          />
        </div>
      </div>
    </div>
  );
}