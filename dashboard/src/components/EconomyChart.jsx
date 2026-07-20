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
  const metricConfig = {
    gdp_growth: { name: 'Crescimento do PIB', color: '#00f2fe', stroke: '#4facfe', format: '%' },
    inflation: { name: 'Inflação', color: '#ff0844', stroke: '#ffb199', format: '%' },
    exchange_rate: { name: 'Câmbio Oficial', color: '#2ecc71', stroke: '#27ae60', format: 'CURRENCY' },
    reserves: { name: 'Reservas Int.', color: '#f39c12', stroke: '#f1c40f', format: 'USD' },
    unemployment: { name: 'Desemprego', color: '#f6d365', stroke: '#fda085', format: '%' },
    poverty: { name: 'Taxa de Pobreza', color: '#e74c3c', stroke: '#c0392b', format: '%' },
    gini: { name: 'Índice Gini', color: '#9b59b6', stroke: '#8e44ad', format: '' },
    life_expectancy: { name: 'Expectativa de Vida', color: '#1abc9c', stroke: '#16a085', format: 'Anos' }
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

  return (
    <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
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
            domain={['auto', 'auto']}
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
  );
};

export default EconomyChart;
