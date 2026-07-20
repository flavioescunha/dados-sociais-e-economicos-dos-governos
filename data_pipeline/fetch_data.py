import requests
import json
import os
from datetime import datetime

INDICATORS = {
    'gdp_growth': 'NY.GDP.MKTP.KD.ZG',
    'gdp_absolute': 'NY.GDP.MKTP.CD',
    'inflation': 'FP.CPI.TOTL.ZG',
    'reserves': 'FI.RES.TOTL.CD', 
    'exchange_rate': 'PA.NUS.FCRF', 
    'unemployment': 'SL.UEM.TOTL.ZS',
    'poverty': 'SI.POV.UMIC',
    'gini': 'SI.POV.GINI',
    'life_expectancy': 'SP.DYN.LE00.IN'
}

START_YEAR = 1983
END_YEAR = 2026

def get_president_arg(year):
    if 1983 <= year <= 1989: return {"name": "Raúl Alfonsín", "spectrum": "center-left", "color": "#e74c3c", "party": "UCR"}
    if 1990 <= year <= 1999: return {"name": "Carlos Menem", "spectrum": "right", "color": "#2980b9", "party": "PJ"}
    if 2000 <= year <= 2001: return {"name": "Fernando de la Rúa", "spectrum": "center", "color": "#9b59b6", "party": "UCR"}
    if 2002 <= year <= 2003: return {"name": "Eduardo Duhalde", "spectrum": "center-left", "color": "#e74c3c", "party": "PJ"}
    if 2004 <= year <= 2007: return {"name": "Néstor Kirchner", "spectrum": "left", "color": "#c0392b", "party": "FpV"}
    if 2008 <= year <= 2015: return {"name": "Cristina Kirchner", "spectrum": "left", "color": "#c0392b", "party": "FpV"}
    if 2016 <= year <= 2019: return {"name": "Mauricio Macri", "spectrum": "right", "color": "#2980b9", "party": "Cambiemos"}
    if 2020 <= year <= 2023: return {"name": "Alberto Fernández", "spectrum": "left", "color": "#c0392b", "party": "Frente de Todos"}
    if year >= 2024: return {"name": "Javier Milei", "spectrum": "far-right", "color": "#036570", "party": "La Libertad Avanza"}
    return None

def get_president_bra(year):
    if 1985 <= year <= 1989: return {"name": "José Sarney", "spectrum": "center", "color": "#f1c40f", "party": "PMDB"}
    if 1990 <= year <= 1992: return {"name": "Fernando Collor", "spectrum": "right", "color": "#2980b9", "party": "PRN"}
    if 1993 <= year <= 1994: return {"name": "Itamar Franco", "spectrum": "center", "color": "#f1c40f", "party": "PMDB"}
    if 1995 <= year <= 2002: return {"name": "Fernando Henrique Cardoso", "spectrum": "center-right", "color": "#3498db", "party": "PSDB"}
    if 2003 <= year <= 2010: return {"name": "Luiz Inácio Lula da Silva", "spectrum": "center-left", "color": "#e74c3c", "party": "PT"}
    if 2011 <= year <= 2016: return {"name": "Dilma Rousseff", "spectrum": "center-left", "color": "#e74c3c", "party": "PT"}
    if 2017 <= year <= 2018: return {"name": "Michel Temer", "spectrum": "center-right", "color": "#3498db", "party": "MDB"}
    if 2019 <= year <= 2022: return {"name": "Jair Bolsonaro", "spectrum": "far-right", "color": "#036570", "party": "PSL/PL"}
    if year >= 2023: return {"name": "Luiz Inácio Lula da Silva", "spectrum": "center-left", "color": "#e74c3c", "party": "PT"}
    # Before 1985 (Military Dictatorship)
    if year < 1985: return {"name": "João Figueiredo", "spectrum": "right", "color": "#2c3e50", "party": "ARENA/PDS"}
    return None

def fetch_wb_data(country_code, indicator_code):
    url = f"http://api.worldbank.org/v2/country/{country_code}/indicator/{indicator_code}?format=json&per_page=100"
    print(f"Fetching {indicator_code} for {country_code} from {url}...")
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if len(data) > 1:
            records = data[1]
            return {int(r['date']): r['value'] for r in records if r['value'] is not None}
    return {}

def process_country(country_name, country_code, get_president_fn):
    print(f"Starting data fetch for {country_name}...")
    
    data_by_year = {}
    for year in range(START_YEAR, END_YEAR + 1):
        data_by_year[year] = {
            "year": year,
            "president": None,
            "spectrum": None,
            "color": None,
            "party": None
        }
        for ind in INDICATORS.keys():
            data_by_year[year][ind] = None
    
    fetched_data = {}
    for key, code in INDICATORS.items():
        fetched_data[key] = fetch_wb_data(country_code, code)
    
    for year in range(START_YEAR, END_YEAR + 1):
        for key in INDICATORS.keys():
            if year in fetched_data[key]:
                data_by_year[year][key] = fetched_data[key][year]
            
        president = get_president_fn(year)
        if president:
            data_by_year[year]['president'] = president['name']
            data_by_year[year]['spectrum'] = president['spectrum']
            data_by_year[year]['color'] = president['color']
            data_by_year[year]['party'] = president['party']

    final_data = [data_by_year[y] for y in sorted(data_by_year.keys())]
    
    output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dashboard", "public", f"{country_name.lower()}_data.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2, ensure_ascii=False)
    print(f"Data successfully saved to {output_path}")

def main():
    process_country("Argentina", "ARG", get_president_arg)
    process_country("Brasil", "BRA", get_president_bra)

if __name__ == "__main__":
    main()
