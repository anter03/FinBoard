export interface Instrument {
  id: number;                    // bigint
  currency: string;             // varchar(10)
  isin?: string | null;         // varchar(20) nullable
  name: string;                 // varchar(100)
  instrumentTypeId: number;     // bigint (FK a instrument_type)
  instrumentTypeDescription: string;     // bigint (FK a instrument_type)
}
