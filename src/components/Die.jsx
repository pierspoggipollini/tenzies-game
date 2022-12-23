import React from "react";
import './Die.css'

const Die = ({ value, isHeld, holdDice }) => {
  const styles = {
    backgroundColor: isHeld === true ? "#4EEF8F" : "white",
  };

  const Pip = () => <span  className="pip" />;

  const Face = ({ children }) => (
    <div style={styles} onClick={holdDice} className="face">
      {children}
    </div>
  );

    let pips = Number.isInteger(value)
      ? Array(value)
          .fill(0)
          .map((_, i) => <Pip key={i}  />)
      : null;
    return (
      <Face>
        {pips}
      </Face>
    );
  };
export default Die;




