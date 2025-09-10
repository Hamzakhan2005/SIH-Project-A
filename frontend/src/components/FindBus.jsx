import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";

import LocationOnIcon from "@mui/icons-material/LocationOn";

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
  return (
    <div
      className="w-[98vw] h-[98vh] px-[1vh] py-[1vw] flex flex-col  items-center"
      style={{
        background:
          "linear-gradient(180deg,rgb(154, 129, 254) 0%, #f3f0ff 55%, #ffffff 100%)",
      }}
    >
      <div className="flex items-center justify-center">
        <Search
          style={{
            width: "25vw",
          }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        <Button variant="contained">
          <LocationOnIcon /> Location
        </Button>
      </div>
      <div className="w-[80%] flex items-center justify-between">
        <div className="flex flex-col items-center justify-center">
          <h1>Nearest Bus Stop</h1>
          <p>See all Stops</p>

          <div className="w-[30vw] bg-[#000] h-[45vh] "></div>
          <div className="w-[15vw] h-[15vh]">
            <h3>Tips</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae eum
              sed alias incidunt officia mollitia sit explicabo provident unde
              quam. Dolores asperiores placeat, alias quos iusto omnis maiores
              iste ex.
            </p>
          </div>
        </div>
        <div className="pt-[25vh] flex flex-col items-center justify-center">
          <h1>Buses Around You</h1>
          <p>Open the map</p>
          <div className="w-[30vw] h-[45vh] bg-[#000] h-[35vh] "></div>
        </div>
      </div>
    </div>
  );
};

export default FindBus;
