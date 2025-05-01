import { useState } from "react";
import { POKEMON_TYPES, PokemonType, calculateTypeEffectiveness, CustomType } from "./lib/pokemonTypes";

export default function App() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectorCount, setSelectorCount] = useState(3);
  const [showCustomTypeModal, setShowCustomTypeModal] = useState(false);
  const [customTypeName, setCustomTypeName] = useState("");
  const [customTypeWeaknesses, setCustomTypeWeaknesses] = useState<string[]>([]);
  const [customTypeResistances, setCustomTypeResistances] = useState<string[]>([]);
  const [customTypeImmunities, setCustomTypeImmunities] = useState<string[]>([]);
  const [customTypes, setCustomTypes] = useState<CustomType[]>([]);

  const handleTypeChange = (index: number, type: string) => {
    if (type === "") {
      setSelectedTypes(prev => prev.filter((_, i) => i !== index));
    } else {
      setSelectedTypes(prev => {
        const newTypes = [...prev];
        newTypes[index] = type;
        return newTypes;
      });
    }
  };

  const addTypeSelector = () => {
    setSelectorCount(prev => prev + 1);
  };

  const handleCustomTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTypeName) {
      setCustomTypes(prev => [...prev, {
        name: customTypeName,
        weaknesses: customTypeWeaknesses.filter(t => POKEMON_TYPES.includes(t as PokemonType)) as PokemonType[],
        resistances: customTypeResistances.filter(t => POKEMON_TYPES.includes(t as PokemonType)) as PokemonType[],
        immunities: customTypeImmunities.filter(t => POKEMON_TYPES.includes(t as PokemonType)) as PokemonType[]
      }]);
      setCustomTypeName("");
      setCustomTypeWeaknesses([]);
      setCustomTypeResistances([]);
      setCustomTypeImmunities([]);
      setShowCustomTypeModal(false);
    }
  };

  const toggleTypeInArray = (type: string, array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (array.includes(type)) {
      setArray(array.filter(t => t !== type));
    } else {
      setArray([...array, type]);
    }
  };

  const { weaknesses, resistances, immunities } = calculateTypeEffectiveness(selectedTypes, customTypes);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-bold text-center text-gray-800">Pokémon Type Calculator</h1>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {Array.from({ length: selectorCount }, (_, index) => (
              <select
                key={index}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedTypes[index] || ""}
                onChange={(e) => handleTypeChange(index, e.target.value)}
              >
                <option value="">No Type</option>
                {[...POKEMON_TYPES, ...customTypes.map(t => t.name)].map((type) => (
                  <option
                    key={type}
                    value={type}
                    disabled={selectedTypes.includes(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            ))}
            <button
              onClick={addTypeSelector}
              className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              +
            </button>
            <button
              onClick={() => setShowCustomTypeModal(true)}
              className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Create Type
            </button>
          </div>

          {selectedTypes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-red-50 border border-red-200">
                <h3 className="text-lg font-semibold text-red-700 mb-3">Weaknesses</h3>
                <div className="flex flex-wrap gap-2">
                  {weaknesses.length > 0 ? (
                    weaknesses.map(({ type, multiplier }) => (
                      <span
                        key={type}
                        className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)} (x{multiplier})
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600">No weaknesses found</span>
                  )}
                </div>
              </div>

              <div className="p-6 rounded-lg bg-green-50 border border-green-200">
                <h3 className="text-lg font-semibold text-green-700 mb-3">Resistances</h3>
                <div className="flex flex-wrap gap-2">
                  {resistances.length > 0 ? (
                    resistances.map(({ type, multiplier }) => (
                      <span
                        key={type}
                        className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)} (x{multiplier})
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600">No resistances found</span>
                  )}
                </div>
              </div>

              <div className="p-6 rounded-lg bg-purple-50 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-700 mb-3">Immunities</h3>
                <div className="flex flex-wrap gap-2">
                  {immunities.length > 0 ? (
                    immunities.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)} (x0)
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600">No immunities found</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCustomTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Custom Type</h2>
            
            {/* List of existing custom types */}
            {customTypes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Existing Custom Types</h3>
                <div className="flex flex-wrap gap-2">
                  {customTypes.map((type) => (
                    <div key={type.name} className="p-3 rounded-lg bg-gray-100">
                      <h4 className="font-medium">{type.name}</h4>
                      <div className="text-sm">
                        <p className="text-red-600">Weak: {type.weaknesses.join(", ")}</p>
                        <p className="text-green-600">Resist: {type.resistances.join(", ")}</p>
                        <p className="text-purple-600">Immune: {type.immunities.join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleCustomTypeSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type Name
                </label>
                <input
                  type="text"
                  value={customTypeName}
                  onChange={(e) => setCustomTypeName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter type name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-red-700 mb-2">Weaknesses</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...POKEMON_TYPES, ...customTypes.map(t => t.name)].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleTypeInArray(type, customTypeWeaknesses, setCustomTypeWeaknesses)}
                        className={`px-2 py-1 rounded-full text-xs ${
                          customTypeWeaknesses.includes(type)
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-green-700 mb-2">Resistances</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...POKEMON_TYPES, ...customTypes.map(t => t.name)].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleTypeInArray(type, customTypeResistances, setCustomTypeResistances)}
                        className={`px-2 py-1 rounded-full text-xs ${
                          customTypeResistances.includes(type)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-purple-700 mb-2">Immunities</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...POKEMON_TYPES, ...customTypes.map(t => t.name)].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleTypeInArray(type, customTypeImmunities, setCustomTypeImmunities)}
                        className={`px-2 py-1 rounded-full text-xs ${
                          customTypeImmunities.includes(type)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCustomTypeModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
                >
                  Create Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
