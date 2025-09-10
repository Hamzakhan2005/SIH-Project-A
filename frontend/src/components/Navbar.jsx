import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";

const BootstrapTooltip = styled(({ className, ...props }) => (
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
  return (
    <>
      <div
        className="p-[2vh] flex h-[5vh] items-center"
        style={{
          background:
            "linear-gradient(to right, green 0%, white 50%, orange 100%)",
        }}
      >
        <div className="w-[25%] flex justify-center">
          <h2>Project-A</h2>
        </div>
        <div className="w-[50%] flex justify-center">
          <BootstrapTooltip title="Features">
            <Button className="text-[2rem]">Features</Button>
          </BootstrapTooltip>
          <BootstrapTooltip title="Benefits">
            <Button>Benefits</Button>
          </BootstrapTooltip>
          <BootstrapTooltip title="Services">
            <Button>Services</Button>
          </BootstrapTooltip>
          <BootstrapTooltip title="FAQs">
            <Button>FAQs</Button>
          </BootstrapTooltip>
        </div>
        <div>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="success">
              Sign In
            </Button>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default Navbar;
