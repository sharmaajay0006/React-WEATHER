import { React, useEffect, useState } from "react";
import moment from "moment";
const SearchWeather = () => {
  const [city, setCity] = useState();
  const [search, setSearch] = useState("bengaluru");

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };
  useEffect(() => {
    const fetchApi = async () => {
      const myKey = `51b607f72aeba693771c22c6faf03aca`;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${myKey}`;
      const response = await fetch(url);
      const jsonResponse = await response.json();
      setCity(jsonResponse);
      if (jsonResponse?.cod === "404" || jsonResponse?.cod === "400") {
        return setCity(null);
      }
      setCity(jsonResponse);
    };

    fetchApi();
  }, [search]);

  const timezone = city?.timezone;
  const sunrise = moment
    .utc(city?.sys?.sunrise, "X")
    .add(timezone, "seconds")
    .format("hh:mm A");
  const sunset = moment
    .utc(city?.sys?.sunset, "X")
    .add(timezone, "seconds")
    .format("hh:mm A");
  const timeZoneInMinutes = timezone / 60;
  const currTime = moment()
    .utcOffset(timeZoneInMinutes)
    .format("dddd, DD-MMMM-yyyy | hh:mm A");
  let dayNight;
  const hour = moment().utcOffset(timeZoneInMinutes).format("HH");
  if (hour >= 6 && hour <= 19) {
    dayNight = "day";
  } else {
    dayNight = "night";
  }

  const imgType = `sky,${city?.weather[0]?.main}, ${dayNight}`;
  const img = `https://source.unsplash.com/random/300*900/?(${imgType})`;
  const cityInfo = `${city?.name}, ${city?.sys?.country}`;
  const temp = (city?.main?.temp - 274.15).toFixed(2);
  const temp_min = (city?.main?.temp_min - 274.15).toFixed(2);
  const temp_max = (city?.main?.temp_max - 274.15).toFixed(2);
  const feels_like = (city?.main?.feels_like - 274.15).toFixed(2);
  const humidity = city?.main?.humidity;
  const windSpeed = city?.wind?.speed;

  return (
    <>
      <div className='row justify-content-center'>
        <div className='col-md-5'>
          <div className='card text-white text-center'>
            <img src={img} className='card-img' alt='...' />
            <div className='bg-dark bg-opacity-50 card-img-overlay'>
              <div className='mb-3'>
                <h1 className='display-4 fw-bold'>The Weather</h1>
                <hr />
              </div>
              <form>
                <div className=' input-group justify-content-center'>
                  <input
                    type='search'
                    className='form-control width'
                    onChange={handleInputChange}
                    placeholder='Search here...'
                  />
                </div>
              </form>
              {!city ? (
                <p className='card-title display-4 '>City not found</p>
              ) : (
                <div className='py-3'>
                  <h2 className='card-title display-5 fw-bold'>{cityInfo}</h2>
                  <p className='lead'>{currTime}</p>
                  <hr />
                  <h1 className='fw-bolder '>{temp} &deg;C </h1>
                  <p className='mb-2 text-capitalize fs-3'>
                    {city?.weather[0]?.main}
                  </p>

                  <p className='lead'>
                    Min - {temp_min} &deg;C | Max - {temp_max} &deg;C
                  </p>
                  <p className='lead'>
                    Feals Like - {feels_like} &deg;C | Humidity - {humidity}%
                  </p>
                  <p className='lead'> Wind Speed - {windSpeed} Km/h</p>
                  <p className='lead text-capitalize'>
                    Sunrise - {sunrise} | Sunset - {sunset}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchWeather;
