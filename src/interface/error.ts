export interface ErrorResponse {
  request?: any;
  response?: { data: { error: string } };
  message?: string;
}
