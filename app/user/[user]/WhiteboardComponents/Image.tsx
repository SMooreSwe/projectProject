export {};
import React from "react";

//eslint-disable-next-line react/display-name
export const Image = React.forwardRef<any>(
  (
    {
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      ...props
    }: any,
    ref
  ) => {
    const imgUrl = () => {
      //return firestore image url for input
      return "/profileImage.png";
    };
    return (
      <div
        style={style}
        className={["postit", className].join(" ")}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <button
          className="postit__btn"
          onClick={() => props.deleter(props.coordinates)}
        >
          X
        </button>
        <div>WNFOWfoinwoif</div>
        {/* eslint-disable-next-line @next/next/no-img-element*/}
        <img
          alt=""
          //src={imgUrl()}
          src={"/profileImage.png"}
          style={style}
          className={className}
          ref={ref}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchEnd={onTouchEnd}
        >
          {children}
        </img>
        {children}
      </div>
    );
  }
);
