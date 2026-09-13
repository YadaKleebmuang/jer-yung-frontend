export interface TransactionItemDetailLocation {
  Location_id: number;
  Location_name: string;
  is_central_station: boolean;
  central_station_name: string | null;
}

export interface TransactionItemDetailCategory {
  category_id: number;
  category_name: string;
}

export interface TransactionItemDetailUser {
  user_id: number;
  user_name: string;
  user_phone_number: string | null;
  user_line_id: string | null;
}

export interface TransactionItemStatusLog {
  log_id: number;
  old_status: string | null;
  new_status: string;
  proof_evidence: string | null;
  receiver_name: string | null;
  changed_at: string;
  changed_by: string | null;
}

export interface TransactionItemDetail {
  Transaction_item_id: number;
  ImageUrl: string[];
  Transaction_items_post_type: "LOST" | "FOUND";
  Transaction_items_name: string;
  Transaction_item_reference_tag: string | null;
  Transaction_items_location_details: string | null;
  Transaction_items_date: string;
  Transaction_items_storage_type: string;
  Location: TransactionItemDetailLocation | null;
  Categories: TransactionItemDetailCategory | null;
  Users: TransactionItemDetailUser | null;
  Status_logs: TransactionItemStatusLog[];
}
