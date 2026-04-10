import React, { useEffect, useState } from "react";
import axios from "axios";

type Route = {
  routeId: string;
  ghgIntensity: number;
  isBaseline?: boolean;
};

function App() {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/routes")
      .then(res => setRoutes(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>FuelEU Dashboard</h1>

      {routes.map((route) => (
        <div key={route.routeId} style={{ marginBottom: "10px" }}>
          <strong>{route.routeId}</strong> - {route.ghgIntensity}
          {route.isBaseline && " (Baseline)"}
        </div>
      ))}
    </div>
  );
}

export default App;