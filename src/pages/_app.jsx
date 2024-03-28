import { useEffect } from 'react';

import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const audio = new Audio();
    audio.src = "RRR.mp3";
    audio.load();
  }, []);

  return <Component {...pageProps} />;
}
