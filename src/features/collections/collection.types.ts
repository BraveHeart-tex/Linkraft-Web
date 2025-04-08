export interface Collection {
  id: number;
  name: string;
  userId: number;
  description: string;
  createdAt: Date;
  isDeleted: boolean;
  color: string;
}
