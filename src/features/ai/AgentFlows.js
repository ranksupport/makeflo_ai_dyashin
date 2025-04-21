import React from 'react';
import { generateURL } from '../../commonFunctions';
import ROUTES from "../../constants";

const { agentflow } = ROUTES;

export default function AgentFlows() {  
  return (
    <div className="w-full h-full">
      <div className="w-full h-full pl-[100px]">
        <div className="w-full h-full relative">
          <iframe
           src={generateURL(agentflow)}
            style={{
              width: 'calc(100% - 100px)', 
              height: '100vh',
              border: 'none',
              position: 'fixed',
              top: 0,
              left: '100px',
              backgroundColor: 'white',
            }}
            title="AgentFlows"
          />
        </div>
      </div>
    </div>
  );
}
