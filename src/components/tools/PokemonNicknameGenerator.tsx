"use client";

import { useCallback, useMemo, useState } from "react";
import { POKEMON_TYPES, type PokemonType } from "@/types/pokemon";
import { titleToken } from "@/lib/pokemon-catalog";

function randomNumber() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0];
}

function randomIndex(length: number) {
  return randomNumber() % length;
}

const TYPE_WORDS: Record<PokemonType, string[]> = {
  normal: ["Fluff", "Whiskers", "Patch", "Tuft", "Bounce", "Dandy"],
  fire: ["Ember", "Blaze", "Cinder", "Kindle", "Flare", "Soot"],
  water: ["Splash", "Brook", "Marina", "Tide", "Puddle", "Reef"],
  electric: ["Volt", "Sparky", "Jolt", "Watt", "Static", "Amp"],
  grass: ["Sprout", "Ivy", "Bramble", "Clover", "Fern", "Thistle"],
  ice: ["Frost", "Icicle", "Powder", "Glacier", "Sleet", "Chilly"],
  fighting: ["Jab", "Combo", "Grappler", "Feint", "Bruiser", "Counter"],
  poison: ["Venom", "Toxin", "Stinger", "Ooze", "Nettle", "Fumes"],
  ground: ["Dusty", "Quake", "Burrow", "Muddy", "Grit", "Dune"],
  flying: ["Zephyr", "Gale", "Soar", "Draft", "Flutter", "Updraft"],
  psychic: ["Cosmo", "Rune", "Oracle", "Zen", "Mirage", "Lucid"],
  bug: ["Buzz", "Chrysa", "Weevil", "Nibbles", "Cocoon", "Chitter"],
  rock: ["Boulder", "Flint", "Pebble", "Shale", "Crag", "Rubble"],
  ghost: ["Spooks", "Wisp", "Umbra", "Haunt", "Phantom", "Lantern"],
  dragon: ["Draco", "Wyvern", "Scales", "Fang", "Talon", "Rex"],
  dark: ["Shade", "Rogue", "Dusk", "Trick", "Sly", "Umbra"],
  steel: ["Bolt", "Rivet", "Alloy", "Chrome", "Gear", "Anvil"],
  fairy: ["Pixie", "Tinker", "Glitter", "Bonbon", "Doodle", "Charm"],
};

const STYLES = {
  cute: {
    label: "Cute",
    patterns: [
      (word: string) => `${word}${pick(["y", "ie", "kins", "boo", "puff", "bear"])}`,
      () => pick(["Mochi", "Bubbles", "Pudding", "Nugget", "Sprinkles", "Wiggles", "Biscuit", "Dumpling", "Peanut", "Noodle"]),
      (word: string) => `Little ${word}`,
    ],
  },
  cool: {
    label: "Cool",
    patterns: [
      (word: string) => `${word}${pick(["storm", "fang", "strike", "wing", "pulse", "shade"])}`,
      () => pick(["Nova", "Echo", "Onyx", "Zenith", "Vortex", "Comet", "Rogue", "Cipher"]),
      (word: string) => `${word} Master`,
    ],
  },
  funny: {
    label: "Funny",
    patterns: [
      (word: string) => `Sir ${word}${pick(["ington", "worth", "bottom", "snout"])}`,
      () => pick(["Waffles", "Spud", "Greg", "Kevin", "Beans", "Toaster", "Pickle", "Gumbo", "Churro", "Bagel"]),
      (word: string) => `Captain ${word}`,
    ],
  },
  fierce: {
    label: "Fierce",
    patterns: [
      (word: string) => `${word}${pick(["reaper", "claw", "doom", "slayer", "fury", "rage"])}`,
      () => pick(["Havoc", "Warlord", "Nightfall", "Rampage", "Ironhide", "Dreadnought"]),
      (word: string) => `The ${word}`,
    ],
  },
} as const;

function pick<T>(items: readonly T[]): T {
  return items[randomIndex(items.length)];
}

type StyleKey = keyof typeof STYLES;

export function PokemonNicknameGenerator() {
  const [type, setType] = useState<PokemonType>("electric");
  const [style, setStyle] = useState<StyleKey>("cool");
  const [seed, setSeed] = useState(0);

  const nicknames = useMemo(() => {
    void seed;
    const words = TYPE_WORDS[type];
    const styleConfig = STYLES[style];
    const results = new Set<string>();
    let guard = 0;
    while (results.size < 9 && guard < 60) {
      results.add(styleConfig.patterns[randomIndex(styleConfig.patterns.length)](pick(words)));
      guard += 1;
    }
    return [...results];
  }, [seed, style, type]);

  const copy = useCallback((nickname: string) => {
    void navigator.clipboard?.writeText(nickname).catch(() => undefined);
  }, []);

  return (
    <section className="tool-shell nickname-tool">
      <div className="nickname-controls">
        <span className="eyebrow">POKÉMON TYPE</span>
        <h2>Match the nickname to the typing</h2>
        <p>Pick the Pokémon&apos;s primary type and the vibe you want, then copy whichever nickname fits.</p>
        <div className="wheel-type-grid">
          {POKEMON_TYPES.map((option) => (
            <button type="button" data-type={option} aria-pressed={type === option} className={type === option ? "selected" : ""} onClick={() => setType(option)} key={option}>
              <span className="type-dot" />{titleToken(option)}
            </button>
          ))}
        </div>
        <div className="nickname-style-row" role="group" aria-label="Nickname style">
          {(Object.keys(STYLES) as StyleKey[]).map((key) => (
            <button type="button" aria-pressed={style === key} className={style === key ? "selected" : ""} onClick={() => { setStyle(key); setSeed((value) => value + 1); }} key={key}>
              {STYLES[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="nickname-results" data-type={type}>
        <div className="nickname-results-head">
          <span className="eyebrow">{STYLES[style].label.toUpperCase()} {titleToken(type).toUpperCase()} NICKNAMES</span>
          <button type="button" className="generate-button" onClick={() => setSeed((value) => value + 1)}>Generate again</button>
        </div>
        <ul className="nickname-grid">
          {nicknames.map((nickname) => (
            <li key={nickname}>
              <button type="button" onClick={() => copy(nickname)} title="Copy nickname">
                {nickname}
                <small>Click to copy</small>
              </button>
            </li>
          ))}
        </ul>
        <p className="nickname-note">Nicknames are suggestions only — rename freely at any Name Rater in your game.</p>
      </div>
    </section>
  );
}
