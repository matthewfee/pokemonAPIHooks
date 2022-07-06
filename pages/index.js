import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import PokemonName from '../components/PokemonName';
import { gridItemsCount } from '../constants/constants';

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
        `https://pokeapi.co/api/v2/pokemon/?limit=${gridItemsCount}&offset=${offset}`
      );
      const urlData = await pokemon.data.results;

      // use URLto request specific details for each new pokemon

      const promises = [];

      urlData.forEach((item) => promises.push(axios.get(item.url)));

      const detailedResults = await axios.all(promises);

      const results = detailedResults.map((item) => item.data);

      setPokemonDetails((prevDetails) => [...prevDetails, ...results]);

      setLoading(false);

      // update offset

      setOffset((prev) => prev + gridItemsCount);
    } catch (error) {
      console.error(error);
    }
  };

  // ref for intersection observer

  const listInnerRef = useRef();

  // creates intersection observer to check when user scrolls to bottom of page

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

  // if ref is visible, then generate more pokemon from API

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isVisible) {
      getPokemonDetails();
    }
  }, [isVisible]);

  // generates list of pokemon names from API

  const getPokemonNames = () => pokemonDetails.map((pokemon) => <PokemonName pokemon={pokemon} />);

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
