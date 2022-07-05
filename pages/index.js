import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

export const Home = () => {
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const getPokemonDetails = async () => {
    if (loading) {
      console.log('ALREADY LOADING');
      return;
    }

    setLoading(true);

    try {
      const pokemon = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?limit=16&offset=${offset}`
      );
      const urlData = await pokemon.data.results;

      const promises = [];

      urlData.forEach((item) => promises.push(axios.get(item.url)));

      const detailedResults = await axios.all(promises);

      const results = detailedResults.map((item) => item.data);

      setPokemonDetails((prevDetails) => [...prevDetails, ...results]);
      console.log('DETAILED RESULTS', detailedResults);

      // setPokemonDetails((prev) => [...prev, ...data]);
      setLoading(false);
      setOffset((prev) => prev + 16);
    } catch (error) {
      console.error(error);
    }
  };

  const listInnerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      console.log(entry);
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
        className="max-h-40 max-w-24 border-gray-400 rounded border m-1 py-2 flex flex-col justify-center align-center text-center"
        key={pokemon.id}
      >
        <div className="id text-sm italic py-2">{pokemon.id}</div>
        <h2 className="pokemon-name text-lg font-semibold py-2 capitalize">{pokemon.name}</h2>
        <div className="types text-sm py-2">
          {pokemon.types.map((item) => item.type.name).join(', ')}
        </div>
      </li>
    ));

  return (
    <div
      className={`flex flex-col items-center  w-screen 
      border-2 p-28 m-12`}
    >
      <h1 className="text-xl font-bold text-center w-52 m-10">Pokemon API</h1>
      <main className="w-screen max-w-xl flex flex-col">
        <div className="pokemon-grid">
          <ul className="w-full grid grid-cols-4">
            {getPokemonNames()}

            <div className="h-[10px]" ref={listInnerRef} />
          </ul>
        </div>
        <button type="button" className="w-24 self-end" onClick={getPokemonDetails}>
          LoadMore
        </button>
      </main>
    </div>
  );
};

export default Home;
