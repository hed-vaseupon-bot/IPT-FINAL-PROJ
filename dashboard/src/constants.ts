export const MENU_CATEGORIES = [
  'Appetizers',
  'Main Courses',
  'Desserts',
  'Beverages'
];

export type MenuCategory = typeof MENU_CATEGORIES[number];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  isAvailable?: boolean;
}