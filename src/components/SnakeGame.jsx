"use client";
import React, { useEffect, useRef, useState } from "react";
import "../styles/snake.css";

const SnakeGame = () => {
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [status, setStatus] = useState("Press Arrow Key to Start");

  const gridSize = 20;
  const tileCount = 20;

  let snake = [{ x: 10, y: 10 }];
  let velocity = { x: 0, y: 0 };
  let food = { x: 5, y: 5 };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;

    const gameLoop = setInterval(drawGame, 90);

    window.addEventListener("keydown", changeDirection);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("keydown", changeDirection);
    };
  }, []);

  const changeDirection = (e) => {
    setStatus("Playing...");

    switch (e.key) {
      case "ArrowUp":
        if (velocity.y !== 1) velocity = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        if (velocity.y !== -1) velocity = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        if (velocity.x !== 1) velocity = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        if (velocity.x !== -1) velocity = { x: 1, y: 0 };
        break;
      default:
        break;
    }
  };

  const resetGame = () => {
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 0, y: 0 };
    setScore(0);
    setStatus("Press Arrow Key to Start");
  };

  const drawGrid = (ctx) => {
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, tileCount * gridSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(tileCount * gridSize, i * gridSize);
      ctx.stroke();
    }
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const head = {
      x: snake[0].x + velocity.x,
      y: snake[0].y + velocity.y,
    };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      const newScore = score + 1;
      setScore(newScore);

      if (newScore > highScore) {
        setHighScore(newScore);
      }

      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      };
    } else {
      snake.pop();
    }

    if (
      head.x < 0 ||
      head.x >= tileCount ||
      head.y < 0 ||
      head.y >= tileCount
    ) {
      setStatus("Game Over!");
      resetGame();
      return;
    }

    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        setStatus("Game Over!");
        resetGame();
        return;
      }
    }

    ctx.fillStyle = "#050d1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx);

    ctx.fillStyle = "#06ff9c";
    ctx.shadowColor = "#06ff9c";
    ctx.shadowBlur = 15;

    snake.forEach((part) => {
      ctx.fillRect(
        part.x * gridSize + 1,
        part.y * gridSize + 1,
        gridSize - 2,
        gridSize - 2
      );
    });

    ctx.fillStyle = "#ff2e63";
    ctx.shadowColor = "#ff2e63";

    ctx.fillRect(
      food.x * gridSize + 1,
      food.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2
    );

    ctx.shadowBlur = 0;
  };

  return (
    <div className="snake-wrapper">
      <div className="snake-card">
        <h2 className="snake-header">🐍 Loading... Play Snake</h2>

        <div className="score-panel">
          <div className="score">Score: {score}</div>
          <div className="high">High Score: {highScore}</div>
        </div>

        <canvas ref={canvasRef} className="snake-canvas" />

        <div className="status">{status}</div>

        <p className="hint">Use Arrow Keys to Control</p>
      </div>
    </div>
  );
};

export default SnakeGame;
