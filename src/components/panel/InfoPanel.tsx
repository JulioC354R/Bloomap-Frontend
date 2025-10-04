"use client";

import { AnalysisData } from "../map/MapLoader"; 

// 2. Definimos que o componente espera receber uma prop 'data'
interface InfoPanelProps {
  data: AnalysisData;
}

const panelStyles = {
  position: 'fixed' as const,
  top: '20px',
  right: '20px',
  width: '400px',
  height: 'calc(100vh - 40px)',
  backgroundColor: 'rgba(30, 41, 59, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  padding: '24px',
  color: 'white',
  overflowY: 'auto' as const,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  zIndex: 1000 
};

const InfoPanel = ({ data }: InfoPanelProps) => { // 3. Recebemos 'data' como prop
  return (
    <div style={panelStyles}>
      {/* 4. Usamos o nome do estado que veio nos dados */}
      <h2 className="text-2xl font-bold mb-4">Análise Ecológica: {data.name}</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-green-400 mb-2">Pulso Verde Anual</h3>
        <p className="text-sm text-slate-300">Aqui entrará o gráfico de NDVI...</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-yellow-400 mb-2">Protagonistas da Floração</h3>
        <p className="text-sm text-slate-300">Aqui entrará a galeria de plantas...</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-blue-400 mb-2">Polinizadores da Região</h3>
        <p className="text-sm text-slate-300">Aqui entrará o resumo de abelhas...</p>
      </div>
    </div>
  );
};

export default InfoPanel;