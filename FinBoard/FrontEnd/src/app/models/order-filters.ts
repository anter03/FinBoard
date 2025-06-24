export interface OrderFilters {
  id: string | null;
  isin: string | null;
  quantity: string | null;
  portfolio: string | null;
  operationDateFrom: string | null;
  operationDateTo: string | null;
  valueDateFrom: string | null;
  valueDateTo: string | null;
  status: string | null;
  currency: string | null;
  side: string | null;
}
