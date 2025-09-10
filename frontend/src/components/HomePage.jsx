import React from "react";
import Navbar from "./Navbar";
import { Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import Footer from "./Footer";
import styled from "styled-components";

const HomePage = () => {
  return (
    <div className="bg-[#fff] ">
      <Navbar />
      <div
        className="pt-[1vh]  bg-gradient-to-b from-purple-100 to-white px-8 py-16 font-sans "
        style={{
          background:
            "linear-gradient(to right,rgb(187, 244, 203) 0%, #ffffff 50%,rgb(248, 219, 186) 100%)",
        }}
      >
        <div className="text-center mt-8">
          <h1 className="text-5xl font-bold leading-snug">
            Reimagining <span className="text-white">Public Transport.</span>
            <br />
            for the Next <span className="text-[#24ab3f]">Decade.</span>
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            The future of public transport starts here—real-time GPS tracking,
            AI-powered predictions, and safety-first design, all seamlessly
            woven into one experience.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#22c55e",
              textTransform: "none",
              borderRadius: "50px",
              padding: "8px 20px",
              fontWeight: "600",
            }}
          >
            Get Started
          </Button>
        </div>

        <div className="mt-[2vh] text-center">
          <Button
            variant="outlined"
            sx={{
              borderRadius: "50px",
              borderColor: "#22c55e",
              color: "#22c55e",
              textTransform: "none",
              fontWeight: "600",
            }}
          >
            Why Choose Us?
          </Button>

          <h2 className="text-3xl font-bold mt-6">
            Key <span className="text-[]">Benefits</span> of Using GoLocal
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            From standing in uncertainty to traveling with confidence. We’re
            making public transport reliable, safe, and accessible for everyone.
          </p>
        </div>
        <div className=" h-[35vh] px-[2vw] py-[2vh] flex items-center justify-center">
          <div className="grid grid-cols-4 divide-x divide-y divide-gray-600 ">
            {[
              {
                title: "Live GPS Tracking",
                desc: "Track buses and metros in real time.",
              },
              {
                title: "Smart Schedulers",
                desc: "Always updated with city timings.",
              },
              {
                title: "Multilingual",
                desc: "Easy access in your local language.",
              },
              {
                title: "Seat Availability",
                desc: "Know crowd levels before you board.",
              },
              {
                title: "QR Instant Info",
                desc: "Scan at stops for live route info.",
              },
              {
                title: "AI Prediction",
                desc: "Smarter ETAs with real-time city data.",
              },
              {
                title: "Smart Alerts",
                desc: "Get delay and route change updates instantly.",
              },
              {
                title: "Safety First",
                desc: "Travel securely with verified systems.",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col p-[0.5rem]">
                <h3 className="">{item.title}</h3>
                <p className="">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
