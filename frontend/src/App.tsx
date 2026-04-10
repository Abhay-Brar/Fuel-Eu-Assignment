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

  return(
  <div className="min-h-screen bg-gray-100 p-6">
    <h1 className="text-3xl font-bold mb-6">FuelEU Dashboard</h1>

    {/* Top Controls */}
    <div className="flex gap-4 mb-6">
      <button onClick={fetchComparison} className="bg-blue-500 text-white px-4 py-2 rounded">
        Comparison
      </button>
      <button onClick={fetchCB} className="bg-green-500 text-white px-4 py-2 rounded">
        Compliance
      </button>
      <button onClick={fetchHistory} className="bg-purple-500 text-white px-4 py-2 rounded">
        History
      </button>
    </div>

    {/* Routes Card */}
    <div className="bg-white p-5 rounded-2xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Routes</h2>

      {routes.map(route => (
        <div key={route.routeId} className="flex justify-between items-center mb-3">
          <div>
            <span className="font-medium">{route.routeId}</span> — {route.ghgIntensity}
            {route.isBaseline && (
              <span className="ml-2 text-green-600 font-semibold">Baseline</span>
            )}
          </div>

          <button
            onClick={() => setBaseline(route.routeId)}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            Set Baseline
          </button>
        </div>
      ))}
    </div>

    {/* Banking */}
    <div className="bg-white p-5 rounded-2xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Banking</h2>

      <div className="flex gap-3">
        <select
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Route</option>
          {routes.map(r => (
            <option key={r.routeId} value={r.routeId}>
              {r.routeId}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          onChange={(e) => setBankAmount(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <button onClick={handleBank} className="bg-blue-500 text-white px-3 rounded">
          Bank
        </button>

        <button onClick={handleApply} className="bg-green-500 text-white px-3 rounded">
          Apply
        </button>
      </div>

      {bankResult && (
        <div className="mt-3 text-sm bg-gray-100 p-2 rounded">
          {JSON.stringify(bankResult)}
        </div>
      )}
    </div>

    {/* Pooling */}
    <div className="bg-white p-5 rounded-2xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Pooling</h2>

      <div className="flex gap-3">
        <input
          type="number"
          placeholder="Amount"
          onChange={(e) => setPoolAmount(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <button onClick={handlePoolBank} className="bg-purple-500 text-white px-3 rounded">
          Add
        </button>

        <button onClick={handlePoolApply} className="bg-red-500 text-white px-3 rounded">
          Use
        </button>
      </div>

      {poolResult && (
        <div className="mt-3 text-sm bg-gray-100 p-2 rounded">
          {JSON.stringify(poolResult)}
        </div>
      )}
    </div>

    {/* Comparison */}
    {comparison.length > 0 && (
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Comparison</h2>

        {comparison.map(item => (
          <div key={item.routeId} className="flex justify-between border-b py-2">
            <span>{item.routeId}</span>
            <span>{item.percentDiff}%</span>
            <span>{item.compliant ? "✅" : "❌"}</span>
          </div>
        ))}
      </div>
    )}

    {/* Compliance */}
    {cbData.length > 0 && (
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Compliance Balance</h2>

        {cbData.map(item => (
          <div key={item.routeId} className="flex justify-between border-b py-2">
            <span>{item.routeId}</span>
            <span>{item.cb}</span>
            <span>{item.cb >= 0 ? "✅" : "❌"}</span>
          </div>
        ))}
      </div>
    )}

    {/* History */}
    {history.length > 0 && (
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Activity</h2>

        <div className="space-y-2">
          {history.map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded border">
              <div>
                {item.type === "BANK" && `🟢 Banked ${item.amount} for ${item.routeId}`}
                {item.type === "APPLY" && `🔵 Applied ${item.amount} for ${item.routeId}`}
                {item.type === "POOL_ADD" && `🟣 Added ${item.amount} to pool`}
                {item.type === "POOL_USE" && `🔴 Used ${item.amount} from pool`}
                {item.type === "BASELINE_SET" && `⭐ Baseline set to ${item.routeId}`}
              </div>

              <div className="text-xs text-gray-500">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

}

export default App;