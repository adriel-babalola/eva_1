import { useState } from 'react';
import MapPane from './MapPane';
import LgaStatsSidebar from './LgaStatsSidebar';
import osunWards from '../../data/osunWards.json';
import osunLgaStats from '../../data/osunLgaStats.json';

export default function WardMapView({ theme }) {
  const [selectedWard, setSelectedWard] = useState(null);

  return (
    <div className="panel corner-bracket relative overflow-hidden flex" style={{ minHeight: '520px' }}>
      <div
        className="transition-all duration-[400ms] ease-out"
        style={{ width: selectedWard ? '65%' : '100%', height: '520px' }}
      >
        <MapPane theme={theme} wards={osunWards} selectedWard={selectedWard} onSelect={setSelectedWard} />
      </div>
      {selectedWard && (
        <div 
          className="w-[35%] h-[520px] bg-surface/50 backdrop-blur-md transition-all duration-[400ms] ease-out border-l border-border"
          style={{ animation: 'slideIn 0.4s ease-out forwards' }}
        >
          <LgaStatsSidebar 
            ward={selectedWard} 
            stats={osunLgaStats[selectedWard.lga]} 
            onClose={() => setSelectedWard(null)} 
          />
        </div>
      )}
    </div>
  );
}
