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

    await setLoading(true);

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
    getPokemonDetails();
  }, [isVisible]);

  const increaseOffset = () => {
    setOffset(offset + 24);
    console.log(offset);
  };

  const getPokemonNames = () =>
    pokemonDetails.map((pokemon, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <li className="h-[100px] " key={index}>
        {index + 1}. {pokemon.name}, ID: {pokemon.id}, Height: {pokemon.height}
      </li>
    ));

  return (
    <div
      className={`flex flex-col items-center  w-screen border-blue-200 
      border-2 p-28 m-12`}
    >
      <h1 className="border-red-900 border-2 w-52 m-10">Pokemon</h1>
      <button type="button" onClick={increaseOffset}>
        Increase Offset
      </button>

      <main>
        <div className="pokemon-grid">
          <h2>Details</h2>
          <ul>
            {getPokemonNames()}
            <div className="h-[100px] border-red-300 border-2" ref={listInnerRef}>
              Hidden Last Element
            </div>
          </ul>
        </div>
        <button type="button" onClick={getPokemonDetails}>
          LoadMore
        </button>
      </main>
    </div>
  );
};

export default Home;
