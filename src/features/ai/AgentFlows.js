//import React from 'react';

// export default function AgentFlows() {
//   return (
//     <div className="w-full h-full">
//       <div className="w-full h-full pl-[100px]">
//         <div className="w-full h-full relative">
//           <iframe
//             src="http://34.121.176.86/agentflows"
//             style={{
//               width: 'calc(100vw - 100px)', // Subtract sidebar width
//               height: '100vh',
//               border: 'none',
//               position: 'fixed',
//               top: 0,
//               left: '100px', // Match the sidebar width
//               backgroundColor: 'white',
//               maxWidth: 'calc(1400px - 80px)', // Account for parent max-width and padding
//               margin: '0 auto',
//             }}
//             title="AgentFlows"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';

export default function AgentFlows() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full pl-[100px]">
        <div className="w-full h-full relative">
          <iframe
            src="http://34.121.176.86/agentflows"
            // src="http://localhost:8080/agentflows"
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
