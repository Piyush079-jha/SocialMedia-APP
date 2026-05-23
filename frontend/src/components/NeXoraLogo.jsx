import React from 'react';

const css = `
  @keyframes nx-inner-light {
    0%   { background-position: 150% center; }
    100% { background-position: -50% center; }
  }

  @keyframes nx-star-appear {
    0%,  82% { opacity: 0; transform: scale(0)   rotate(0deg);   }
    88%      { opacity: 1; transform: scale(1.5) rotate(25deg);  }
    93%      { opacity: 1; transform: scale(1)   rotate(0deg);   }
    99%      { opacity: 0; transform: scale(0.3) rotate(-10deg); }
    100%     { opacity: 0; transform: scale(0)   rotate(0deg);   }
  }



  .nx-logo {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;
    position: relative;
  }

  .nx-ne {
    font-family: 'Inter', -apple-system, sans-serif;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1;
    display: inline-block;
    background: linear-gradient(
      90deg,
      #4F75FF 0%, #8B5CF6 15%, #c4b5fd 30%,
      #ffffff 50%, #c4b5fd 65%, #8B5CF6 80%, #4F75FF 100%
    );
    background-size: 300% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: nx-inner-light 4s cubic-bezier(0.4,0,0.2,1) infinite;
  }

  .nx-xor {
    font-family: 'Inter', -apple-system, sans-serif;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1;
    display: inline-block;
    background: linear-gradient(
      90deg,
      #e2e8ff 0%, #ffffff 40%, #e2e8ff 60%, #c4b5fd 80%, #e2e8ff 100%
    );
    background-size: 300% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: nx-inner-light 4s cubic-bezier(0.4,0,0.2,1) infinite;
    animation-delay: 0.18s;
  }

  .nx-a {
    font-family: 'Inter', -apple-system, sans-serif;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1;
    display: inline-block;
    position: relative;
    background: linear-gradient(
      90deg,
      #e2e8ff 0%, #ffffff 40%, #e2e8ff 60%, #c4b5fd 80%, #e2e8ff 100%
    );
    background-size: 300% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: nx-inner-light 4s cubic-bezier(0.4,0,0.2,1) infinite;
    animation-delay: 0.32s;
  }

  .nx-star-wrap {
    position: absolute;
    top: -18px;
    right: -7px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 9999;
    overflow: visible;
  }


`;

const SparkStar = ({ size = 15, delay = '0.32s' }) => (
  <svg
    viewBox="0 0 20 20"
    width={size}
    height={size}
    style={{
      position: 'absolute',
      overflow: 'visible',
      filter:
        'drop-shadow(0 0 2px #fff) drop-shadow(0 0 6px #FFD700) drop-shadow(0 0 14px #FF8C00)',
      animation: `nx-star-appear 4s cubic-bezier(0.4,0,0.2,1) infinite`,
      animationDelay: delay,
    }}
  >
    {/* Outer 4-point star */}
    <path
      d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z"
      fill="#FFD700"
    />
    {/* Bright inner highlight */}
    <path
      d="M10 5 L10.9 9.1 L15 10 L10.9 10.9 L10 15 L9.1 10.9 L5 10 L9.1 9.1 Z"
      fill="#FFF9C4"
    />
  </svg>
);

const NeXoraLogo = ({ onClick, large = false }) => {
  const sz    = large ? 46 : 21;
  const starSz = large ? 22 : 14;

  return (
    <>
      <style>{css}</style>
      <div className="nx-logo" onClick={onClick}>
        <span className="nx-ne"  style={{ fontSize: sz }}>Ne</span>
        <span className="nx-xor" style={{ fontSize: sz }}>Xor</span>
        <span className="nx-a"   style={{ fontSize: sz }}>
          a
          <span className="nx-star-wrap">
            {/* 4-point SVG sparkle */}
            <SparkStar size={starSz} delay="0.32s" />
          </span>
        </span>
      </div>
    </>
  );
};

export default NeXoraLogo;
