import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const pokemonIDPage = () => {
  const router = useRouter();
  const { pokemonID } = router.query;

  const [pokemon, setPokemon] = useState([]);

  const paddedID = pokemonID ? pokemonID.toString().padStart(3, '0') : null;

  const IMG_URL = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedID}.png`;

  const getPokemon = async () => {
    const POKEMON_URL = `https://pokeapi.co/api/v2/pokemon/${pokemonID}`;

    const response = await axios.get(POKEMON_URL);
    const { data } = response;
    console.log(data);
    setPokemon(data);
  };

  useEffect(() => {
    if (pokemonID) {
      getPokemon();
    }
  }, [pokemonID]);

  //

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="align-center font-bold capitalize text-3xl">{pokemon.name}</h1>
      {paddedID && <img src={IMG_URL} alt="Pokemon" />}

      <ul className="list-none text-lg">
        <li className="capitalize">
          Abilities: {pokemon.abilities?.map((item) => item.ability.name).join(', ')}
        </li>

        <li className="capitalize">
          Types: {pokemon.types?.map((item) => item.type.name).join(', ')}
        </li>

        <li>Weight: {pokemon.weight}</li>
        <li>Height: {pokemon.height}</li>

        <li className="capitalize my-4">
          <h2 className="font-bold">Statistics</h2>
          <ul className="my-2">
            {pokemon.stats?.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li className="" key={index}>
                {item.stat.name} {item.base_stat}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};
export default pokemonIDPage;
