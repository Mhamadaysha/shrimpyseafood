export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const STORAGE_KEY = "shrimpy-menu-items";

const defaultItems: MenuItem[] = [
  {
    id: "1",
    name: "Grilled Sea Bass",
    description: "Fresh Mediterranean sea bass grilled with herbs, lemon, and olive oil. Served with seasonal vegetables.",
    price: 28.99,
    category: "Grilled Fish",
    image: "",
  },
  {
    id: "2",
    name: "Jumbo Shrimp Platter",
    description: "A generous platter of jumbo shrimp, lightly seasoned and grilled to perfection.",
    price: 24.99,
    category: "Shrimp",
    image: "",
  },
  {
    id: "3",
    name: "Lobster Thermidor",
    description: "Classic lobster thermidor with creamy mustard sauce, gratinated with cheese.",
    price: 42.99,
    category: "Specialties",
    image: "",
  },
  {
    id: "4",
    name: "Seafood Soup",
    description: "Rich and hearty seafood soup with shrimp, mussels, calamari, and fresh herbs.",
    price: 14.99,
    category: "Soups & Starters",
    image: "",
  },
  {
    id: "5",
    name: "Calamari Rings",
    description: "Crispy fried calamari rings served with tartar sauce and lemon wedges.",
    price: 12.99,
    category: "Soups & Starters",
    image: "",
  },
  {
    id: "6",
    name: "Grilled Salmon Fillet",
    description: "Atlantic salmon fillet grilled with a honey-mustard glaze, served with mashed potatoes.",
    price: 26.99,
    category: "Grilled Fish",
    image: "",
  },
];

export function getMenuItems(): MenuItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
  return defaultItems;
}

export function saveMenuItems(items: MenuItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getCategories(items: MenuItem[]): string[] {
  return [...new Set(items.map((item) => item.category))];
}
