import { useEffect, useState } from 'react';
import './App.css';

// API Key is stored in .env file
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;

type Mars = {
  id: number;
  sol: number;
  img_src: string;
  earth_date: string;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string | undefined;
  };
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
};

function App() {
  const [marsPhotos, setMarsPhotos] = useState<Mars[]>([]);
  const [marsPhoto, setMarsPhoto] = useState<Mars>();
  const [ban, setBan] = useState(false);
  const [banned, setBanned] = useState<any[]>([]);
  const [seenPhotos, setSeenPhotos] = useState<any[]>([]);

  const fetchMarsPhotos = async () => {
    const res = await fetch(
      'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=' +
        NASA_API_KEY
    );
    const data = await res.json();
    setMarsPhotos(data.photos);
  };

  useEffect(() => {
    fetchMarsPhotos();
  }, []);

  const discover = () => {
    if (marsPhotos.length > 0) {
      const randomPhoto =
        marsPhotos[Math.floor(Math.random() * marsPhotos.length)];
      setSeenPhotos((prevPhotosSeen) => [...prevPhotosSeen, randomPhoto]);
      setMarsPhoto(randomPhoto);
    }
  };

  const banName = () => {
    setBan(true);
    if (
      marsPhoto &&
      marsPhoto.camera.full_name &&
      !banned.includes(marsPhoto.camera.full_name)
    ) {
      const filteredPhotos = marsPhotos.filter(
        (attr) => attr.camera.full_name !== marsPhoto.camera.full_name
      );
      setMarsPhotos(filteredPhotos);
      setBanned([...banned, marsPhoto.camera.full_name]);
    }
  };

  const unbanName = () => {
    setBan(false);
    if (marsPhoto && marsPhoto.camera.full_name) {
      const filteredPhotos = marsPhotos.filter(
        (attr) => attr.camera.full_name === marsPhoto.camera.full_name
      );
      setBanned(banned.filter((attr) => attr !== marsPhoto.camera.full_name));
      setMarsPhotos((prevMarsPhotos) => [...prevMarsPhotos, ...filteredPhotos]);
    }
  };

  return (
    <div className="App">
      <div className="seen">
        <h2 style={{ textAlign: 'center' }}>Seen</h2>
        {seenPhotos.map((photo) => (
          <img key={photo.id} src={photo.img_src} alt="Mars" />
        ))}
      </div>

      <div className="container">
        <h1>Mars Photos</h1>
        <button onClick={discover}>Discover</button>
        {marsPhoto && (
          <div className="mars-photo">
            <img src={marsPhoto.img_src} alt="Mars" />
            <br />
            <br />
            <button onClick={banName}>{marsPhoto.camera.full_name}</button>
          </div>
        )}
      </div>
      <div className="ban">
        <h2 style={{ textAlign: 'center' }}>Banned</h2>
        {ban && (
          <div className="banned">
            {banned.map((attr: string, index) => (
              <button onClick={() => unbanName()} key={index}>
                {attr}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
