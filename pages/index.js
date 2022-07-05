import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export const Home = () => {
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const getPokemonDetails = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      // get list of more pokemon

      const pokemon = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?limit=16&offset=${offset}`
      );
      const urlData = await pokemon.data.results;

      // get specific details for each new pokemon

      const promises = [];

      urlData.forEach((item) => promises.push(axios.get(item.url)));

      const detailedResults = await axios.all(promises);

      const results = detailedResults.map((item) => item.data);

      setPokemonDetails((prevDetails) => [...prevDetails, ...results]);

      setLoading(false);

      // update offset

      setOffset((prev) => prev + 16);
    } catch (error) {
      console.error(error);
    }
  };

  const listInnerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
    });

    if (listInnerRef.current) {
      observer.observe(listInnerRef.current);
    }

    return () => {
      if (listInnerRef.current) {
        observer.unobserve(listInnerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isVisible) {
      getPokemonDetails();
    }
  }, [isVisible]);

  const getPokemonNames = () =>
    pokemonDetails.map((pokemon) => (
      // eslint-disable-next-line react/no-array-index-key

      <li
        className="max-h-40 max-w-24 border-gray-400 rounded border m-1 py-2 flex flex-col justify-center align-center text-center hover:bg-sky-200"
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
    ));

  return (
    <div
      className={`flex flex-col items-center  w-screen 
      p-28 m-12`}
    >
      <h1 className="text-xl font-bold text-center w-52 m-4">
        <Link href="/">Pokemon API</Link>
      </h1>
      <main className="w-screen max-w-xl flex flex-col">
        <div className="pokemon-grid">
          <ul className="w-full grid grid-cols-4">
            {getPokemonNames()}

            <div className="h-[10px]" ref={listInnerRef} />
          </ul>
        </div>
        <button
          type="button"
          className="w-24 h-12 self-end border rounded"
          onClick={getPokemonDetails}
        >
          Load More
        </button>
      </main>
    </div>
  );
};

export default Home;
