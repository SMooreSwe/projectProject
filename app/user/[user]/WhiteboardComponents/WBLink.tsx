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
    const [name, setName] = useState<string>('')
    const [url, setUrl] = useState<string>('')

    useEffect(()=> {
        setName(props.name)
        setUrl(props.url)
    }, [props.name, props.url])

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
        <a href="www.google.com">test</a>
        {children}
      </div>
    );
  }
);