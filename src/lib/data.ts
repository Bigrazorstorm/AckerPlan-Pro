import { AreaChart, Bell, Eye, Tractor } from "lucide-react";

export const kpis = [
  {
    labelKey: "TotalRevenue",
    value: "€45,231.89",
    icon: AreaChart,
    change: "+20.1%",
    changeType: "increase",
  },
  {
    labelKey: "TotalCosts",
    value: "€28,102.50",
    icon: Tractor,
    change: "+12.5%",
    changeType: "increase",
  },
  {
    labelKey: "OpenObservations",
    value: "12",
    icon: Eye,
    change: "+2",
    changeType: "increase",
  },
  {
    labelKey: "MaintenanceDue",
    value: "3",
    icon: Bell,
    change: "1 overdue",
    changeType: "decrease",
  },
] as const;

export const chartData = [
    { month: "January", revenue: 1860, cost: 800 },
    { month: "February", revenue: 3050, cost: 1200 },
    { month: "March", revenue: 2370, cost: 980 },
    { month: "April", revenue: 730, cost: 300 },
    { month: "May", revenue: 2090, cost: 1100 },
    { month: "June", revenue: 2140, cost: 1300 },
    { month: "July", revenue: 8500, cost: 2500 },
    { month: "August", revenue: 12050, cost: 3400 },
    { month: "September", revenue: 9800, cost: 2900 },
    { month: "October", revenue: 2500, cost: 1100 },
    { month: "November", revenue: 1800, cost: 700 },
    { month: "December", revenue: 500, cost: 200 },
];

export const recentActivities = [
  { id: 1, type: "Harvesting", field: "Field A-12", date: "2 days ago", status: "Completed" },
  { id: 2, type: "Fertilizing", field: "Field C-04", date: "3 days ago", status: "Completed" },
  { id: 3, type: "Pest Control", field: "Field B-08", date: "4 days ago", status: "Completed" },
  { id: 4, type: "Seeding", field: "Field D-01", date: "1 week ago", status: "In Progress" },
  { id: 5, type: "Tillage", field: "Field F-21", date: "2 weeks ago", status: "Completed" },
];

export const machinery = [
  { id: 'M001', name: "John Deere 8R 370", type: "Tractor", model: "8R 370", status: "Operational", nextService: "In 250h", lastMaintenance: "2024-05-10" },
  { id: 'M002', name: "Claas Lexion 8900", type: "Combine Harvester", model: "Lexion 8900", status: "Maintenance Due", nextService: "Now (3000h)", lastMaintenance: "2023-09-15" },
  { id: 'M003', name: "Fendt 942 Vario", type: "Tractor", model: "942 Vario", status: "Operational", nextService: "In 450h", lastMaintenance: "2024-03-22" },
  { id: 'M004', name: "Amazone Catros XL", type: "Tillage", model: "Catros 6003-2TXL", status: "Operational", nextService: "2025-01-10", lastMaintenance: "2024-01-10" },
  { id: 'M005', name: "Horsch Maestro 12.50 SW", type: "Seeding", model: "Maestro 12.50 SW", status: "In Workshop", nextService: "After Repair", lastMaintenance: "2024-04-01" },
  { id: 'M006', name: "Krone Big Pack 1290", type: "Baler", model: "Big Pack 1290", status: "Operational", nextService: "In 120h", lastMaintenance: "2024-06-01" },
];
