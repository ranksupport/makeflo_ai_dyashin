// import React from 'react';
// import { AiOutlineUser } from 'react-icons/ai';
// import { Ctopbar } from "../../components/shell";
// import './AIPage.css';

// const Sidebar = ({ activeItem }) => {
//   return (
//     <div className="sidebar">
//       <nav className="sidebar-nav">
//         <ul className="sidebar-list">
//           <li className={`sidebar-item ${activeItem === "Agentflows" ? "active" : ""}`}>
//             <a href="/ai" className="sidebar-link">
//               <AiOutlineUser className="sidebar-icon" />
//               <span>Agentflows</span>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default function AIPage() {
//   return (
//     <div className="layout-wrapper">
//       <Ctopbar heading="AI" />
//       <div className="page-container">
//         <Sidebar activeItem="Agentflows" />
//         <div className="main-content">
//           <div className="iframe-container">
//             <iframe 
//               src="http://34.121.176.86/agentflows" 
//               scrolling="no"
//               title="Agentflows"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React from 'react';
// import { AiOutlineUser } from 'react-icons/ai';
// import { Ctopbar } from "../../components/shell";
// import './AIPage.css';

// const Sidebar = ({ activeItem }) => {
//   return (
//     <div className="sidebar">
//       <nav className="sidebar-nav">
//         <ul className="sidebar-list">
//           <li className={`sidebar-item ${activeItem === "Agentflows" ? "active" : ""}`}>
//             <a href="/ai" className="sidebar-link">
//               <AiOutlineUser className="sidebar-icon" />
//               <span>Agentflows</span>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default function AIPage() {
//   return (
//     <div className="layout-wrapper">
//       <Ctopbar heading="AI" />
//       <div className="page-container">
//         <Sidebar activeItem="Agentflows" />
//         <div className="main-content">
//           <div className="iframe-container">
//             <iframe 
//               src="http://34.121.176.86/agentflows" 
//               scrolling="no"
//               title="Agentflows"
//               className="custom-iframe"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






// import React, { useState, useEffect, useRef } from 'react';
// import { AiOutlineUser } from 'react-icons/ai';
// import { Ctopbar } from "../../components/shell";
// import './AIPage.css';

// const Sidebar = ({ activeItem, onAgentClick }) => {
//   return (
//     <div className="sidebar">
//       <nav className="sidebar-nav">
//         <ul className="sidebar-list">
//           <li className={`sidebar-item ${activeItem === "Agentflows" ? "active" : ""}`}>
//             <a href="/ai" className="sidebar-link" onClick={(e) => {
//               e.preventDefault();
//               onAgentClick();
//             }}>
//               <AiOutlineUser className="sidebar-icon" />
//               <span>Agentflows</span>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default function AIPage() {
//   const [isAgentView, setIsAgentView] = useState(false);
//   const iframeRef = useRef(null);

//   useEffect(() => {
//     const handleIframeLoad = () => {
//       const iframe = iframeRef.current;
//       if (iframe) {
//         try {
//           const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//           const agentCards = iframeDoc.querySelectorAll('[class*="agent"]');
//           agentCards.forEach(card => {
//             card.addEventListener('click', () => setIsAgentView(true));
//           });

//           // Add event listener for navigation within iframe
//           iframe.contentWindow.addEventListener('popstate', () => {
//             // Check if we're back on the main page
//             if (iframe.contentWindow.location.pathname === '/agentflows') {
//               setIsAgentView(false);
//             } else {
//               setIsAgentView(true);
//             }
//           });
//         } catch (error) {
//           console.error("Error accessing iframe content:", error);
//         }
//       }
//     };

//     const iframe = iframeRef.current;
//     if (iframe) {
//       iframe.addEventListener('load', handleIframeLoad);
//     }

//     return () => {
//       if (iframe) {
//         iframe.removeEventListener('load', handleIframeLoad);
//       }
//     };
//   }, []);

//   const handleMainView = () => {
//     setIsAgentView(!isAgentView);
//   };

//   return (
//     <div className="layout-wrapper">
//       <Ctopbar heading="AI" className={isAgentView ? 'show-header' : ''} />
//       <div className="page-container">
//         <Sidebar activeItem="Agentflows" onAgentClick={handleMainView} />
//         <div className="main-content">
//           <div className="iframe-container">
//             <iframe
//               ref={iframeRef}
//               src="http://34.121.176.86/agentflows"
//               scrolling="no"
//               title="Agentflows"
//               className={`custom-iframe ${isAgentView ? 'show-header' : ''}`}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect, useRef } from 'react';
// import { AiOutlineUser } from 'react-icons/ai';
// import { Ctopbar } from "../../components/shell";
// import './AIPage.css';

// const Sidebar = ({ activeItem, onAgentClick }) => {
//   return (
//     <div className="sidebar">
//       <nav className="sidebar-nav">
//         <ul className="sidebar-list">
//           <li className={`sidebar-item ${activeItem === "Agentflows" ? "active" : ""}`}>
//             <a href="/ai" className="sidebar-link" onClick={(e) => {
//               e.preventDefault();
//               onAgentClick();
//             }}>
//               <AiOutlineUser className="sidebar-icon" />
//               <span>Agentflows</span>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default function AIPage() {
//   const [isAgentView, setIsAgentView] = useState(false);
//   const iframeRef = useRef(null);

//   useEffect(() => {
//     const handleIframeLoad = () => {
//       const iframe = iframeRef.current;
//       if (iframe) {
//         try {
//           const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//           const agentCards = iframeDoc.querySelectorAll('[class*="agent"]');
//           agentCards.forEach(card => {
//             card.addEventListener('click', () => setIsAgentView(true));
//           });

//           // Add event listener for navigation within iframe
//           iframe.contentWindow.addEventListener('popstate', () => {
//             // Check if we're back on the main page
//             if (iframe.contentWindow.location.pathname === '/agentflows') {
//               setIsAgentView(false);
//             } else {
//               setIsAgentView(true);
//             }
//           });
//         } catch (error) {
//           console.error("Error accessing iframe content:", error);
//         }
//       }
//     };

//     const iframe = iframeRef.current;
//     if (iframe) {
//       iframe.addEventListener('load', handleIframeLoad);
//     }

//     return () => {
//       if (iframe) {
//         iframe.removeEventListener('load', handleIframeLoad);
//       }
//     };
//   }, []);

//   const handleMainView = () => {
//     setIsAgentView(!isAgentView);
//   };

//   return (
//     <div className="layout-wrapper">
//       <Ctopbar heading="AI" className={isAgentView ? 'show-header' : ''} />
//       <div className="page-container">
//         <Sidebar activeItem="Agentflows" onAgentClick={handleMainView} />
//         <div className="main-content">
//           <div className="iframe-container">
//             <iframe
//               ref={iframeRef}
//               src="http://34.121.176.86/agentflows"
//               scrolling="no"
//               title="Agentflows"
//               className={`custom-iframe ${isAgentView ? 'show-header' : ''}`}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect, useRef } from 'react';
// import { AiOutlineUser } from 'react-icons/ai';
// import { Ctopbar } from "../../components/shell";
// import './AIPage.css';

// const Sidebar = ({ activeItem, onAgentClick }) => {
//   return (
//     <div className="sidebar">
//       <nav className="sidebar-nav">
//         <ul className="sidebar-list">
//           <li className={`sidebar-item ${activeItem === "Agentflows" ? "active" : ""}`}>
//             <a href="/ai" className="sidebar-link" onClick={(e) => {
//               e.preventDefault();
//               onAgentClick();
//             }}>
//               <AiOutlineUser className="sidebar-icon" />
//               <span>Agentflows</span>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default function AIPage() {
//   const [isAgentView, setIsAgentView] = useState(false);
//   const iframeRef = useRef(null);

//   useEffect(() => {
//     const handleIframeLoad = () => {
//       const iframe = iframeRef.current;
//       if (iframe) {
//         try {
//           const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//           const agentCards = iframeDoc.querySelectorAll('[class*="agent"]');
//           agentCards.forEach(card => {
//             card.addEventListener('click', () => setIsAgentView(true));
//           });

//           // Add event listener for navigation within iframe
//           iframe.contentWindow.addEventListener('popstate', () => {
//             // Check if we're back on the main page
//             if (iframe.contentWindow.location.pathname === '/agentflows') {
//               setIsAgentView(false);
//             } else {
//               setIsAgentView(true);
//             }
//           });
//         } catch (error) {
//           console.error("Error accessing iframe content:", error);
//         }
//       }
//     };

//     const iframe = iframeRef.current;
//     if (iframe) {
//       iframe.addEventListener('load', handleIframeLoad);
//     }

//     return () => {
//       if (iframe) {
//         iframe.removeEventListener('load', handleIframeLoad);
//       }
//     };
//   }, []);

//   const handleMainView = () => {
//     setIsAgentView(!isAgentView);
//   };

//   return (
//     <div className="layout-wrapper">
//       <Ctopbar heading="AI" className={isAgentView ? 'show-header' : ''} />
//       <div className={`page-container ${isAgentView ? 'show-header' : ''}`}>
//         <Sidebar activeItem="Agentflows" onAgentClick={handleMainView} />
//         <div className="main-content">
//           <div className={`iframe-container ${isAgentView ? 'show-header' : ''}`}>
//             <iframe
//               ref={iframeRef}
//               src="http://34.121.176.86/agentflows"
//               scrolling="no"
//               title="Agentflows"
//               className={`custom-iframe ${isAgentView ? 'show-header' : ''}`}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }













// import React, { useState, useEffect, useRef } from 'react';
// import { AiOutlineUser } from 'react-icons/ai';
// import { Ctopbar } from "../../components/shell";
// import './AIPage.css';

// const Sidebar = ({ activeItem, onAgentClick }) => {
//   return (
//     <div className="sidebar">
//       <nav className="sidebar-nav">
//         <ul className="sidebar-list">
//           <li className={`sidebar-item ${activeItem === "Agentflows" ? "active" : ""}`}>
//             <a href="/ai" className="sidebar-link" onClick={(e) => {
//               e.preventDefault();
//               onAgentClick();
//             }}>
//               <AiOutlineUser className="sidebar-icon" />
//               <span>Agentflows</span>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default function AIPage() {
//   const [isAgentView, setIsAgentView] = useState(false);
//   const iframeRef = useRef(null);

//   useEffect(() => {
//     const handleIframeLoad = () => {
//       const iframe = iframeRef.current;
//       if (iframe) {
//         try {
//           const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//           const agentCards = iframeDoc.querySelectorAll('[class*="agent"]');
//           agentCards.forEach(card => {
//             card.addEventListener('click', () => setIsAgentView(true));
//           });

//           // Add event listener for navigation within iframe
//           iframe.contentWindow.addEventListener('popstate', () => {
//             // Check if we're back on the main page
//             if (iframe.contentWindow.location.pathname === '/agentflows') {
//               setIsAgentView(false);
//             } else {
//               setIsAgentView(true);
//             }
//           });
//         } catch (error) {
//           console.error("Error accessing iframe content:", error);
//         }
//       }
//     };

//     const iframe = iframeRef.current;
//     if (iframe) {
//       iframe.addEventListener('load', handleIframeLoad);
//     }

//     return () => {
//       if (iframe) {
//         iframe.removeEventListener('load', handleIframeLoad);
//       }
//     };
//   }, []);

//   const handleMainView = () => {
//     setIsAgentView(!isAgentView);
//   };

//   return (
//     <div className="layout-wrapper">
//       <Ctopbar heading="AI" className={isAgentView ? 'show-header' : ''} />
//       <div className="page-container">
//         <Sidebar activeItem="Agentflows" onAgentClick={handleMainView} />
//         <div className="main-content">
//           <div className="iframe-container">
//             <iframe
//               ref={iframeRef}
//               src="http://34.121.176.86/agentflows"
//               scrolling="no"
//               title="Agentflows"
//               className={`custom-iframe ${isAgentView ? 'show-header' : ''}`}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }












// import React, { useState, useEffect, useRef } from 'react';
// import { AiOutlineUser } from 'react-icons/ai';
// import { Ctopbar } from "../../components/shell";
// import './AIPage.css';

// const Sidebar = ({ activeItem, onAgentClick }) => {
//   return (
//     <div className="sidebar">
//       <nav className="sidebar-nav">
//         <ul className="sidebar-list">
//           <li className={`sidebar-item ${activeItem === "Agentflows" ? "active" : ""}`}>
//             <a href="/ai" className="sidebar-link" onClick={(e) => {
//               e.preventDefault();
//               onAgentClick();
//             }}>
//               <AiOutlineUser className="sidebar-icon" />
//               <span>Agentflows</span>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default function AIPage() {
//   const [isAgentView, setIsAgentView] = useState(false);
//   const iframeRef = useRef(null);

//   useEffect(() => {
//     const handleIframeLoad = () => {
//       const iframe = iframeRef.current;
//       if (iframe) {
//         try {
//           const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//           const agentCards = iframeDoc.querySelectorAll('[class*="agent"]');
//           agentCards.forEach(card => {
//             card.addEventListener('click', () => setIsAgentView(true));
//           });

//           // Add event listener for navigation within iframe
//           iframe.contentWindow.addEventListener('popstate', () => {
//             // Check if we're back on the main page
//             if (iframe.contentWindow.location.pathname === '/agentflows') {
//               setIsAgentView(false);
//             } else {
//               setIsAgentView(true);
//             }
//           });
//         } catch (error) {
//           console.error("Error accessing iframe content:", error);
//         }
//       }
//     };

//     const iframe = iframeRef.current;
//     if (iframe) {
//       iframe.addEventListener('load', handleIframeLoad);
//     }

//     return () => {
//       if (iframe) {
//         iframe.removeEventListener('load', handleIframeLoad);
//       }
//     };
//   }, []);

//   const handleMainView = () => {
//     setIsAgentView(!isAgentView);
//   };

//   return (
//     <div className="layout-wrapper">
//       <Ctopbar heading="AI-Agents" className={isAgentView ? 'show-header' : ''} />
//       <div className={`page-container ${isAgentView ? 'show-header' : ''}`}>
//         <Sidebar activeItem="Agentflows" onAgentClick={handleMainView} />
//         <div className="main-content">
//           <div className="iframe-container">
//             <iframe
//               ref={iframeRef}
//               src="http://34.121.176.86/agentflows"
//               scrolling="no"
//               title="Agentflows"
//               className={`custom-iframe ${isAgentView ? 'show-header' : ''}`}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// only redirect but page content is missing 
// import React, { useState, useEffect, useRef } from 'react';
// import { AiOutlineUser, AiOutlineMessage, AiOutlineTool } from 'react-icons/ai';
// import { Ctopbar } from "../../components/shell";
// import { routes } from '../../api-client/routes';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './AIPage.css';

// const Sidebar = ({ activeItem, onMenuClick }) => {
//   return (
//     <div className="sidebar">
//       <nav className="sidebar-nav">
//         <ul className="sidebar-list">
//           <li className={`sidebar-item ${activeItem === "chatflows" ? "active" : ""}`}>
//             <a 
//               href="/chatflows" 
//               className="sidebar-link" 
//               onClick={(e) => {
//                 e.preventDefault();
//                 onMenuClick("chatflows");
//               }}
//             >
//               <AiOutlineMessage className="sidebar-icon" />
//               <span>Chatflows</span>
//             </a>
//           </li>
//           <li className={`sidebar-item ${activeItem === "agentflows" ? "active" : ""}`}>
//             <a 
//               href="/agentflows" 
//               className="sidebar-link" 
//               onClick={(e) => {
//                 e.preventDefault();
//                 onMenuClick("agentflows");
//               }}
//             >
//               <AiOutlineUser className="sidebar-icon" />
//               <span>Agentflows</span>
//             </a>
//           </li>
//           <li className={`sidebar-item ${activeItem === "tools" ? "active" : ""}`}>
//             <a 
//               href="/tools" 
//               className="sidebar-link" 
//               onClick={(e) => {
//                 e.preventDefault();
//                 onMenuClick("tools");
//               }}
//             >
//               <AiOutlineTool className="sidebar-icon" />
//               <span>Tools</span>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default function AIPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeView, setActiveView] = useState("agentflows");
//   const [isDetailView, setIsDetailView] = useState(false);
//   const iframeRef = useRef(null);

//   useEffect(() => {
//     // Set active view based on current path
//     const path = location.pathname.split('/')[1];
//     if (path) {
//       setActiveView(path);
//     }
//   }, [location]);

//   useEffect(() => {
//     const handleIframeLoad = () => {
//       const iframe = iframeRef.current;
//       if (iframe) {
//         try {
//           const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//           const agentCards = iframeDoc.querySelectorAll('[class*="agent"]');
//           agentCards.forEach(card => {
//             card.addEventListener('click', () => setIsDetailView(true));
//           });

//           iframe.contentWindow.addEventListener('popstate', () => {
//             const currentPath = iframe.contentWindow.location.pathname;
//             if (currentPath === `/${activeView}`) {
//               setIsDetailView(false);
//             } else {
//               setIsDetailView(true);
//             }
//           });
//         } catch (error) {
//           console.error("Error accessing iframe content:", error);
//         }
//       }
//     };

//     const iframe = iframeRef.current;
//     if (iframe) {
//       iframe.addEventListener('load', handleIframeLoad);
//     }

//     return () => {
//       if (iframe) {
//         iframe.removeEventListener('load', handleIframeLoad);
//       }
//     };
//   }, [activeView]);

//   const handleMenuClick = (menuItem) => {
//     setActiveView(menuItem);
//     setIsDetailView(false);
//     navigate(`/${menuItem}`);
//   };

//   const getApiEndpoint = () => {
//     const baseUrl = window.location.origin;
//     switch (activeView) {
//       case "chatflows":
//         return `${baseUrl}${routes.GET_CHATFLOWS.URL}`;
//       case "tools":
//         return `${baseUrl}${routes.GET_TOOLS.URL}`;
//       case "agentflows":
//         return `${baseUrl}${routes.GET_AGENTFLOWS.URL}`;
//       default:
//         return `${baseUrl}${routes.GET_AI.URL}`;
//     }
//   };

//   return (
//     <div className="layout-wrapper">
//       <Ctopbar heading="AI-Agents" className={isDetailView ? 'show-header' : ''} />
//       <div className={`page-container ${isDetailView ? 'show-header' : ''}`}>
//         <Sidebar activeItem={activeView} onMenuClick={handleMenuClick} />
//         <div className="main-content">
//           <div className="iframe-container">
//             <iframe
//               ref={iframeRef}
//               src={getApiEndpoint()}
//               scrolling="no"
//               title={activeView}
//               className={`custom-iframe ${isDetailView ? 'show-header' : ''}`}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// auto select to the Chatflows is pending
// import React, { useState, useEffect } from 'react';
// import { AiOutlineUser, AiOutlineMessage, AiOutlineTool } from 'react-icons/ai';
// import { Ctopbar } from "../../components/shell";
// import { useNavigate, useLocation } from 'react-router-dom';
// import './AIPage.css';

// const Sidebar = ({ activeItem, onMenuClick }) => {
//   return (
//     <div className="sidebar">
//       <nav className="sidebar-nav">
//         <ul className="sidebar-list">
//           <li className={`sidebar-item ${activeItem === "chatflows" ? "active" : ""}`}>
//             <a 
//               href="/chatflows" 
//               className="sidebar-link" 
//               onClick={(e) => {
//                 e.preventDefault();
//                 onMenuClick("chatflows");
//               }}
//             >
//               <AiOutlineMessage className="sidebar-icon" />
//               <span>Chatflows</span>
//             </a>
//           </li>
//           <li className={`sidebar-item ${activeItem === "agentflows" ? "active" : ""}`}>
//             <a 
//               href="/agentflows" 
//               className="sidebar-link" 
//               onClick={(e) => {
//                 e.preventDefault();
//                 onMenuClick("agentflows");
//               }}
//             >
//               <AiOutlineUser className="sidebar-icon" />
//               <span>Agentflows</span>
//             </a>
//           </li>
//           <li className={`sidebar-item ${activeItem === "tools" ? "active" : ""}`}>
//             <a 
//               href="/tools" 
//               className="sidebar-link" 
//               onClick={(e) => {
//                 e.preventDefault();
//                 onMenuClick("tools");
//               }}
//             >
//               <AiOutlineTool className="sidebar-icon" />
//               <span>Tools</span>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default function AIPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeView, setActiveView] = useState("chatflows"); // Default to chatflows
//   const [isDetailView, setIsDetailView] = useState(false);

//   // useEffect(() => {
//   //   // Set active view based on current path or default to chatflows
//   //   const path = location.pathname.split('/')[1];
//   //   if (path) {
//   //     setActiveView(path);
//   //   } else {
//   //     navigate('/chatflows'); // Auto-redirect to chatflows if no path
//   //   }
//   // }, [location, navigate]);

//   useEffect(() => {
//     // Handle initial route and AI tab redirect
//     const path = location.pathname.split('/')[1];
    
//     // If path is 'ai' or empty, redirect to chatflows
//     if (!path || path === 'ai') {
//       navigate('/chatflows');
//       setActiveView('chatflows');
//     } else if (['chatflows', 'agentflows', 'tools'].includes(path)) {
//       setActiveView(path);
//     }
//   }, [location.pathname, navigate]);

//   const handleMenuClick = (menuItem) => {
//     setActiveView(menuItem);
//     setIsDetailView(false);
//     navigate(`/${menuItem}`);
//   };

//   const getIframeSrc = () => {
//     const baseUrl = "http://34.121.176.86"; // Your base URL
//     return `${baseUrl}/${activeView}`;
//   };

//   return (
//     <div className="layout-wrapper">
//       <Ctopbar heading="AI-Agents" className={isDetailView ? 'show-header' : ''} />
//       <div className={`page-container ${isDetailView ? 'show-header' : ''}`}>
//         <Sidebar activeItem={activeView} onMenuClick={handleMenuClick} />
//         <div className="main-content">
//           <div className="iframe-container">
//             <iframe
//               src={getIframeSrc()}
//               scrolling="no"
//               title={activeView}
//               className={`custom-iframe ${isDetailView ? 'show-header' : ''}`}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





















