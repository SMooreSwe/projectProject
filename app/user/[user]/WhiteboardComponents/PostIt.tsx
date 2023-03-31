import React from "react";

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
    return (
      <div
        style={style}
        className={["postit", className].join(" ")}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <textarea
          name=""
          id=""
          onChange={(e) => props.logger(e.target.value)}
          className="postit__text"
          placeholder="press enter to save"
        ></textarea>
        {children}
      </div>
    );
  }
);
