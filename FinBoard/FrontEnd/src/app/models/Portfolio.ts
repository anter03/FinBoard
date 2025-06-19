export interface Portfolio {
  id: number;                   // bigint
  createdAt: string;            // datetime2(6)
  deleted: boolean;             // bit
  name: string;                 // varchar(50)
  companyId?: number | null;    // bigint nullable (FK a company)
  userId?: number | null;       // bigint nullable (FK a user)
}
