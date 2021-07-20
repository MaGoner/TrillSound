import React, { useEffect } from 'react';

export const TopSlider = () => {
  const postLists = ['bg-1.jpg', 'bg-2.png', 'bg-3.png'];

  let slidingIndex = 0;

  const slidingPosts = postLists.map((post, index) => {
    return (
      <li key={index} className='post slide'>
        <img src={require(`../../../imgs/${post}`)} alt={`ads- ${index + 1}`} />
      </li>
    );
  });

  const shutDownAllDisplayOne = (index) => {
    const allPosts = document.querySelectorAll('.post');
    allPosts.forEach((post) => {
      post.classList.remove('slide');
    });
    allPosts[index].classList.add('slide');
  };
  useEffect(() => {
    shutDownAllDisplayOne(slidingIndex);
  });

  const displaPageNum = (index) => {
    document.querySelector('.slider-pagination > span').innerText = `${
      index + 1
    }/${postLists.length}`;
  };

  const nextPost = () => {
    slidingIndex++;
    if (slidingIndex > postLists.length - 1) slidingIndex = 0;
    shutDownAllDisplayOne(slidingIndex);
    displaPageNum(slidingIndex);
  };
  setInterval(nextPost, 5000);

  const prevPost = () => {
    slidingIndex--;
    if (slidingIndex < 0) slidingIndex = postLists.length - 1;
    shutDownAllDisplayOne(slidingIndex);
    displaPageNum(slidingIndex);
  };

  return (
    <div className='slider-container mobile-only'>
      <div className='sliders'>
        <ul>{slidingPosts}</ul>
        <div className='slider-control'>
          <p className='prev' onClick={prevPost}>
            ❮
          </p>
          <p className='next' onClick={nextPost}>
            ❯
          </p>
        </div>
        <div className='slider-pagination'>
          <span>1/{postLists.length}</span>
        </div>
      </div>
    </div>
  );
};
