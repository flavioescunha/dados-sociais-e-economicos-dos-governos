import json
import os
import random

def generate_series(start_val, volatility, trend_fn=None):
    series = {}
    current = start_val
    for year in range(1983, 2027):
        if trend_fn:
            current = trend_fn(year, current)
        current += random.uniform(-volatility, volatility)
        series[str(year)] = max(0, round(current, 2))
    return series

data = {
    "ARG": {
        "gpi": generate_series(2.1, 0.05, lambda y, c: c - 0.01 if y < 2000 else c + 0.01),
        "obi": generate_series(30, 2, lambda y, c: min(100, c + 1.5 if y > 2005 else c)),
        "gcb": generate_series(25, 2, lambda y, c: c - 0.5 if y > 2010 else c),
        "ocp": generate_series(40, 3, lambda y, c: c - 1 if y > 2015 else c),
        "car_theft": generate_series(300, 15)
    },
    "BRA": {
        "gpi": generate_series(2.4, 0.08, lambda y, c: c + 0.02 if y > 2010 else c - 0.01),
        "obi": generate_series(45, 2, lambda y, c: min(100, c + 2 if y > 2000 else c)),
        "gcb": generate_series(20, 1.5, lambda y, c: c - 0.3),
        "ocp": generate_series(35, 2, lambda y, c: c - 0.5),
        "car_theft": generate_series(350, 20, lambda y, c: c - 10 if y > 2017 else c + 5)
    },
    "CHL": {
        "gpi": generate_series(1.8, 0.04, lambda y, c: c + 0.01 if y > 2019 else c - 0.01),
        "obi": generate_series(50, 2, lambda y, c: min(100, c + 1 if y > 1990 else c)),
        "gcb": generate_series(10, 1),
        "ocp": generate_series(20, 1, lambda y, c: c - 0.2),
        "car_theft": generate_series(200, 10, lambda y, c: c + 5 if y > 2020 else c)
    }
}

output_path = os.path.join(os.path.dirname(__file__), 'raw_data', 'local_indicators.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print(f"Mock data generated at {output_path}")
