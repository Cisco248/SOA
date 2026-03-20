enum StatusMethods {
  PENDING = "badge-pending",
  PROCESSING = "badge-process",
  SHIPPED = "badge-shipped",
  COMPLETE = "badge-complete",
  CANCELLED = "badge-cancel",
}

enum LevelMethods {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  date: string;
  amount: number;
  status: keyof typeof StatusMethods;
  priority: keyof typeof LevelMethods;
  urgent: boolean;
}

export interface Filters {
  search: string;
  status: string;
  priority: string;
}

export { StatusMethods, LevelMethods };
