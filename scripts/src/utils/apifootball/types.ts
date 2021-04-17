export type FootballApiResponse<T> = {
  results: number;
  paging: Paging;
  response: T[];
  errors: ApiError;
};

type Paging = {
  current: number;
  total: number;
};

export type ApiError =
  | {
    [key: string]: string;
  }
  | string[];

export class RateLimitError extends Error {
  constructor(public readonly msg: string) {
    super(`RateLimitError: ${msg}`);
  }
}
