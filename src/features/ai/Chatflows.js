import React from "react";
import { generateURL } from "../../commonFunctions";
import ROUTES from "../../constants";

const { chatflow } = ROUTES;

export default function Chatflows() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full pl-[100px]">
        <div className="w-full h-full relative">
          <iframe
            src={generateURL(chatflow)}
            style={{
              width: 'calc(100% - 100px)',
              height: '100vh',
              border: 'none',
              position: 'fixed',
              top: 0,
              left: '100px',
              backgroundColor: 'white',
            }}
          />
        </div>
      </div>
    </div>
  );
}