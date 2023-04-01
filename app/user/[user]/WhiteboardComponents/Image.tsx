export {};
import React from "react";
import {} from "../../../../public/profileImage.png";

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
        style={{border: '1px solid black'}}
        className={["", className].join(" ")}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <button
          className=""
          onClick={() => props.deleter(props.coordinates)}
        >
          X
        </button>
      
        {/* eslint-disable-next-line @next/next/no-img-element*/}
        <img
          alt="Alt"
          src={imgUrl()}
          //src={"/profileImage.png"}
          className={className}
          ref={ref}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchEnd={onTouchEnd}
        >
        </img>
        {children}
      </div>
    );
  }
);
