import { SortEnum } from "@src/enums";

export interface PaginationExtend {
  offset: number;
  limit: number;
}

export interface OrderExtend {
  sort: SortEnum;
  order: string;
}

export interface SearchExtend {
  query?: string;
}

export interface PaginationOrderSearchExtend
  extends PaginationExtend,
    OrderExtend,
    SearchExtend {}
