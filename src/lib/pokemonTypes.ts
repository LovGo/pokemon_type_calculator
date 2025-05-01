export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export const POKEMON_TYPES: PokemonType[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export type CustomType = {
  name: string;
  weaknesses: (PokemonType | string)[];
  resistances: (PokemonType | string)[];
  immunities: (PokemonType | string)[];
};

// Function to check if two types have the same interactions
export function haveSameInteractions(
  type1: CustomType | PokemonType,
  type2: CustomType | PokemonType,
  customTypes: CustomType[]
): boolean {
  // Get the effectiveness calculations for both types
  const allTypes = [...POKEMON_TYPES, ...customTypes.map(t => t.name)];
  const effectiveness1: Record<string, number> = {};
  const effectiveness2: Record<string, number> = {};

  // Calculate effectiveness against all types for type1
  allTypes.forEach(attackType => {
    effectiveness1[attackType] = getCustomTypeEffectiveness(
      attackType,
      typeof type1 === 'string' ? type1 : type1.name,
      customTypes
    );
  });

  // Calculate effectiveness against all types for type2
  allTypes.forEach(attackType => {
    effectiveness2[attackType] = getCustomTypeEffectiveness(
      attackType,
      typeof type2 === 'string' ? type2 : type2.name,
      customTypes
    );
  });

  // Compare the effectiveness values
  return Object.entries(effectiveness1).every(
    ([type, value]) => effectiveness2[type] === value
  );
}

const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  normal: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 2,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 1,
    ghost: 0,
    dragon: 1,
    dark: 1,
    steel: 1,
    fairy: 1,
  },
  fire: {
    normal: 1,
    fire: 0.5,
    water: 2,
    electric: 1,
    grass: 0.5,
    ice: 0.5,
    fighting: 1,
    poison: 1,
    ground: 2,
    flying: 1,
    psychic: 1,
    bug: 0.5,
    rock: 2,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 0.5,
    fairy: 0.5,
  },
  water: {
    normal: 1,
    fire: 0.5,
    water: 0.5,
    electric: 2,
    grass: 2,
    ice: 0.5,
    fighting: 1,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 0.5,
    fairy: 1,
  },
  electric: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 0.5,
    grass: 1,
    ice: 1,
    fighting: 1,
    poison: 1,
    ground: 2,
    flying: 0.5,
    psychic: 1,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 0.5,
    fairy: 1,
  },
  grass: {
    normal: 1,
    fire: 2,
    water: 0.5,
    electric: 0.5,
    grass: 0.5,
    ice: 2,
    fighting: 1,
    poison: 2,
    ground: 0.5,
    flying: 2,
    psychic: 1,
    bug: 2,
    rock: 1,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 1,
    fairy: 1,
  },
  ice: {
    normal: 1,
    fire: 2,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 0.5,
    fighting: 2,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 2,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 2,
    fairy: 1,
  },
  fighting: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 1,
    poison: 1,
    ground: 1,
    flying: 2,
    psychic: 2,
    bug: 0.5,
    rock: 0.5,
    ghost: 1,
    dragon: 1,
    dark: 0.5,
    steel: 1,
    fairy: 2,
  },
  poison: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 0.5,
    ice: 1,
    fighting: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 1,
    psychic: 2,
    bug: 0.5,
    rock: 1,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 1,
    fairy: 0.5,
  },
  ground: {
    normal: 1,
    fire: 1,
    water: 2,
    electric: 0,
    grass: 2,
    ice: 2,
    fighting: 1,
    poison: 0.5,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 0.5,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 1,
    fairy: 1,
  },
  flying: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 2,
    grass: 0.5,
    ice: 2,
    fighting: 0.5,
    poison: 1,
    ground: 0,
    flying: 1,
    psychic: 1,
    bug: 0.5,
    rock: 2,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 1,
    fairy: 1,
  },
  psychic: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 0.5,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 0.5,
    bug: 2,
    rock: 1,
    ghost: 2,
    dragon: 1,
    dark: 2,
    steel: 1,
    fairy: 1,
  },
  bug: {
    normal: 1,
    fire: 2,
    water: 1,
    electric: 1,
    grass: 0.5,
    ice: 1,
    fighting: 0.5,
    poison: 1,
    ground: 0.5,
    flying: 2,
    psychic: 1,
    bug: 1,
    rock: 2,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 1,
    fairy: 1,
  },
  rock: {
    normal: 0.5,
    fire: 0.5,
    water: 2,
    electric: 1,
    grass: 2,
    ice: 1,
    fighting: 2,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    psychic: 1,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 2,
    fairy: 1,
  },
  ghost: {
    normal: 0,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 0,
    poison: 0.5,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 0.5,
    rock: 1,
    ghost: 2,
    dragon: 1,
    dark: 2,
    steel: 1,
    fairy: 1,
  },
  dragon: {
    normal: 1,
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    grass: 0.5,
    ice: 2,
    fighting: 1,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 2,
    dark: 1,
    steel: 1,
    fairy: 2,
  },
  dark: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 2,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 0,
    bug: 2,
    rock: 1,
    ghost: 0.5,
    dragon: 1,
    dark: 0.5,
    steel: 1,
    fairy: 2,
  },
  steel: {
    normal: 0.5,
    fire: 2,
    water: 1,
    electric: 1,
    grass: 0.5,
    ice: 0.5,
    fighting: 2,
    poison: 0,
    ground: 2,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 0.5,
    ghost: 1,
    dragon: 0.5,
    dark: 1,
    steel: 0.5,
    fairy: 0.5,
  },
  fairy: {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 0.5,
    poison: 2,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 0.5,
    rock: 1,
    ghost: 1,
    dragon: 0,
    dark: 0.5,
    steel: 2,
    fairy: 1,
  },
};

function getCustomTypeEffectiveness(
  attackType: string,
  defenseType: string,
  customTypes: CustomType[]
): number {
  // If both types are standard Pokemon types, use the TYPE_CHART
  if (TYPE_CHART[attackType as PokemonType]?.[defenseType as PokemonType] !== undefined) {
    return TYPE_CHART[defenseType as PokemonType][attackType as PokemonType];
  }

  // Find the custom type
  const defenseCustomType = customTypes.find(t => t.name === defenseType);

  // If the defense type is custom, check its defined relationships
  if (defenseCustomType) {
    if (defenseCustomType.immunities.includes(attackType)) return 0;
    if (defenseCustomType.weaknesses.includes(attackType)) return 2;
    if (defenseCustomType.resistances.includes(attackType)) return 0.5;
  }

  return 1; // Default effectiveness if no relationship is defined
}

export function calculateTypeEffectiveness(types: string[], customTypes: CustomType[]) {
  const effectiveness: Record<string, number> = {};
  const allTypes = [...POKEMON_TYPES, ...customTypes.map(t => t.name)];

  // Initialize effectiveness for all types
  allTypes.forEach(type => {
    effectiveness[type] = 1;
  });

  // Calculate effectiveness for each attacking type
  allTypes.forEach(attackType => {
    types.forEach(defenseType => {
      const multiplier = getCustomTypeEffectiveness(attackType, defenseType, customTypes);
      effectiveness[attackType] *= multiplier;
    });
  });

  // Categorize results
  const weaknesses: { type: string; multiplier: number }[] = [];
  const resistances: { type: string; multiplier: number }[] = [];
  const immunities: string[] = [];

  Object.entries(effectiveness).forEach(([type, multiplier]) => {
    if (multiplier === 0) {
      immunities.push(type);
    } else if (multiplier > 1) {
      weaknesses.push({ type, multiplier });
    } else if (multiplier < 1) {
      resistances.push({ type, multiplier });
    }
  });

  return {
    weaknesses: weaknesses.sort((a, b) => b.multiplier - a.multiplier),
    resistances: resistances.sort((a, b) => a.multiplier - b.multiplier),
    immunities: immunities.sort(),
  };
}

// Function to find existing types with same interactions
export function findSimilarTypes(
  newType: CustomType,
  existingTypes: (CustomType | PokemonType)[],
  customTypes: CustomType[]
): string[] {
  const similarTypes: string[] = [];

  // Convert the new type's interactions into a standardized format
  const newTypeEffectiveness: Record<string, number> = {};
  const allTypes = [...POKEMON_TYPES, ...customTypes.map(t => t.name)];

  allTypes.forEach(attackType => {
    if (newType.immunities.includes(attackType)) {
      newTypeEffectiveness[attackType] = 0;
    } else if (newType.weaknesses.includes(attackType)) {
      newTypeEffectiveness[attackType] = 2;
    } else if (newType.resistances.includes(attackType)) {
      newTypeEffectiveness[attackType] = 0.5;
    } else {
      newTypeEffectiveness[attackType] = 1;
    }
  });

  // Check each existing type
  existingTypes.forEach(existingType => {
    if (typeof existingType === 'string') {
      // For standard Pokémon types
      const existingTypeEffectiveness: Record<string, number> = {};
      allTypes.forEach(attackType => {
        existingTypeEffectiveness[attackType] = getCustomTypeEffectiveness(attackType, existingType, customTypes);
      });

      if (Object.entries(existingTypeEffectiveness).every(
        ([type, value]) => newTypeEffectiveness[type] === value
      )) {
        similarTypes.push(existingType);
      }
    } else {
      // For custom types
      const existingTypeEffectiveness: Record<string, number> = {};
      allTypes.forEach(attackType => {
        if (existingType.immunities.includes(attackType)) {
          existingTypeEffectiveness[attackType] = 0;
        } else if (existingType.weaknesses.includes(attackType)) {
          existingTypeEffectiveness[attackType] = 2;
        } else if (existingType.resistances.includes(attackType)) {
          existingTypeEffectiveness[attackType] = 0.5;
        } else {
          existingTypeEffectiveness[attackType] = 1;
        }
      });

      if (Object.entries(existingTypeEffectiveness).every(
        ([type, value]) => newTypeEffectiveness[type] === value
      )) {
        similarTypes.push(existingType.name);
      }
    }
  });

  return similarTypes;
}
