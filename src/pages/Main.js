import React, { useState, useEffect, useRef } from 'react';
import { Link, Form } from 'react-router-dom';
import '../AuthForm.css'
import {baseURL} from '../base_url.js'
import { Loader } from '@googlemaps/js-api-loader'

const AuthForm = () => {
//   const [activeForm, setActiveForm] = useState('login');
//   const handleFormToggle = (formType) => {
//     setActiveForm(formType);
//   };
//   const handleSignupSubmit = async (e) => {
//     // Allow the form to submit normally.
//     // After a 1-second delay, switch the form to login.
//     setTimeout(() => {
//         setActiveForm('login');
//     }, 1000);
// };


  const [lat, setLat] = useState(33.773110)
  const [lon, setLon] = useState(-118.195310)
  const [radius, setRadius] = useState(10000)
  const [google, setGoogle] = useState(null)
  // const [service, setService] = useState(null)
  const [map, setMap] = useState(null)
  // const [infoWindow, setInfoWindow] = useState(null)
  const infoWindowRef = useRef(null)

  const initMap = async () => {
    const loader = new Loader({
      apiKey: "AIzaSyDXabu0BGF0wD2HCAdbCS7EcaiXUs6FsqI",
      version: "weekly",
      libraries: ["places"]
    })
    const google = await loader.load()
    setGoogle(google)
    const infoWindow = new google.maps.InfoWindow()
    // setInfoWindow(infoWindow)
    infoWindowRef.current = infoWindow
    setMap(new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(lat, lon),
      zoom: 12,
    }))
  }
  useEffect(() => {initMap()}, [])

  const fetchDogParks = async () => {
    if (!google) return
    console.log(google)
      
    const request = {
      keyword: "dog park",
      type: "park",
      location: new google.maps.LatLng(lat, lon),
      radius: radius
    };

    const service = new google.maps.places.PlacesService(map);
    // setService(service)
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
  
        // map.setCenter(results[0].geometry.location);
      }
    });
  }

  const updateInfoWindow = (place, map, marker) => {
    console.log(infoWindowRef.current)
    infoWindowRef.current.setContent(place.name || "");
    infoWindowRef.current.setPosition(place.geometry.location)
    infoWindowRef.current.open(map, marker);
  }

  const createMarker = (place) => {
    if (!place.geometry || !place.geometry.location) return;
  
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    });
  
    google.maps.event.addListener(marker, "click", () => {
      console.log('hello friend')
      updateInfoWindow(place, map, marker)
    });
  }

  return (
    <div className="wrapper">
      <h1>yo we be testin bois</h1>
      <label>
        Lat: 
        <input type="text" value={lat} onChange={e => setLat(Number(e.target.value))} />
      </label>
      <br/>
      <label>
        Lon: 
        <input type="text" value={lon} onChange={e => setLon(Number(e.target.value))} />
      </label>
      <br/>
      <label>
        Radius: 
        <input type="text" value={radius} onChange={e => setRadius(Number(e.target.value))} />
      </label>
      <button className="custom-button" onClick={fetchDogParks}>Test</button>
      <div style={{
        width: '100%',
        height: '400px'
      }} id="map"></div>
    </div>
  );

  return (
    <div className="wrapper">
      <div className="title-text">
        <div className={`title login ${activeForm === 'login' ? 'active' : ''}`}>Welcome Back</div>
        <div className={`title signup ${activeForm === 'signup' ? 'active' : ''}`}>Hey New Pal</div>
      </div>
      <div className="form-container">
        <div className="slide-controls">
          <input type="radio" name="slide" id="login" checked={activeForm === 'login'} />
          <input type="radio" name="slide" id="signup" checked={activeForm === 'signup'} />
          <label htmlFor="login" className={`slide login ${activeForm === 'login' ? 'active' : ''}`} onClick={() => handleFormToggle('login')}>Login</label>
          <label htmlFor="signup" className={`slide signup ${activeForm === 'signup' ? 'active' : ''}`} onClick={() => handleFormToggle('signup')}>Signup</label>
          <div className="slider-tab"></div>
        </div>
        <div className="form-inner">
          {/* Login Form */}
          {activeForm === 'login' && (
            <Form className="login" action='/login' method='post'>
              <div className="field">
                <input type="text" name="username" placeholder="username" required />
              </div>
              <div className="field">
                <input type="password" name="password" placeholder="password" required />
              </div>
              {/* <div className="pass-link"><a href="#">Forgot password?</a></div> */}
              <div className="field btn">
                <div className="btn-layer">
                    <input type="submit" value="Login" />
                </div>
              </div>
              <div className="signup-link">Create an account <Link to="/login">Signup now</Link></div>

            </Form>
          )}
          {/* Signup Form */}
          {activeForm === 'signup' && (
            <Form className="signup" action='/signup' method='post' onSubmit={handleSignupSubmit}>
              <div className="field">
                <input type="text" name="username" id="username" placeholder="username" required />
              </div>
              {/* <div className="field">
                <input type="text" placeholder="Email Address" required />
              </div> */}
              <div className="field">
                <input type="password" name='password' id="password" placeholder="password" required />
              </div>
              {/* <div className="field">
                <input type="password" placeholder="Confirm password" required />
              </div> */}
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Signup" />
              </div>
              <div className="signup-link">Already have an account? <Link to="/login">Login now</Link></div>
              {/* <div className="signup-link">Already have an account? <a href="#">Login</a></div> */}
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthForm;