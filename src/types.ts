export interface Result {
  name: string;
  value: number;
  message: string;
}

export interface Comment {
  text: string;
  results: Result[];
}
