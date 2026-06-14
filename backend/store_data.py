import yfinance as yf
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# -----------------------------
# LOAD ENV VARIABLES
# -----------------------------

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

# -----------------------------
# COINS TO TRACK
# -----------------------------

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

# -----------------------------
# FETCH & STORE DATA
# -----------------------------

for coin in coins:

    print(f"\nFetching {coin}...")

    try:

        ticker = yf.Ticker(coin)

        data = ticker.history(period="1d")

        if data.empty:
            print(f"No data found for {coin}")
            continue

        row = data.iloc[-1]

        with engine.connect() as conn:

            conn.execute(
                text("""
                INSERT INTO market_data
                (
                    symbol,
                    open_price,
                    high_price,
                    low_price,
                    close_price,
                    volume,
                    timestamp
                )
                VALUES
                (
                    :symbol,
                    :open_price,
                    :high_price,
                    :low_price,
                    :close_price,
                    :volume,
                    :timestamp
                )
                """),
                {
                    "symbol": coin,
                    "open_price": float(row["Open"]),
                    "high_price": float(row["High"]),
                    "low_price": float(row["Low"]),
                    "close_price": float(row["Close"]),
                    "volume": int(row["Volume"]),
                    "timestamp": row.name.to_pydatetime()
                }
            )

            conn.commit()

        print(f" {coin} stored successfully")

    except Exception as e:

        print(f" Error storing {coin}")
        print(e)

print("\n All coins processed Successfully!")