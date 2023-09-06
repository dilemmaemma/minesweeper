import React, { useState, useEffect } from 'react';

const initialBoard = {
  width: 16,
  height: 16,
  bombs: 40, // You can adjust the number of bombs as needed.
  error: '',
};

const CustomBoard = () => {
  const [board, setBoard] = useState(initialBoard);

  const isDisabled = () => {
    // Adjust the validation criteria for your 16x16 board.
    return (
      board.width === 16 &&
      board.height === 16 &&
      board.bombs >= 1 &&
      board.bombs <= 255
    )
      ? false
      : true;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setBoard({ ...board, [name]: value });
  };

  const onReset = () => {
    setBoard(initialBoard);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Handle the submission as needed.
    console.log('Submitted:', board);
    onReset();
  };

  useEffect(() => {
    // Validate the board dimensions and number of bombs.
    if (board.width !== 16 || board.height !== 16) {
      setBoard({
        ...board,
        error: 'Board dimensions must be 16x16.',
      });
    } else if (board.bombs < 1 || board.bombs > 255) {
      setBoard({
        ...board,
        error: 'Number of bombs must be between 1 and 255.',
      });
    } else {
      setBoard({ ...board, error: '' });
    }
  }, [board.width, board.height, board.bombs]);

  return (
    <div>
      <form id="custom-board" onSubmit={onSubmit} onReset={onReset}>
        <h2>Create Custom Board</h2>
        <div>
          <label htmlFor="width">Width/Rows:&nbsp;</label>
          <input
            type="number"
            name="width"
            id="width"
            placeholder="Width"
            step="1"
            min="8"
            max="50"
            onChange={onChange}
            value={board.width !== 0 ? board.width : ''}
          />
          <p>Must be 16</p>
        </div>
        <div>
          <label htmlFor="height">Height/Columns:&nbsp;</label>
          <input
            type="number"
            name="height"
            id="height"
            step="1"
            min="8"
            max="50"
            placeholder="Height"
            onChange={onChange}
            value={board.height !== 0 ? board.height : ''}
          />
          <p>Must be 16</p>
        </div>
        <div>
          <label htmlFor="bombs">Bombs:&nbsp;</label>
          <input
            type="number"
            name="bombs"
            id="bombs"
            step="1"
            min="1"
            max="255"
            placeholder="Bombs"
            onChange={onChange}
            value={board.bombs !== 0 ? board.bombs : ''}
          />
          <p>Must be between 1 and 255</p>
        </div>
        {board.error && <p id="error">{board.error}</p>}
        <div>
          <button disabled={isDisabled()} id="SubmitForm">
            Submit
          </button>
          <button id="ResetForm">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default CustomBoard;
