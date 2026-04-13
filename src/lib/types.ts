export type Location = { name: string; lat: number; lng: number };

export type Message = {
  role: "user" | "assistant";
  content: string;
  locations?: Location[];
};
