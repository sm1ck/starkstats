import { useState, useEffect } from "react";
import fetch from "node-fetch";

const useFetch = (url: string) => {
  const [loaded, setLoaded] = useState(false);
  const [fetchData, setFetchData] = useState({} as any);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setFetchData(d);
        setLoaded(true);
      })
      .catch((e) => console.log(e));
  }, [url]);

  return [loaded, fetchData];
};

export default useFetch;
