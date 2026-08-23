export type RegionSlug = "kanto" | "johto" | "hoenn" | "sinnoh" | "unova" | "kalos" | "alola" | "galar" | "paldea";

export interface RegionGuide {
  slug: RegionSlug;
  name: string;
  generation: number;
  dexRange: string;
  games: string[];
  starters: string[];
  legendaries: string[];
  representatives: string[];
  specialPreset: string;
}

export const REGION_GUIDES: RegionGuide[] = [
  { slug: "kanto", name: "Kanto", generation: 1, dexRange: "#001–151", games: ["Red", "Blue", "Yellow", "FireRed", "LeafGreen"], starters: ["bulbasaur", "charmander", "squirtle"], legendaries: ["articuno", "zapdos", "moltres", "mewtwo"], representatives: ["pikachu", "gengar", "lapras", "dragonite"], specialPreset: "Original 151" },
  { slug: "johto", name: "Johto", generation: 2, dexRange: "#152–251", games: ["Gold", "Silver", "Crystal", "HeartGold", "SoulSilver"], starters: ["chikorita", "cyndaquil", "totodile"], legendaries: ["raikou", "entei", "suicune", "lugia", "hooh"], representatives: ["ampharos", "scizor", "tyranitar", "umbreon"], specialPreset: "Gen 2 classics" },
  { slug: "hoenn", name: "Hoenn", generation: 3, dexRange: "#252–386", games: ["Ruby", "Sapphire", "Emerald", "Omega Ruby", "Alpha Sapphire"], starters: ["treecko", "torchic", "mudkip"], legendaries: ["regirock", "regice", "registeel", "latias", "latios", "kyogre", "groudon", "rayquaza"], representatives: ["gardevoir", "aggron", "flygon", "metagross"], specialPreset: "Weather legends" },
  { slug: "sinnoh", name: "Sinnoh", generation: 4, dexRange: "#387–493", games: ["Diamond", "Pearl", "Platinum", "Brilliant Diamond", "Shining Pearl"], starters: ["turtwig", "chimchar", "piplup"], legendaries: ["uxie", "mesprit", "azelf", "dialga", "palkia", "heatran", "regigigas", "giratina", "cresselia"], representatives: ["lucario", "garchomp", "roserade", "togekiss"], specialPreset: "Cross-generation evolutions" },
  { slug: "unova", name: "Unova", generation: 5, dexRange: "#494–649", games: ["Black", "White", "Black 2", "White 2"], starters: ["snivy", "tepig", "oshawott"], legendaries: ["cobalion", "terrakion", "virizion", "tornadus", "thundurus", "reshiram", "zekrom", "landorus", "kyurem"], representatives: ["zoroark", "chandelure", "haxorus", "volcarona"], specialPreset: "Largest new-species pool" },
  { slug: "kalos", name: "Kalos", generation: 6, dexRange: "#650–721", games: ["X", "Y"], starters: ["chespin", "fennekin", "froakie"], legendaries: ["xerneas", "yveltal", "zygarde"], representatives: ["talonflame", "aegislash", "sylveon", "goodra"], specialPreset: "Fairy-type debut" },
  { slug: "alola", name: "Alola", generation: 7, dexRange: "#722–809", games: ["Sun", "Moon", "Ultra Sun", "Ultra Moon"], starters: ["rowlet", "litten", "popplio"], legendaries: ["typenull", "silvally", "tapukoko", "tapulele", "tapubulu", "tapufini", "solgaleo", "lunala", "necrozma"], representatives: ["lycanroc", "mimikyu", "kommoo", "toxapex"], specialPreset: "Island challenge" },
  { slug: "galar", name: "Galar", generation: 8, dexRange: "#810–898", games: ["Sword", "Shield"], starters: ["grookey", "scorbunny", "sobble"], legendaries: ["zacian", "zamazenta", "eternatus", "kubfu", "urshifu", "regieleki", "regidrago", "glastrier", "spectrier", "calyrex"], representatives: ["corviknight", "toxtricity", "dragapult", "grimmsnarl"], specialPreset: "Galar species only" },
  { slug: "paldea", name: "Paldea", generation: 9, dexRange: "#906–1025", games: ["Scarlet", "Violet"], starters: ["sprigatito", "fuecoco", "quaxly"], legendaries: ["koraidon", "miraidon", "tinglu", "chienpao", "wochien", "chiyu", "ogerpon", "terapagos"], representatives: ["tinkaton", "ceruledge", "armarouge", "baxcalibur"], specialPreset: "Paradox-ready pool" },
];

export const REGION_BY_SLUG = Object.fromEntries(REGION_GUIDES.map((region) => [region.slug, region])) as Record<RegionSlug, RegionGuide>;
