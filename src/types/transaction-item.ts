export type TransactionItemPostType =
  | "LOST"
  | "FOUND";

export interface TransactionItemLocation {
  locationId: number;
  locationName: string;
  isCentralStation: boolean;
  centralStationName: string | null;
}

export interface TransactionItemCategory {
  categoryId: number;
  categoryName: string;
}

export interface TransactionItemUser {
  userId: number;
  userName: string;
  userPhoneNumber: string | null;
  userLineId: string | null;
}

export interface TransactionItemListItem {
  transactionItemId: number;
  imageUrl: string[];
  transactionItemsPostType: TransactionItemPostType;
  transactionItemsName: string;
  transactionItemReferenceTag: string | null;
  transactionItemsLocationDetails: string | null;
  transactionItemsDate: string;
  transactionItemsStorageType: string;
  currentStatus?:
    | "PENDING"
    | "FOUNDED"
    | "IN_CENTER"
    | "RETURNED";
  location: TransactionItemLocation | null;
  categories: TransactionItemCategory | null;
  users: TransactionItemUser | null;
  receiverName?: string | null;
}

export type TransactionItemStorageType =
  | "SELF"
  | "CENTRAL";

export interface CreateTransactionItemInput {
  locationId: number;
  categoryId: number;
  transactionItemsPostType: TransactionItemPostType;
  transactionItemsName: string;
  transactionItemsLocationDetails: string;
  transactionItemsStorageType?: TransactionItemStorageType;
  images?: File[];
}
