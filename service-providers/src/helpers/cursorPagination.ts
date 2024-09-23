import { defaultCursor, pgMaxLimit, pgMinLimit } from "../config";
import {
  CursorInputInterface,
  CursorInterface,
  CursorPaginationOrderSearchExtend,
  PageInfoInterface,
  InputCursorInterface,
} from "@src/interfaces";
import { Base64 } from ".";
import { SortEnum } from "../enums";

class CursorPagination {
  private static instance: CursorPagination;

  private constructor() {}

  static get(): CursorPagination {
    if (!CursorPagination.instance) CursorPagination.instance = new CursorPagination();

    return CursorPagination.instance;
  }

  public cursor({ cursorCount, count, rows, cursor, limit }: CursorInputInterface): {
    data: CursorInterface[];
    pageInfo: PageInfoInterface;
  } {
    return {
      data: this.addCursor(rows),
      pageInfo: this.getPageInfo({
        rows,
        cursor,
        limit,
        cursorCount,
        count,
      }),
    };
  }

  public addCursor(rows: any[]): CursorInterface[] {
    return rows.map((row: any) => ({
      cursor: Base64.encodeCursor(row[defaultCursor]),
      node: row,
    }));
  }

  private getPageInfo({ cursorCount, cursor, count, rows }: CursorInputInterface): PageInfoInterface {
    const edges = this.addCursor(rows);
    const [start] = edges;
    const end = edges[edges.length - 1];
    const remaining = cursorCount - edges.length;

    const hasNextPage = (!cursor && remaining > 0) || (Boolean(cursor) && count - cursorCount > 0 && remaining > 0);

    const hasPreviousPage = (Boolean(cursor) && remaining >= 0) || (!cursor && count - cursorCount > 0);

    return {
      count: count,
      endCursor: end?.cursor,
      hasNextPage: hasNextPage,
      hasPreviousPage: hasPreviousPage,
      startCursor: start?.cursor,
    };
  }

  public getCursorQuery({
    before,
    after,
    first,
    last,
    query,
    sort,
    order,
  }: CursorPaginationOrderSearchExtend): CursorPaginationOrderSearchExtend {
    let cursor: string | undefined, limit: number, cursorSort: SortEnum, cursorOrder: string;
    cursor = before
      ? Base64.decodeCursor(before)
      : after
      ? Base64.decodeCursor(after)
      : last
      ? undefined
      : first
      ? undefined
      : undefined;
    limit = last ? Math.min(last, pgMaxLimit) : first ? Math.min(first, pgMaxLimit) : pgMinLimit;
    cursorOrder = defaultCursor;
    cursorSort = before || last ? SortEnum.ASC : after || first ? SortEnum.DESC : SortEnum.DESC;
    sort = sort ? sort : undefined;
    order = order ? order : undefined;
    query = query ? query : undefined;

    return { cursor, limit, order, sort, cursorOrder, cursorSort, query };
  }

  public cursorV2({ cursorCount, count, rows, cursor, cursorOrder, order }: InputCursorInterface): {
    edges: CursorInterface[];
    pageInfo: PageInfoInterface;
  } {
    const edges = this.addCursorV2(rows, cursorOrder, order);
    const [start] = edges;
    const end = edges[edges.length - 1];
    const remaining = cursorCount - edges.length;

    const hasNextPage = (!cursor && remaining > 0) || (Boolean(cursor) && count - cursorCount > 0 && remaining > 0);

    const hasPreviousPage = (Boolean(cursor) && remaining >= 0) || (!cursor && count - cursorCount > 0);

    return {
      edges: edges,
      pageInfo: {
        count: count,
        endCursor: end?.cursor,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        startCursor: start?.cursor,
      },
    };
  }

  private addCursorV2(rows: any[], cursorOrder: string, order?: string): CursorInterface[] {
    return rows.map((row) => {
      const cursor = new Map();
      cursor.set(cursorOrder, row.id);
      if (order) {
        cursor.set(order, row[order!]);
      }
      return {
        cursor: Base64.encodeCursor(JSON.stringify(Object.fromEntries(cursor))),
        node: row,
      };
    });
  }
}

const cursorPagination = CursorPagination.get();
export { cursorPagination as CursorPagination };
