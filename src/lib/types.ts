export type Location = { name: string; lat: number; lng: number };

export type Message = {
  role: "user" | "assistant";
  content: string;
  locations?: Location[];
};

export type Itinerary = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};