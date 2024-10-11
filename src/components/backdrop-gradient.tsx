"use client";
import style from "./backdrop-gradient.module.scss";

export default function BackdropGradient() {
  return (
    <div className={style.gradientBg}>
      <div className={style.gradientsContainer}>
        <div className={style.g1}></div>
        <div className={style.g2}></div>
        <div className={style.g3}></div>
        <div className={style.g4}></div>
        <div className={style.g5}></div>
      </div>
    </div>
  );
}
