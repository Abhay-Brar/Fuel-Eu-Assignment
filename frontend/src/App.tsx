import React, { useEffect, useState } from "react";
import axios from "axios";

type Route = {
  routeId: string;
  ghgIntensity: number;
  isBaseline?: boolean;
};

function App() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [comparison, setComparison] = useState<any[]>([]);
  const [cbData, setCbData] = useState<any[]>([]);
  const [bankAmount, setBankAmount] = useState<number>(0);
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [bankResult, setBankResult] = useState<any>(null);
  const [poolAmount, setPoolAmount] = useState<number>(0);
  const [poolResult, setPoolResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/routes")
      .then(res => setRoutes(res.data));
  }, []);

  const setBaseline = (id: string) => {
  axios.post(`http://localhost:5000/routes/${id}/baseline`)
    .then(() => {
      // refresh data
      return axios.get("http://localhost:5000/routes");
    })
    .then(res => setRoutes(res.data));
};
  const fetchComparison = () => {
  axios.get("http://localhost:5000/routes/comparison")
    .then(res => setComparison(res.data));
};

const fetchCB = () => {
  axios.get("http://localhost:5000/compliance/cb")
    .then(res => setCbData(res.data));
};

const handleBank = () => {
  axios.post("http://localhost:5000/banking/bank", {
    routeId: selectedRoute,
    amount: bankAmount
  }).then(res => setBankResult(res.data));
};

const handleApply = () => {
  axios.post("http://localhost:5000/banking/apply", {
    routeId: selectedRoute,
    amount: bankAmount
  }).then(res => setBankResult(res.data));
};

const handlePoolBank = () => {
  axios.post("http://localhost:5000/pooling/bank", {
    amount: poolAmount
  }).then(res => setPoolResult(res.data));
};

const handlePoolApply = () => {
  axios.post("http://localhost:5000/pooling/apply", {
    amount: poolAmount
  }).then(res => setPoolResult(res.data));
};

const fetchHistory = () => {
  axios.get("http://localhost:5000/history")
    .then(res => setHistory(res.data));
};

  return (
    <div style={{ padding: "20px" }}>
    <h1>FuelEU Dashboard</h1>
    <button onClick={fetchComparison}>
      Show Comparison
    </button>

    <button onClick={fetchCB} style={{ marginLeft: "10px" }}>
      Show CB
    </button>

    <button onClick={fetchHistory} style={{ marginLeft: "10px" }}>
      Show History
    </button>

    {routes.map((route) => (
      <div key={route.routeId} style={{ marginBottom: "10px" }}>
        <strong>{route.routeId}</strong> - {route.ghgIntensity}
        {route.isBaseline && " (Baseline)"}

        <button
          style={{ marginLeft: "10px" }}
          onClick={() => setBaseline(route.routeId)}
        >
          Set Baseline
        </button>
      </div>
    ))}

    {comparison.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h2>Comparison</h2>

    <table border={1} cellPadding={10}>
      <thead>
        <tr>
          <th>Route</th>
          <th>GHG</th>
          <th>% Diff</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {comparison.map((item) => (
          <tr key={item.routeId}>
            <td>{item.routeId}</td>
            <td>{item.ghgIntensity}</td>
            <td>{item.percentDiff}%</td>
            <td>{item.compliant ? "✅" : "❌"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{cbData.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h2>Compliance Balance (CB)</h2>

    <table border={1} cellPadding={10}>
      <thead>
        <tr>
          <th>Route</th>
          <th>Energy</th>
          <th>CB</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {cbData.map((item) => (
          <tr key={item.routeId}>
            <td>{item.routeId}</td>
            <td>{item.energy}</td>
            <td>{item.cb}</td>
            <td>{item.cb >= 0 ? "✅" : "❌"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

<div style={{ marginTop: "40px" }}>
  <h2>Banking</h2>

  {/* Route selector */}
  <select onChange={(e) => setSelectedRoute(e.target.value)}>
    <option value="">Select Route</option>
    {routes.map((r) => (
      <option key={r.routeId} value={r.routeId}>
        {r.routeId}
      </option>
    ))}
  </select>

  {/* Amount input */}
  <input
    type="number"
    placeholder="Enter amount"
    onChange={(e) => setBankAmount(Number(e.target.value))}
    style={{ marginLeft: "10px" }}
  />

  {/* Buttons */}
  <button onClick={handleBank} style={{ marginLeft: "10px" }}>
    Bank
  </button>

  <button onClick={handleApply} style={{ marginLeft: "10px" }}>
    Apply
  </button>

  {/* Result */}
  {bankResult && (
    <div style={{ marginTop: "10px" }}>
      <pre>{JSON.stringify(bankResult, null, 2)}</pre>
    </div>
  )}
</div>


<div style={{ marginTop: "40px" }}>
  <h2>Pooling</h2>

  {/* Input */}
  <input
    type="number"
    placeholder="Enter amount"
    onChange={(e) => setPoolAmount(Number(e.target.value))}
  />

  {/* Buttons */}
  <button onClick={handlePoolBank} style={{ marginLeft: "10px" }}>
    Add to Pool
  </button>

  <button onClick={handlePoolApply} style={{ marginLeft: "10px" }}>
    Use from Pool
  </button>

  {/* Result */}
  {poolResult && (
    <div style={{ marginTop: "10px" }}>
      <pre>{JSON.stringify(poolResult, null, 2)}</pre>
    </div>
  )}
</div>

{history.length > 0 && (
  <div style={{ marginTop: "40px" }}>
    <h2>History</h2>

    <table border={1} cellPadding={10}>
      <thead>
        <tr>
          <th>Type</th>
          <th>Route</th>
          <th>Amount</th>
          <th>Time</th>
        </tr>
      </thead>

      <tbody>
        {history.map((item, index) => (
          <tr key={index}>
            <td>{item.type}</td>
            <td>{item.routeId || "-"}</td>
            <td>{item.amount || "-"}</td>
            <td>{new Date(item.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

  </div>
  );
}

export default App;