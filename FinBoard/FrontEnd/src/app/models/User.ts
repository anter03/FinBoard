export interface User {
  id: number;               // bigint
  companyId: number;        // bigint (FK a company)
  createdAt: string;        // datetime2(6)
  deleted: boolean;         // bit
  email: string;            // varchar(100)
  username: string;         // varchar(50)
}
