export interface CreateBankMovementDto {
  date: string; // Date au format ISO 8601
  wording: string;
  amount: number;
}
