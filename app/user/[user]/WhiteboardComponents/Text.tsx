import React, { useRef } from "react";

//eslint-disable-next-line react/display-name
export const Text = React.forwardRef<HTMLDivElement>(
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
    const boxText = useRef<HTMLTextAreaElement>(null);
    const test = boxText.current;
    if (test) {
      test.value = text;
    }

    return (
      <div
        style={style}
        className={["textblock", className].join(" ")}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <button onClick={() => props.deleter(props.coordinates)}>Delete</button>
        <textarea
          name=""
          id=""
          ref={boxText}
          onChange={(e) => props.logger([e.target.value, props.coordinates])}
          className="textblock__text"
          placeholder="press enter to save"
        ></textarea>
        {children}
      </div>
    );
  }
);
