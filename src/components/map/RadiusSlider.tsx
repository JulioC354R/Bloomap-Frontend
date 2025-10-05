"use client";

interface RadiusSliderProps {
  radius: number;
  setRadius: (r: number) => void;
  min?: number;
  max?: number;
}

const RadiusSlider = ({
  radius,
  setRadius,
  min = 1000,
  max = 100000,
}: RadiusSliderProps) => {
  const stopPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Main component */}
      <div
        onMouseDownCapture={stopPropagation}
        onTouchStartCapture={stopPropagation}
        onClickCapture={stopPropagation}
        onDoubleClickCapture={stopPropagation}
        onWheelCapture={stopPropagation}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "rgba(255,255,255)",
          padding: "10px",
          borderRadius: "8px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)", // Shadow to make it stand out
        }}
      >
        <label style={{ marginBottom: 5, color: "#000000", fontWeight: "bold" }}>
          Radius: {radius} m
        </label>
        <input
          type="range"
          min={min}
          max={max}
          step={500}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          // We add a class to be able to style it with CSS
          className="radius-slider-input"
        />
      </div>

      {/* CSS styles for the range input */}
      <style jsx global>{`
        .radius-slider-input {
          -webkit-appearance: none; /* Remove default WebKit/Blink styling */
          appearance: none;
          width: 150px;
          height: 8px;
          background: #d3d3d3; /* Color of the track */
          border-radius: 5px;
          outline: none;
          opacity: 0.9;
          transition: opacity 0.2s;
        }

        /* Styling for the "thumb" (the sliding handle) for Chrome, Safari, Opera, Edge */
        .radius-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #0960e1; /* Your primary color */
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
        }

        /* Styling for the "thumb" for Firefox */
        .radius-slider-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #0960e1; /* Your primary color */
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }
        
        /* HOVER effect for the "thumb" */
        .radius-slider-input:hover::-webkit-slider-thumb {
            background: #07173f; /* Your hover color */
        }

        .radius-slider-input:hover::-moz-range-thumb {
            background: #07173f; /* Your hover color */
        }
      `}</style>
    </>
  );
};

export default RadiusSlider;