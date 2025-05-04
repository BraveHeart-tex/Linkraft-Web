import { Nullable } from '@/lib/common.types';

export interface SearchResult {
  id: string;
  type: 'bookmark' | 'tag' | 'collection';
  url: string;
  title: string;
  description: Nullable<string>;
  rank: number;
}

export interface SearchResponse {
  results: SearchResult[];
  nextCursor: Nullable<string>;
}
