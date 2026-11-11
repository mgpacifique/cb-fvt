# Raw Data Drop Directory (`data/raw/`)

Drop your downloaded datasets from FEWS NET, WFP, or HDX directly into this folder:

### Supported Formats & Sources:
1. **FEWS NET East Africa Cross-Border Trade Bulletin Annex** (`.csv` or `.xlsx`)
   - Contains volume tonnage and trade directions for Katuna/Gatuna, Busia, Malaba, Rusumo.
2. **HDX / WFP Food Prices** (`.csv`)
   - E.g., `wfp_food_prices_rwanda.csv`, `wfp_food_prices_uganda.csv`, `wfp_food_prices_kenya.csv`, `wfp_food_prices_tanzania.csv`.
3. **EAGC / RATIN Trade Logs** (`.csv` or `.xlsx`).

Our ingestion script in `src/lib/ingestion/` will automatically detect, normalize, and load files from this folder into the database!
