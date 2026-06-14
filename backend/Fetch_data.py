import yfinance as yf
import pandas as pd

coins = [
    "BTC-USD",
    "ETH-USD",
    "SOL-USD",
    "BNB-USD",
    "XRP-USD",
    "ADA-USD",
    "DOGE-USD",
    "AVAX-USD",
    "DOT-USD",
    "LINK-USD"
]

all_data = []

for coin in coins:

    print(f"Downloading {coin}...")

    df = yf.download(
        coin,
        start="2024-01-01",
        auto_adjust=True
    )

    df = df.reset_index()

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df["Symbol"] = coin

    all_data.append(df)

final_df = pd.concat(
    all_data,
    ignore_index=True
)

final_df.to_csv(
    "crypto_historical.csv",
    index=False
)

print(final_df.head())
print(final_df.shape)

print("Crypto Dataset Saved Successfully!")