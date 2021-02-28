import React from "react";

export function CountUp({ countUp }) {
  return (
    <div>
      <h4>CountUp</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();
          countUp();
        }}
      >
        <label>CountUp</label>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="CountUp" />
        </div>
      </form>
    </div>
  );
}
