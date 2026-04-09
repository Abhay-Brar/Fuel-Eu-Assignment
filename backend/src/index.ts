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

// start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});