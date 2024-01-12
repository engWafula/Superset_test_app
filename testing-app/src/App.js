import React, { useEffect, useState } from 'react';
import './App.css';
import { embedDashboard } from "@superset-ui/embedded-sdk";
import getToken from './getToken';

function App() {
  const [token, setToken] = useState();

  useEffect(() => {
    const fetchToken = async () => {
      const newToken = await getToken();
      setToken(newToken);
    };

    fetchToken();
    const intervalId = setInterval(fetchToken, 4 * 60 * 1000); // Refetch token every 4 minutes

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const dashboardContainer = document.getElementById("dashboard-container");

    if (dashboardContainer) {
      const placeholderDiv = document.getElementById("dashboard-placeholder");

      if (placeholderDiv) {
        // Replace content of the placeholder div with a new div
        const newDashboardContainer = document.createElement('div');
        newDashboardContainer.id = 'dashboard';
        dashboardContainer.replaceChild(newDashboardContainer, placeholderDiv);
      }

      if (token) {
        embedDashboard({
          id: "11e861a1-2985-497f-9597-672c463a1831",
          supersetDomain: "http://localhost:8080",
          mountPoint: document.getElementById("dashboard"),
          fetchGuestToken: () => token,
          dashboardUiConfig: {
            hideTitle: true,
            hideChartControls: true,
            hideTab: true,
            width: 1000
          },
        });
      }
    }
  }, [token]);

  useEffect(() => {
    const container = document.getElementById("dashboard");
    if (container && container.children[0]) {
      container.children[0].style.width = "100%";
      container.children[0].style.height = "800px";
      container.children[0].style.border = "none";
    }
  }, [token]);

  return (
    <div style={{ width: "100%", height: "100px" }}>
      <h1>TIMS Dashboard In React js</h1>
      <div id="dashboard-container" style={{ padding: "4px"}}>
        <div id="dashboard-placeholder" style={{ padding: "5px" }}>
          {/* Placeholder for the embedded dashboard */}
        </div>
      </div>
    </div>
  );
}

export default App;
