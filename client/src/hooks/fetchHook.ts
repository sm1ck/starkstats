import { useState, useEffect } from "react";
import fetch from "node-fetch";

export const useFetch = (url: string) => {
  let [loaded, setLoaded] = useState(false);
  let [fetchData, setFetchData] = useState({} as any);
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
