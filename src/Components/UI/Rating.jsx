import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ rating = 0, count = 0 }) => {
  const stars = [];

  // Create 5 stars based on the rating value
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-accent" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-accent" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-accent" />);
    }
  }

  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className="flex text-[13px]">{stars}</div>
      <span className="text-[10px] text-lText">{`(${count})`}</span>
    </div>
  );
};

export default Rating;
