import { useEffect, useState } from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState([]);
  const [count, setCount] = useState(0);

  /* Create the seconds */
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  /* Set the state active to true so the time start  */
  function toggle() {
    setIsActive(true);
  }

  /* Set reset function to stop the seconds and set not active */
  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  /*  Add seconds to the state */
  function addNumber(seconds) {
    setTime((prevSeconds) => [...prevSeconds, seconds]);
  }

  /* Save the minimun numbers (seconds) from the array of time */
  const minNumber = Math.min(...time);

  /*  Create the victory */
  useEffect(() => {
    const allHelded = dice.every((die) => die.isHeld);
    const firstElement = dice[0].value;
    const allElement = dice.every((die) => die.value === firstElement);

    if (allHelded && allElement) {
      setTenzies(true);
      setIsActive(false);
      addNumber(seconds);
      localStorage.setItem("BestTime", minNumber);
    }
  }, [dice, minNumber]);

  /* Get the bestTime */
  const bestTime = localStorage.getItem("BestTime");

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
    toggle();
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
      {tenzies && <Confetti width={800} />}
      <div className="title-container">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      </div>
      <div className="die-container">{diceElements}</div>
      <div className="menu">
        <button className="roll-dice" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
        <div className="tenzies-time">{seconds}</div>
      </div>
      <div className="track-record">
        <p>
          {time[0]
            ? `Your best time is ${bestTime} seconds`
            : `Your best time will be shown here`}
        </p>
        <p>Your count of roll are {count}</p>
      </div>
    </main>
  );
}


export default App;
