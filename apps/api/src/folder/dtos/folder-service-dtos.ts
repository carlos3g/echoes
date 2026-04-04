export interface FolderServiceCreate {
  userId: number;
  name: string;
  description?: string | null;
  color?: string | null;
  visibility?: 'PUBLIC' | 'PRIVATE';
}
