import yfinance as yf
import pandas as pd
import os

from sqlalchemy import (
    create_engine,
    text
)

from dotenv import load_dotenv

# ==================================
# ENV
# ==================================

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL"
)

engine = create_engine(
    DATABASE_URL
)

# ==================================
# COINS
# ==================================

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

# ==================================
# DOWNLOAD + STORE
# ==================================

for coin in coins:

    print(f"\nDownloading {coin}...")

    try:

        df = yf.download(
            coin,
            period="2y",
            interval="1d",
            auto_adjust=False,
            progress=False
        )

        if df.empty:

            print(f"No data found for {coin}")
            continue

        # Fix yfinance MultiIndex issue

        if isinstance(df.columns, pd.MultiIndex):

            df.columns = [
                col[0]
                for col in df.columns
            ]

        df = df.reset_index()

        print(
            f"{coin} rows downloaded:",
            len(df)
        )

        inserted = 0

        with engine.begin() as conn:

            for record in df.to_dict("records"):

                timestamp = pd.Timestamp(
                
                record["Date"]
                )

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
                        "open_price": float(
                            record["Open"]
                        ),
                        "high_price": float(
                            record["High"]
                        ),
                        "low_price": float(
                            record["Low"]
                        ),
                        "close_price": float(
                            record["Close"]
                        ),
                        "volume": int(
                            record["Volume"]
                        ),
                        "timestamp": timestamp
                    }
                )

                inserted += 1

        print(
            f"{coin}: {inserted} rows inserted"
        )

    except Exception as e:

        print(
            f"Error for {coin}"
        )

        print(e)

print(
    "\nBackfill Completed Successfully!"
)