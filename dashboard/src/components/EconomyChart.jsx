import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea
} from 'recharts';

const formatValue = (value, format, country) => {
  if (value === undefined || value === null) return 'Sem dados';
  
  if (format === 'USD') {
    if (value > 1000000000) return `$${(value / 1000000000).toFixed(2)} Bilhões`;
    if (value > 1000000) return `$${(value / 1000000).toFixed(2)} Milhões`;
    return `$${Number(value).toFixed(2)}`;
  }
  if (format === 'CURRENCY') {
    if (country === 'brasil') return `R$${Number(value).toFixed(2)} Reais`;
    return `$${Number(value).toFixed(2)} Pesos`;
  }
  if (format === 'Anos') return `${Number(value).toFixed(1)} Anos`;
  if (format === '%') return `${Number(value).toFixed(2)}%`;
  
  return Number(value).toFixed(2);
};

const CustomTooltip = ({ active, payload, label, config, country }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <div className="label">{`Ano: ${label}`}</div>
        <div style={{ color: payload[0].color, fontWeight: 'bold' }}>
          {`${payload[0].name}: ${formatValue(payload[0].value, config.format, country)}`}
        </div>
        {data.president && (
          <div className="president-info">
            <span><strong>Presidente:</strong> {data.president}</span>
            <span><strong>Partido:</strong> {data.party}</span>
            <span style={{ 
              color: data.spectrum.includes('left') ? '#ff6b6b' : 
                     data.spectrum.includes('right') ? '#4dabf7' : '#cc5de8' 
            }}>
              <strong>Espectro:</strong> {data.spectrum.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const EconomyChart = ({ data, metric, country }) => {
  const [scaleType, setScaleType] = React.useState('linear');

  const metricConfig = {
    gdp_growth: { name: 'Crescimento do PIB', color: '#00f2fe', stroke: '#4facfe', format: '%' },
    gdp_absolute: { name: 'PIB Total', color: '#00b09b', stroke: '#96c93d', format: 'USD' },
    inflation: { name: 'Inflação', color: '#ff0844', stroke: '#ffb199', format: '%' },
    exchange_rate: { name: 'Câmbio Oficial', color: '#2ecc71', stroke: '#27ae60', format: 'CURRENCY' },
    reserves: { name: 'Reservas Int.', color: '#f39c12', stroke: '#f1c40f', format: 'USD' },
    unemployment: { name: 'Desemprego', color: '#f6d365', stroke: '#fda085', format: '%' },
    poverty: { name: 'Taxa de Pobreza', color: '#e74c3c', stroke: '#c0392b', format: '%' },
    gini: { name: 'Índice Gini', color: '#9b59b6', stroke: '#8e44ad', format: '' },
    life_expectancy: { name: 'Expectativa de Vida', color: '#1abc9c', stroke: '#16a085', format: 'Anos' },
    homicide: { name: 'Taxa de Homicídios', color: '#e74c3c', stroke: '#c0392b', format: '' },
    neet: { name: 'Taxa Nem-Nem', color: '#f39c12', stroke: '#f1c40f', format: '%' },
    lays: { name: 'Anos Ajustados (LAYS)', color: '#3498db', stroke: '#2980b9', format: 'Anos' },
    gcb: { name: 'Vitimização (GCB)', color: '#9b59b6', stroke: '#8e44ad', format: '%' },
    ocp: { name: 'Risco OCP', color: '#34495e', stroke: '#2c3e50', format: '' },
    pets: { name: 'Vazamento (PETS)', color: '#d35400', stroke: '#e67e22', format: '%' },
    car_theft: { name: 'Roubo de Veículos', color: '#3498db', stroke: '#2980b9', format: '' },
    gpi: { name: 'Global Peace Index', color: '#16a085', stroke: '#1abc9c', format: '' },
    pisa: { name: 'PISA', color: '#8e44ad', stroke: '#9b59b6', format: '' }
  };

  const config = metricConfig[metric];

  // Group data to create background bands for presidents
  const presidentBands = [];
  let currentBand = null;

  data.forEach((d) => {
    if (!currentBand) {
      if (d.president) {
        currentBand = { 
          start: d.year, 
          end: d.year, 
          color: d.color, 
          president: d.president 
        };
      }
    } else {
      if (d.president === currentBand.president) {
        currentBand.end = d.year;
      } else {
        presidentBands.push(currentBand);
        if (d.president) {
          currentBand = { 
            start: currentBand.end,
            end: d.year, 
            color: d.color, 
            president: d.president 
          };
        } else {
          currentBand = null;
        }
      }
    }
  });
  if (currentBand) {
    presidentBands.push(currentBand);
  }

  // Handle data for log scale (ensure no values <= 0 for log scale to prevent Recharts crash)
  const chartData = scaleType === 'log' 
    ? data.map(d => ({ ...d, [metric]: d[metric] > 0 ? d[metric] : null })) 
    : data;

  const hasData = chartData.some(d => d[metric] !== null && d[metric] !== undefined);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <div style={{ backgroundColor: '#161b22', borderRadius: '6px', border: '1px solid #30363d', display: 'inline-flex', padding: '2px' }}>
          <button 
            style={{ 
              background: scaleType === 'linear' ? '#21262d' : 'transparent', 
              color: scaleType === 'linear' ? '#c9d1d9' : '#8b949e',
              border: 'none', 
              padding: '4px 12px', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s'
            }}
            onClick={() => setScaleType('linear')}
          >
            Linear
          </button>
          <button 
            style={{ 
              background: scaleType === 'log' ? '#21262d' : 'transparent', 
              color: scaleType === 'log' ? '#c9d1d9' : '#8b949e',
              border: 'none', 
              padding: '4px 12px', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s'
            }}
            onClick={() => setScaleType('log')}
          >
            Logarítmica
          </button>
        </div>
      </div>
      
      <div style={{ width: '100%', height: 500, position: 'relative' }}>
        {!hasData && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#8b949e', fontSize: '18px', zIndex: 10,
            backgroundColor: 'rgba(13, 17, 23, 0.7)',
            borderRadius: '8px'
          }}>
            Nenhum dado disponível para este país/indicador.
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            
            {/* Presidential Backgrounds */}
            {presidentBands.map((band, i) => (
              <ReferenceArea 
                key={i} 
                x1={band.start} 
                x2={band.end} 
                fill={band.color} 
                fillOpacity={0.15} 
              />
            ))}

            <XAxis 
              dataKey="year" 
              stroke="#8b949e" 
              tick={{ fill: '#8b949e' }}
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis 
              scale={scaleType}
              stroke="#8b949e" 
              tick={{ fill: '#8b949e' }}
              tickFormatter={(value) => {
                if (config.format === 'USD') return `$${(value/1000000000).toFixed(0)}B`;
                if (config.format === 'CURRENCY') {
                  if (country === 'brasil') return `R$${value}`;
                  return `$${value}`;
                }
                if (config.format === '%') return `${value}%`;
                return value;
              }}
              domain={scaleType === 'log' ? ['auto', 'auto'] : ['auto', 'auto']}
            />
            
            <Tooltip content={<CustomTooltip config={config} country={country} />} />
            
            <Area 
              type="monotone" 
              dataKey={metric} 
              name={config.name}
              stroke={config.stroke} 
              strokeWidth={3}
              fill={`url(#color${metric})`} 
              fillOpacity={0.3}
              activeDot={{ r: 8, fill: config.stroke, stroke: '#fff', strokeWidth: 2 }}
              connectNulls={true}
            />
            
            <defs>
              <linearGradient id={`color${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.stroke} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={config.stroke} stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EconomyChart;
