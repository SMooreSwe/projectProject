import React, { useEffect, useRef, useState } from "react";

//eslint-disable-next-line react/display-name
export const WBLink = React.forwardRef<any>(
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
    const [website, setWebsite] = useState<string>("");
    const [imgurl, setImageUrl] = useState<string>("");

    useEffect(() => {
      if (props.website) {
        setWebsite(props.website);
      }
      if (props.imageurl) {
        setImageUrl(props.imageurl);
      }
    }, [props.website, props.imageurl]);

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
          onTouchStart={() => props.deleter(props.coordinates)}
        >
          X
        </button>
        <a onDoubleClick={() => window.open(website, "_blank")}>
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img
            alt="Alt"
            src={imgurl}
            className={["wbImageItem__img", className].join(" ")}
            ref={ref}
          ></img>
          <p className="wbLinkText">{website}</p>
        </a>
        {children}
      </div>
    );
  }
);
