from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:Hasrm%40713@localhost:5432/alphaforge"

engine = create_engine(DATABASE_URL)

with engine.connect():
    print("Connected to alphaforge")