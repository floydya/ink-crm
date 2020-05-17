import React from "react";
import SellMotivation from "./Tables/Sells";
import EducationMotivation from "./Tables/Educations";
import SessionMotivation from "./Tables/Sessions";

const Motivation = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "25px",
      }}
    >
      <SessionMotivation />
      <EducationMotivation />
      <SellMotivation />
    </div>
  );
};

export default Motivation;
