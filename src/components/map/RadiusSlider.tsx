"use an client";

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
      {/* Componente principal */}
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
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)", // Sombra para dar destaque
        }}
      >
        <label style={{ marginBottom: 5, color: "#000000", fontWeight: "bold" }}>
          Raio: {radius} m
        </label>
        <input
          type="range"
          min={min}
          max={max}
          step={500}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          // Adicionamos uma classe para poder estilizar com CSS
          className="radius-slider-input"
        />
      </div>

      {/* Estilos CSS para o input range */}
      <style jsx global>{`
        .radius-slider-input {
          -webkit-appearance: none; /* Remove o estilo padrão do WebKit/Blink */
          appearance: none;
          width: 150px;
          height: 8px;
          background: #d3d3d3; /* Cor da barrinha (track) */
          border-radius: 5px;
          outline: none;
          opacity: 0.9;
          transition: opacity 0.2s;
        }

        /* Estilização do "thumb" (o botão deslizante) para Chrome, Safari, Opera, Edge */
        .radius-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #0960e1; /* Sua cor principal */
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
        }

        /* Estilização do "thumb" para Firefox */
        .radius-slider-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #0960e1; /* Sua cor principal */
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }
        
        /* Efeito HOVER para o "thumb" */
        .radius-slider-input:hover::-webkit-slider-thumb {
            background: #07173f; /* Sua cor de hover */
        }

        .radius-slider-input:hover::-moz-range-thumb {
            background: #07173f; /* Sua cor de hover */
        }
      `}</style>
    </>
  );
};

export default RadiusSlider;