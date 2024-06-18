import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [city, setCity] = useState("Delhi");
  const [area, setArea] = useState("Delhi");
  const [another, setAnother] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const apiKey = '7ee67753c5eb40bc9db182635241606';

  const urli = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Khargone`;
  useEffect(() => {
    fetch(urli)
      .then(respo => respo.json())
      .then(res => {
        setAnother(res);
      })
      .catch(error => {
        console.error("There was an error fetching the weather data!", error);
      });
  }, []);

  // Fetch data function
  const fetchData = (city) => {
    if (city) {
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(res => {
          setArea(city);
          setData(res);
          setErrorMessage("");
        })
        .catch(error => {
          console.error("There was an error fetching the weather data!", error);
          setErrorMessage(`No data found for ${city}`);
          setData(null);
        });
    }
  };

  useEffect(() => {
    fetchData(city);
  }, []);

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(city);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <>
      <div className='main w-1/2 h-5/6 border-2 border-white border-opacity-70 m-auto flex justify-center items-center'>
        <div className="left text-white relative">
          <div className='location flex justify-end text-3xl'>Khargone (IND)</div>
          {another && (
            <>
              <div className='temperature absolute bottom-0 m-3 text-5xl'>{another.current.temp_c}°C</div>
              <div className='date m-3 text-xl flex justify-end items-end'>{formatDateTime(another.location.localtime)}</div>
            </>
          )}
        </div>
        <div className="right">
          <div className="sun-icon-container">
            <i className="fas fa-sun sun-icon"></i>
          </div>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <input
                type="search"
                name="citysearch"
                placeholder='Type City Name'
                value={city}
                onChange={handleChange}
                className="search-input"
              />
              <div><button type="submit" className="submit-button flex justify-center items-center m-auto mt-3">Search</button></div>
            </form>
          </div>

          {!data && (
            <div className="lower">
              <p>No Data Found For This Location</p>
            </div>
          )}

          {data && (<><div className='mt-3 text-2xl'>{area}</div>
            <div className="lower">
              <p>Temperature: {data.current.temp_c} &deg;C</p>
              <p>Humidity: {data.current.humidity} %</p>
              <p>Visibility: {data.current.vis_km} Km</p>
              <p>Wind Speed: {data.current.wind_kph} KPH</p>
            </div>
          </>


          )}
        </div>
      </div>
    </>
  );
}

export default App;
