export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "gold";

export interface RarityConfig {
  label: string;
  chance: number; // percentage (0-100)
  value: number; // fixed dollar value of the card
}



export interface CaseItem {
  id: string;
  name: string;
  emoji: string;
  rarity: Rarity;
}

export interface CaseType {
  id: "animal" | "space" | "food" | "sports";
  name: string;
  price: number;
  icon: string;
  items: CaseItem[];
}


