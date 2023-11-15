import React, { useState, useRef, useEffect } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";

function Session({ timeType, timeFormat, handlePause, handleReset }) {
  return (
    <div id="clock-box" className="container">
      <div id="timer-label">{timeType}</div>
      <hr className="line" />
      <div id="time-left">{timeFormat()}</div>
      <hr className="line" />
      <div style={{ marginTop: "7px" }} className="wrapper">
        <button onClick={handlePause} id="start_stop">
          &#9199;
        </button>
        <button onClick={handleReset} id="reset">
          &#8634;
        </button>
      </div>
    </div>
  );
}

function BreakLength({ fun, handleClick, status }) {
  return (
    <div className="container">
      <div id="break-label">Break Time</div>
      <div className="wrapper">
        <button
          onClick={() => handleClick("breakDec")}
          disabled={status}
          id="break-decrement"
        >
          &#10134;
        </button>
        <div id="break-length">{fun}</div>
        <button
          onClick={() => handleClick("breakInc")}
          disabled={status}
          id="break-increment"
        >
          &#10133;
        </button>
      </div>
    </div>
  );
}
function SessionLength({ session, handleClick, status }) {
  return (
    <div className="container">
      <div id="session-label">Session Time</div>
      <div className="wrapper">
        <button
          onClick={() => handleClick("sessionDec")}
          disabled={status}
          id="session-decrement"
        >
          &#10134;
        </button>
        <div id="session-length">{session}</div>
        <button
          onClick={() => handleClick("sessionInc")}
          disabled={status}
          id="session-increment"
        >
          &#10133;
        </button>
      </div>
    </div>
  );
}

function Clock() {
  const [session, setSession] = useState(25);
  const [fun, setFun] = useState(5);
  const [status, setStatus] = useState(false);
  const [timeType, setTimeType] = useState("session");
  const [timeLeft, setTimeLeft] = useState(1500);

  function timeFormat() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  function handleClick(type) {
    if (type === "sessionInc") {
      if (session < 60) {
        setSession(session + 1);
        setTimeLeft(timeLeft + 60);
      }
    } else if (type === "sessionDec") {
      if (session > 1) {
        setSession(session - 1);
        setTimeLeft(timeLeft - 60);
      }
    } else if (type === "breakInc") {
      if (fun < 60) {
        setFun(fun + 1);
      }
    } else if (type === "breakDec") {
      if (fun > 1) {
        setFun(fun - 1);
      }
    }
  }
  const timeout = setTimeout(() => {
    if (timeLeft && status) {
      setTimeLeft(timeLeft - 1);
    }
  }, 1000);

  const timerReset = () => {
    const audio = document.getElementById("beep");
    if (!timeLeft && timeType === "session") {
      setTimeLeft(fun * 60);
      setTimeType("break");
      audio.play();
    }
    if (!timeLeft && timeType === "break") {
      setTimeLeft(session * 60);
      setTimeType("session");
      audio.pause();
      audio.currentTime = 0;
    }
  };

  function handlePause() {
    clearTimeout(timeout);
    setStatus(!status);
  }

  function handleReset() {
    clearTimeout(timeout);
    setStatus(false);
    setTimeLeft(1500);
    setFun(5);
    setSession(25);
    setTimeType("session");
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  }

  const clock = () => {
    if (status) {
      timeout;
      timerReset();
    } else {
      clearTimeout(timeout);
    }
  };

  React.useEffect(() => {
    clock();
  }, [status, timeLeft, timeout]);

  return (
    <div id="box">
      <p id="subtitle">25 + 5 Clock</p>
      <hr style={{ marginTop: "-0.3rem" }} className="line" />
      <div id="horizontal">
        <BreakLength fun={fun} handleClick={handleClick} status={status} />
        <SessionLength
          session={session}
          handleClick={handleClick}
          status={status}
        />
      </div>
      <audio
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        id="beep"
      ></audio>
      <Session
        timeType={timeType}
        timeFormat={timeFormat}
        handlePause={handlePause}
        handleReset={handleReset}
      />
    </div>
  );
}

function App() {
  return <Clock />;
}

ReactDOM.render(<App />, document.getElementById("root"));