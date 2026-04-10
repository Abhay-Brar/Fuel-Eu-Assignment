import express from "express";
import cors from "cors";

type Route = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline?: boolean;
};

const routes: Route[] = [
  {
    routeId: "R001",
    vesselType: "Container",
    fuelType: "HFO",
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    isBaseline: true,
  },
  {
    routeId: "R002",
    vesselType: "BulkCarrier",
    fuelType: "LNG",
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200,
    isBaseline: false,
  },
];

const app = express();



// middleware
app.use(cors());
app.use(express.json());

const banked: Record<string, number> = {}; // route-specific bank

let pool: number = 0; // shared pool
// test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/routes", (req, res) => {
  res.json(routes);
});

app.post("/routes/:id/baseline", (req, res) => {
  const routeId = req.params.id;

  routes.forEach((route) => {
    if (route.routeId === routeId) {
      route.isBaseline = true;
    } else {
      route.isBaseline = false;
    }
  });

  res.json({
    message: "Baseline updated",
    routes
  });
});

app.get("/routes/comparison", (req, res) => {
  const baseline = routes.find((route) => route.isBaseline);

  if (!baseline) {
    return res.status(400).json({ message: "No baseline set" });
  }

  const target = 89.3368;

  const comparison = routes.map((route) => {
    const percentDiff =
      ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;

    const compliant = route.ghgIntensity <= target;

    return {
      routeId: route.routeId,
      ghgIntensity: route.ghgIntensity,
      percentDiff: percentDiff.toFixed(2),
      compliant,
      isBaseline: route.isBaseline
    };
  });

  res.json(comparison);
});

app.get("/compliance/cb", (req, res) => {
  const target = 89.3368;

  const result = routes.map((route) => {
    const energy = route.fuelConsumption * 41000;

    const cb = (target - route.ghgIntensity) * energy;

    return {
      routeId: route.routeId,
      ghgIntensity: route.ghgIntensity,
      energy,
      cb: Math.round(cb)
    };
  });

  res.json(result);
});

// banking API

app.post("/banking/bank", (req, res) => {
  const { routeId, amount } = req.body;

  // 1️⃣ Validate input
  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be positive" });
  }

  // 2️⃣ Update banked state
  banked[routeId] = (banked[routeId] || 0) + amount;

  // 3️⃣ Return updated banked object
  res.json({
    message: "Banked successfully",
    banked
  });
});



app.post("/banking/apply", (req, res) => {
  const { routeId, amount } = req.body;

  const available = banked[routeId] || 0;

  if (amount > available) {
    return res.status(400).json({ message: "Not enough banked amount" });
  }

  // Safe deduction
  banked[routeId] = available - amount;

  res.json({
    message: "Applied successfully",
    remaining: banked[routeId]
  });
});

// pooling API

app.post("/pooling/bank", (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Amount must be positive" });
  pool += amount;
  res.json({ message: "Pooled successfully", pool });
});

app.post("/pooling/apply", (req, res) => {
  const { amount } = req.body;
  if (amount > pool) return res.status(400).json({ message: "Not enough in pool" });
  pool -= amount;
  res.json({ message: "Applied from pool successfully", remainingPool: pool });
});
// start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});