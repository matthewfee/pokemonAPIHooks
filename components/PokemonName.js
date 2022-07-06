import Link from 'next/link';

const PokemonName = ({ pokemon }) => (
  <li
    className="max-h-40 max-w-24 border-gray-400 rounded border m-1 py-2 flex flex-col justify-center align-center text-center hover:bg-sky-200 truncate"
    key={pokemon.id}
  >
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="cursor-pointer ">
        <div className="id text-sm italic py-2">{pokemon.id}</div>
        <h2 className="pokemon-name text-lg font-semibold py-2 capitalize">{pokemon.name}</h2>
        <div className="types text-sm py-2">
          {pokemon.types.map((item) => item.type.name).join(', ')}
        </div>
      </div>
    </Link>
  </li>
);

export default PokemonName;
