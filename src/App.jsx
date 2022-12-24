import { useEffect, useState } from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { faDice, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);

  const [count, setCount] = useState(0);
  const [bestCount, setBestCount] = useState([]);

  const [time, setTime] = useState(0);
  const [active, setActive] = useState(false);

  const [bestTime, setBestTime] = useState([]);

  // Create the time
  useEffect(() => {
    let intervall = null;
    if (active) {
      intervall = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!active && time !== 0) {
      clearInterval(intervall);
    }
    return () => {
      clearInterval(intervall);
    };
  }, [active]);

  function toggleActive() {
    setActive(true);
  }

  function reset() {
    setActive(false);
    setTime(0);
  }

  //Separate from the time, minutes and seconds
  const total = time;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  //Show the best time in minutes and seconds
  const min = Math.min(...bestTime);
  const totalTime = min;
  const totalMinutes = Math.floor(totalTime / 60);
  const totalSeconds = totalTime % 60;

  //Set the variable to show the best count from the best count state
  const minBestCount = Math.min(...bestCount.filter((bcount) => bcount !== 0));

  /*  Create the victory */
  useEffect(() => {
    const allHelded = dice.every((die) => die.isHeld);
    const firstElement = dice[0].value;
    const allElement = dice.every((die) => die.value === firstElement);

    if (allHelded && allElement) {
      setTenzies(true);
      setActive(false);
      setTime(0);
      setBestTime((prevBest) => [...prevBest, time]);

      setBestCount((prevCount) => [...prevCount, count]);
      localStorage.setItem("Current Time", `${minutes}:${seconds}`);
      localStorage.setItem("Best Time", `${totalMinutes}:${totalSeconds}`);
      localStorage.setItem("Best Count", bestCount);
    }
  }, [dice]); //


  /* Generate the new Die */
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  /*   Generate 10 casual numbers from 1 to 6 in the die */
  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  /* keep the color or hide */
  function holdDice(id) {
    toggleActive();
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  /* button function */
  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setCount(count + 1);
    } else {
      reset();
      setCount(0);
      setTenzies(false);
      setDice(allNewDice());
    }
  }

  /* Create the new array of the die elements */
  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti width={800}/>}
      <div className="title-container">
        <div className="tenzies-title">
          <FontAwesomeIcon className="dice-icon fa-shake" icon={faDice} />
          <h1 className="title">Tenzies</h1>
          <FontAwesomeIcon className="dice-icon fa-shake" icon={faDice} />
        </div>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      </div>

      <div className="die-container">{diceElements}</div>
      <motion.button whileTap={{scale: 0.9}} className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </motion.button>
      <div className="track-record">
        <div className="tenzies-time">
          <FontAwesomeIcon className="time-icon" icon={faStopwatch} />
          <p>{`${minutes}:${seconds}`}</p>
        </div>
        <div className="best">
          <span className="emoji">🏆</span>
          <p>
            {bestTime.length === 0
              ? "Play now to show your best time"
              : `${totalMinutes}:${totalSeconds}`}
          </p>
        </div>
        <div className="best">
          <span className="emoji">🤩</span>
          <p>
            {bestCount.length === 0
              ? "Play now to show your best count"
              : minBestCount}
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;
