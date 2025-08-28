import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function generateSessionLink(sessionId: string): string {
  return `${window.location.origin}/join/${sessionId}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function calculateProductTotal(
  unitPrice: number,
  quantity: number
): number {
  return unitPrice * quantity;
}

export function calculateFriendTotal(
  products: Array<{ unitPrice: number; quantity: number }>
): number {
  return products.reduce((total, product) => {
    return total + calculateProductTotal(product.unitPrice, product.quantity);
  }, 0);
}
