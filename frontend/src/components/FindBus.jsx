import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import styled from "styled-components";
import api from "../api.js";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRef } from "react";
import MapView from "./MapView";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const FindBus = () => {
  const [userLocation, setUserLocation] = React.useState(null);
  const mapRef = useRef(null);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User location:", latitude, longitude);

        // update state so MapView shows marker
        setUserLocation({ lat: latitude, lng: longitude });

        // Center the map if it exists
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get location: " + error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div>
      <Navbar />
      <div
        className="w-[98vw] h-[150vh] px-[1vh] py-[1vw] flex flex-col  items-center"
        style={{
          background:
            "linear-gradient(to right,rgb(187, 244, 203) 0%, #ffffff 50%,rgb(248, 219, 186) 100%)",
        }}
      >
        <div className="flex items-center justify-center">
          <StyledWrapper className="mr-[2vw]">
            <div className="input-container">
              <input
                type="text"
                name="text"
                className="input"
                placeholder="search..."
              />
              <span className="icon">
                <svg
                  width="19px"
                  height="19px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      opacity={1}
                      d="M14 5H20"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                    <path
                      opacity={1}
                      d="M14 8H17"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                    <path
                      d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
                      stroke="#000"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                    <path
                      opacity={1}
                      d="M22 22L20 20"
                      stroke="#000"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </span>
            </div>
          </StyledWrapper>

          <Button variant="contained" onClick={handleLocate}>
            <LocationOnIcon /> Location
          </Button>
        </div>
        <div className="w-[80%] flex items-center justify-between">
          <div className="flex flex-col items-center justify-center">
            <h1>Nearest Bus Stop</h1>
            <p>See all Stops</p>

            <div className="w-[30vw] bg-[#000] h-[45vh] "></div>
            <StyledWrapper className="h-5vh] w-[20vw]">
              <div className="card">
                <p className="card-title">Tips</p>
                <p className="small-desc">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Quaerat veritatis nobis saepe itaque rerum nostrum aliquid
                  obcaecati odio officia deleniti.
                </p>
                <div className="go-corner">
                  <div className="go-arrow">→</div>
                </div>
              </div>
            </StyledWrapper>
          </div>
          <div className="pt-[25vh] flex flex-col items-center justify-center">
            <h1>Buses Around You</h1>
            <p>Open the map</p>
            <div className="w-[30vw] h-[45vh]">
              <MapView userLocation={userLocation} mapRef={mapRef} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const StyledWrapper = styled.div`
  .input-container {
    width: 220px;
    position: relative;
  }

  .icon {
    position: absolute;
    right: 10px;
    top: calc(50% + 5px);
    transform: translateY(calc(-50% - 5px));
  }

  .input {
    width: 100%;
    height: 40px;
    padding: 10px;
    transition: 0.2s linear;
    border: 2.5px solid black;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .input:focus {
    outline: none;
    border: 0.5px solid black;
    box-shadow: -5px -5px 0px black;
  }

  .input-container:hover > .icon {
    animation: anim 1s linear infinite;
  }

  @keyframes anim {
    0%,
    100% {
      transform: translateY(calc(-50% - 5px)) scale(1);
    }

    50% {
      transform: translateY(calc(-50% - 5px)) scale(1.1);
    }
  }
  .card-title {
    color: #262626;
    font-size: 1.5em;
    line-height: normal;
    font-weight: 700;
    margin-bottom: 0.5em;
  }

  .small-desc {
    font-size: 1em;
    font-weight: 400;
    line-height: 1.5em;
    color: #452c2c;
  }

  .small-desc {
    font-size: 1em;
  }

  .go-corner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 2em;
    height: 2em;
    overflow: hidden;
    top: 0;
    right: 0;
    background: linear-gradient(135deg, #6293c8, #384c6c);
    border-radius: 0 4px 0 32px;
  }

  .go-arrow {
    margin-top: -4px;
    margin-right: -4px;
    color: white;
    font-family: courier, sans;
  }

  .card {
    display: block;
    position: relative;
    max-width: 300px;
    max-height: 320px;
    background-color: #f2f8f9;
    border-radius: 10px;
    padding: 2em 1.2em;
    margin: 12px;
    text-decoration: none;
    z-index: 0;
    overflow: hidden;
    background: linear-gradient(to bottom, #c3e6ec, #a7d1d9);
    font-family: Arial, Helvetica, sans-serif;
  }

  .card:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: -16px;
    right: -16px;
    background: linear-gradient(135deg, #364a60, #384c6c);
    height: 32px;
    width: 32px;
    border-radius: 32px;
    transform: scale(1);
    transform-origin: 50% 50%;
    transition: transform 0.35s ease-out;
  }

  .card:hover:before {
    transform: scale(28);
  }

  .card:hover .small-desc {
    transition: all 0.5s ease-out;
    color: rgba(255, 255, 255, 0.8);
  }

  .card:hover .card-title {
    transition: all 0.5s ease-out;
    color: #ffffff;
  }
`;

export default FindBus;
