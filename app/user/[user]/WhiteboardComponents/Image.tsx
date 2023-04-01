export {};
import React, { useEffect, useState } from "react";
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
    const [image, setImage] = useState<any>()
    
    useEffect(()=> {
      if (props.file) {
          setImage(props.file) 
      } else  {
        setImage("/profileImage.png");
      }
    }, [props.file])
    
    return (
      <div
        style={style}
        className={["wbImageItem", className].join(" ")}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <button
          className="wbImageItem__btn"
          onClick={() => props.deleter(props.coordinates)}
        >
          X
        </button>
      
        {/* eslint-disable-next-line @next/next/no-img-element*/}
        <img
          alt="Alt"
          src={image}
          //src={"/profileImage.png"}
          className={["wbImageItem__img", className].join(" ")}
          ref={ref}
        >
        </img>
        {children}
      </div>
    );
  }
);
