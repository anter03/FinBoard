export interface Company {
  id: number;             // bigint
  createdAt: string;      // datetime2
  deleted: boolean;       // bit
  name: string;           // varchar(100)
}
