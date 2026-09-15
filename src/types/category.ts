export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription?: string | null;
}

export interface CategoryRequest {
  categoryName: string;
  categoryDescription?: string;
}
