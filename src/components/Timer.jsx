import React, { useState, useEffect } from 'react';

const Timer = ({ serverTime }) => {
  const [remainingTime, setRemainingTime] = useState(serverTime);

  useEffect(() => {
    setRemainingTime(serverTime);
  }, [serverTime]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingTime]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${seconds}`;
  };

  return (
    <div>
      <h1>Time Left: {formatTime(remainingTime)}</h1>
    </div>
  );
};

export default Timer;
