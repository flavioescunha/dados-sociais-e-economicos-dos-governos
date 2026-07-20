import React, { useState, useEffect } from 'react';
import EconomyChart from './components/EconomyChart';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState('gdp_growth');
  const [country, setCountry] = useState('argentina');

  const metricSources = {
    gdp_growth: 'Fonte: Banco Mundial (World Bank) - Código: NY.GDP.MKTP.KD.ZG',
    inflation: 'Fonte: Banco Mundial (FMI) - Código: FP.CPI.TOTL.ZG',
    exchange_rate: 'Fonte: Banco Mundial (FMI) - Código: PA.NUS.FCRF',
    reserves: 'Fonte: Banco Mundial (FMI) - Código: FI.RES.TOTL.CD',
    unemployment: 'Fonte: Banco Mundial (OIT) - Código: SL.UEM.TOTL.ZS',
    poverty: 'Fonte: Banco Mundial - Código: SI.POV.NAHC',
    gini: 'Fonte: Banco Mundial - Código: SI.POV.GINI',
    life_expectancy: 'Fonte: Banco Mundial - Código: SP.DYN.LE00.IN'
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}${country}_data.json`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, [country]);

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Análise Socioeconômica (1983 - Atual)</h1>
        <p>Impacto econômico e social através de diferentes espectros políticos</p>
        <div className="country-selector" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button 
            className={`control-btn ${country === 'argentina' ? 'active' : ''}`} 
            onClick={() => setCountry('argentina')}
          >
            Argentina
          </button>
          <button 
            className={`control-btn ${country === 'brasil' ? 'active' : ''}`} 
            onClick={() => setCountry('brasil')}
          >
            Brasil
          </button>
        </div>
      </header>

      {loading ? (
        <div className="header"><h2>Carregando dados...</h2></div>
      ) : (
        <>
          <div className="metrics-section">
            <h3>Indicadores Econômicos</h3>
            <div className="controls">
              <button className={`control-btn ${activeMetric === 'gdp_growth' ? 'active' : ''}`} onClick={() => setActiveMetric('gdp_growth')}>Crescimento PIB (%)</button>
              <button className={`control-btn ${activeMetric === 'inflation' ? 'active' : ''}`} onClick={() => setActiveMetric('inflation')}>Inflação (%)</button>
              <button className={`control-btn ${activeMetric === 'exchange_rate' ? 'active' : ''}`} onClick={() => setActiveMetric('exchange_rate')}>Câmbio Oficial</button>
              <button className={`control-btn ${activeMetric === 'reserves' ? 'active' : ''}`} onClick={() => setActiveMetric('reserves')}>Reservas Int. (USD)</button>
            </div>
            
            <h3>Indicadores Sociais</h3>
            <div className="controls">
              <button className={`control-btn ${activeMetric === 'unemployment' ? 'active' : ''}`} onClick={() => setActiveMetric('unemployment')}>Desemprego (%)</button>
              <button className={`control-btn ${activeMetric === 'poverty' ? 'active' : ''}`} onClick={() => setActiveMetric('poverty')}>Taxa de Pobreza (%)</button>
              <button className={`control-btn ${activeMetric === 'gini' ? 'active' : ''}`} onClick={() => setActiveMetric('gini')}>Índice Gini</button>
              <button className={`control-btn ${activeMetric === 'life_expectancy' ? 'active' : ''}`} onClick={() => setActiveMetric('life_expectancy')}>Exp. de Vida (Anos)</button>
            </div>
          </div>

          <div className="chart-card">
            <EconomyChart data={data} metric={activeMetric} country={country} />
            <div className="data-source">
              <p>{metricSources[activeMetric]}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
