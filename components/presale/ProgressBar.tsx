import { useState, useEffect } from 'react';

const ProgressBar = ({ percent = 0 }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(percent);
    console.log(percent);
  }, [percent]);

  return (
    <div className="relative h-4 rounded-full bg-gray-300">
      <div
        className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;