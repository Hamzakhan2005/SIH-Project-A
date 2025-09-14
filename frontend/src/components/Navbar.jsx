import React from "react";
import { styled as muiStyled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; // hamburger icon
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import styled from "styled-components";
import "./Navbar.css"
import {useState} from "react"

const BootstrapTooltip = muiStyled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div
        className="p-[2vh] flex h-[8vh] items-center navbar"
        style={{
          background:
            "linear-gradient(to right, green 0%, white 50%, orange 100%)",
        }}
      >
        <div className="w-[25%] flex justify-center title">
          <StyledWrapper>
            <button
              className="button"
              data-text="Awesome"
              onClick={() => navigate("/")}
            >
              <span className="actual-text ">&nbsp;GoLocal&nbsp;</span>
              <span aria-hidden="true" className="hover-text">
                &nbsp;GoLocal&nbsp;
              </span>
            </button>
          </StyledWrapper>
        </div>
        <div className="w-[50%] flex justify-center nav-links">
          <BootstrapTooltip
            title="Features"
            style={{ color: "black", fontSize: "1.4rem" }}
          >
            <Button className="text-[2rem]">Features</Button>
          </BootstrapTooltip>
          <BootstrapTooltip
            title="Benefits"
            style={{ color: "black", fontSize: "1.4rem" }}
          >
            <Button>Benefits</Button>
          </BootstrapTooltip>
          <BootstrapTooltip
            title="Services"
            style={{ color: "black", fontSize: "1.3rem" }}
          >
            <Button>Services</Button>
          </BootstrapTooltip>
          <BootstrapTooltip
            title="FAQs"
            style={{ color: "black", fontSize: "1.3rem" }}
          >
            <Button>FAQs</Button>
          </BootstrapTooltip>
        </div>
        <div className="w-[25%] flex items-center justify-center nav-auth">
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
          </Stack>
        </div>
        <div className="hamburger" onClick={() => setIsOpen(true)}>
        <MenuIcon fontSize="large" />
      </div>
      {isOpen && (
        <div className="sidebar">
          <div className="close-btn" onClick={() => setIsOpen(false)}>
            <CloseIcon fontSize="large" />
          </div>
          <div className="sidebar-links">
            <Button onClick={() => navigate("/features")}>Features</Button>
            <Button onClick={() => navigate("/benefits")}>Benefits</Button>
            <Button onClick={() => navigate("/services")}>Services</Button>
            <Button onClick={() => navigate("/faqs")}>FAQs</Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

const StyledWrapper = styled.div`
  /* === removing default button style ===*/
  .button {
    margin: 0;
    height: auto;
    background: transparent;
    padding: 0;
    border: none;
    cursor: pointer;
  }

  /* button styling */
  .button {
    --border-right: 6px;
    --text-stroke-color: rgba(255, 255, 255, 0.6);
    --animation-color: #37ff8b;
    --fs-size: 2em;
    letter-spacing: 3px;
    text-decoration: none;
    font-size: var(--fs-size);
    font-family: "Arial";
    position: relative;
    text-transform: uppercase;
    color: transparent;
    -webkit-text-stroke: 1px var(--text-stroke-color);
  }
  /* this is the text, when you hover on button */
  .hover-text {
    position: absolute;
    box-sizing: border-box;
    content: attr(data-text);
    color: var(--animation-color);
    width: 0%;
    inset: 0;
    border-right: var(--border-right) solid var(--animation-color);
    overflow: hidden;
    transition: 0.5s;
    -webkit-text-stroke: 1px var(--animation-color);
  }
  /* hover */
  .button:hover .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 23px var(--animation-color));
  }
`;

export default Navbar;
