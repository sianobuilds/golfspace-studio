export type Equipment = {
  id: string;
  name: string;
  category: string;
  price: number;
  width: number;
  height: number;
  color: string;
  description: string;
};

export const equipment: Equipment[] = [
  { id: "screen", name: "Impact Screen Pro", category: "Screens", price: 4200000, width: 260, height: 32, color: "#536f61", description: "Commercial-grade projection enclosure" },
  { id: "monitor", name: "Launch Monitor X1", category: "Sensors", price: 7800000, width: 65, height: 45, color: "#a8b6b0", description: "Precision ball and club tracking" },
  { id: "mat", name: "Performance Hitting Mat", category: "Hitting Mats", price: 950000, width: 130, height: 85, color: "#6b8b6a", description: "Premium impact-absorbing turf" },
  { id: "projector", name: "Laser Projector 4K", category: "Projectors", price: 3100000, width: 80, height: 50, color: "#9aa4a3", description: "High-brightness short-throw projection" },
  { id: "sofa", name: "Lounge Seating", category: "Furniture", price: 1350000, width: 115, height: 60, color: "#b69a7b", description: "Premium customer lounge seating" },
  { id: "kiosk", name: "Control Kiosk", category: "Controls", price: 1850000, width: 65, height: 65, color: "#536978", description: "Integrated touchscreen control station" },
];

export const currency = (value: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
