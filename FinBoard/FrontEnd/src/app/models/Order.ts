export interface Order {
  id: number;                    // bigint
  createdAt: string;             // datetime2(6)
  deleted: boolean;              // bit
  executedAt?: string | null;    // datetime2(6) nullable
  price?: number | null;         // numeric(18,4) nullable
  quantity: number;              // numeric(18,4)
  side: string;                  // varchar(4)
  status: string;                // varchar(20)
  instrumentId: number;          // bigint (FK)
  operatorId: number;            // bigint (FK)
  portfolioId: number;           // bigint (FK)
}
