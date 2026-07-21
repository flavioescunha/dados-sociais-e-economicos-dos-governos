import React, { useState, useEffect } from 'react';
import EconomyChart from './components/EconomyChart';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState('gdp_growth');
  const [country, setCountry] = useState('argentina');

  const metricSources = {
    gdp_growth: 'Fonte: Banco Mundial (World Bank) - Código: NY.GDP.MKTP.KD.ZG',
    gdp_absolute: 'Fonte: Banco Mundial (World Bank) - Código: NY.GDP.MKTP.CD',
    inflation: 'Fonte: Banco Mundial (FMI) - Código: FP.CPI.TOTL.ZG',
    exchange_rate: 'Fonte: Banco Mundial (FMI) - Código: PA.NUS.FCRF',
    reserves: 'Fonte: Banco Mundial (FMI) - Código: FI.RES.TOTL.CD',
    unemployment: 'Fonte: Banco Mundial (OIT) - Código: SL.UEM.TOTL.ZS',
    poverty: 'Fonte: Banco Mundial - Código: SI.POV.UMIC (Pobreza US$ 6.85/dia)',
    gini: 'Fonte: Banco Mundial - Código: SI.POV.GINI',
    life_expectancy: 'Fonte: Banco Mundial - Código: SP.DYN.LE00.IN',
    homicide: 'Fonte: Banco Mundial (UNODC) - Código: VC.IHR.PSRC.P5',
    neet: 'Fonte: Banco Mundial (OIT) - Código: SL.UEM.NEET.ZS',
    lays: 'Fonte: Banco Mundial - Código: HD.HCI.LAYS',
    gcb: 'Fonte: Transparência Internacional (Global Corruption Barometer)',
    ocp: 'Fonte: Open Contracting Partnership',
    obi: 'Fonte: International Budget Partnership (Open Budget Index)',
    car_theft: 'Fonte: Secretarias Estaduais de Segurança Pública',
    gpi: 'Fonte: Institute for Economics & Peace',
    pisa: 'Fonte: OCDE (PISA)'
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

  const metricDescriptions = {
    gdp_growth: 'Mede a variação percentual anual do Produto Interno Bruto (ritmo de crescimento ou contração da economia).',
    gdp_absolute: 'Mede o valor total de todos os bens e serviços produzidos no país em um ano, convertido em Dólares Americanos.',
    inflation: 'Reflete o aumento generalizado dos preços e a perda do poder de compra da moeda local ao longo de um ano.',
    exchange_rate: 'Representa a taxa de câmbio oficial em relação ao Dólar Americano (quanto vale 1 US$ na moeda local).',
    reserves: 'Indica o montante de moeda estrangeira acumulado pelo Banco Central, crucial para a estabilidade econômica.',
    unemployment: 'Mostra o percentual da força de trabalho que está ativamente buscando emprego, mas não consegue encontrar.',
    poverty: 'Percentual da população que vive com menos de US$ 6,85 por dia (linha internacional de pobreza para a região).',
    gini: 'Mede a desigualdade de renda (de 0 a 100). Valores maiores indicam maior concentração de riqueza (desigualdade).',
    life_expectancy: 'Média de anos de vida esperada para um recém-nascido, refletindo a qualidade geral de saúde e bem-estar.',
    homicide: 'Taxa de homicídios intencionais por 100 mil habitantes. Padrão ouro para medir violência extrema devido à baixíssima subnotificação.',
    neet: 'Taxa de Jovens "Nem-Nem" (15 a 24 anos) que não estudam, não trabalham e não estão em treinamento.',
    lays: 'Anos de Escolaridade Ajustados pela Aprendizagem (LAYS). Combina o tempo gasto na escola com a qualidade do aprendizado.',
    gcb: 'Barômetro Global da Corrupção (GCB). Porcentagem de pessoas que relatam experiência direta de pagamento de propinas.',
    ocp: 'Open Contracting Partnership. Analisa contratos públicos para identificar "bandeiras vermelhas" (ex: licitações de concorrente único).',
    obi: 'Open Budget Index (OBI). Mede a transparência, participação do público e rigor na fiscalização do orçamento governamental.',
    car_theft: 'Taxa de roubo e furto de veículos. Melhor termômetro para crimes patrimoniais dada a notificação para o seguro ser quase 100%.',
    gpi: 'Índice Global da Paz. Combina múltiplos indicadores desde taxa de encarceramento até percepção de segurança.',
    pisa: 'PISA (Programa Internacional de Avaliação de Estudantes). Mede competências de alunos de 15 anos em leitura, matemática e ciências.'
  };

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
          <button 
            className={`control-btn ${country === 'chile' ? 'active' : ''}`} 
            onClick={() => setCountry('chile')}
          >
            Chile
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
              <button className={`control-btn ${activeMetric === 'gdp_absolute' ? 'active' : ''}`} onClick={() => setActiveMetric('gdp_absolute')}>PIB Total (USD)</button>
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
            
            <h3>Educação</h3>
            <div className="controls">
              <button className={`control-btn ${activeMetric === 'pisa' ? 'active' : ''}`} onClick={() => setActiveMetric('pisa')}>PISA</button>
              <button className={`control-btn ${activeMetric === 'lays' ? 'active' : ''}`} onClick={() => setActiveMetric('lays')}>LAYS (Anos Ajustados)</button>
              <button className={`control-btn ${activeMetric === 'neet' ? 'active' : ''}`} onClick={() => setActiveMetric('neet')}>Taxa "Nem-Nem" (%)</button>
            </div>
            
            <h3>Criminalidade e Corrupção</h3>
            <div className="controls">
              <button className={`control-btn ${activeMetric === 'homicide' ? 'active' : ''}`} onClick={() => setActiveMetric('homicide')}>Taxa de Homicídios</button>
              <button className={`control-btn ${activeMetric === 'car_theft' ? 'active' : ''}`} onClick={() => setActiveMetric('car_theft')}>Roubo de Veículos</button>
              <button className={`control-btn ${activeMetric === 'gpi' ? 'active' : ''}`} onClick={() => setActiveMetric('gpi')}>Global Peace Index</button>
              <button className={`control-btn ${activeMetric === 'gcb' ? 'active' : ''}`} onClick={() => setActiveMetric('gcb')}>GCB (Vitimização)</button>
              <button className={`control-btn ${activeMetric === 'ocp' ? 'active' : ''}`} onClick={() => setActiveMetric('ocp')}>OCP (Red Flags)</button>
              <button className={`control-btn ${activeMetric === 'obi' ? 'active' : ''}`} onClick={() => setActiveMetric('obi')}>Open Budget Index</button>
            </div>
          </div>

          <div className="chart-card">
            <div style={{ padding: '0 20px', marginBottom: '10px', color: '#c9d1d9', fontSize: '0.95em', fontStyle: 'italic', textAlign: 'center' }}>
              ℹ️ {metricDescriptions[activeMetric]}
            </div>
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
