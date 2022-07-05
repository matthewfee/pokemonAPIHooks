import { useRouter } from 'next/router';
import { useEffect } from 'react';


const pokemonIDPage = () => {
  const router = useRouter();
  const { pokemonID } = router.query;

  useEffect(() => {
    first
  
    return () => {
      second
    }
  }, [])
  

  return <div>pokemonID {pokemonID}</div>;
};
export default pokemonIDPage;
