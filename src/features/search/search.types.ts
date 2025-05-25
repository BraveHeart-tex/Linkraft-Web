import { Nullable } from '@/lib/common.types';

export interface SearchResult {
  id: string;
  type: 'bookmark' | 'collection';
  url: string;
  title: string;
  description: Nullable<string>;
  rank: number;
}

export type SearchResultType = 'bookmark' | 'collection';

export interface SearchResponse {
  results: SearchResult[];
  nextCursor: Nullable<string>;
}
