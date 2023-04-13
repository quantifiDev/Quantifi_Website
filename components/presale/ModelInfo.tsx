import { useState } from 'react';

type ExpandableHeadingProps = {
  heading: string;
  content: string;
}

function ModelInfo({ heading, content }: ExpandableHeadingProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-bold cursor-pointer text-center" onClick={handleExpand}>
        {heading}
      </h2>
      {isExpanded && <p className="mt-4 text-center">{content}</p>}
    </div>
  );
}

export default ModelInfo;