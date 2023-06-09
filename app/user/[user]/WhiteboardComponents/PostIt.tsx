import React, { useRef } from "react";

//eslint-disable-next-line react/display-name
export const PostIt = React.forwardRef<any>(
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
    const { text } = props;
    const postitText = useRef<HTMLTextAreaElement>(null);
    const test = postitText.current;
    if (test) {
      test.value = text;
    }
    
    const grabber = () => {
      test?.focus()
    }
    
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
          onTouchStart={() => props.deleter(props.coordinates)}
        >
          X
        </button>
        <textarea
          name=""
          id=""
          ref={postitText}
          onChange={(e) => props.logger([e.target.value, props.coordinates])}
          onTouchEnd={() => grabber()}
          className="postit__text"
          placeholder="Write a note!"
        ></textarea>
        {children}
      </div>
    );
  }
);
