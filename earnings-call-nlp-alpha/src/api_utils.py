import os
import time
import json
from pathlib import Path
from typing import Any, Dict, Optional
import requests
from src.logging_config import logger

DEFAULT_TIMEOUT = 30
MAX_RETRIES = 4
BACKOFF_FACTOR = 1.5

def get_alpha_vantage_key() -> Optional[str]:
    """Retrieves API key securely from environment variable or Google Colab userdata."""
    key = os.environ.get("ALPHA_VANTAGE_API_KEY")
    if key:
        return key
    try:
        from google.colab import userdata  # type: ignore
        return userdata.get("ALPHA_VANTAGE_API_KEY")
    except Exception:
        return None

def fetch_with_retry(
    url: str,
    params: Optional[Dict[str, Any]] = None,
    headers: Optional[Dict[str, str]] = None,
    timeout: int = DEFAULT_TIMEOUT,
    max_retries: int = MAX_RETRIES
) -> Dict[str, Any]:
    """Robust HTTP GET with exponential backoff and rate-limit handling."""
    delay = 1.0
    for attempt in range(1, max_retries + 1):
        try:
            response = requests.get(url, params=params, headers=headers, timeout=timeout)
            if response.status_code == 200:
                try:
                    data = response.json()
                    # Check for Alpha Vantage rate limit message
                    if isinstance(data, dict) and ("Note" in data or "Information" in data):
                        logger.warning(f"API Rate limit hit: {data.get('Note', data.get('Information'))}")
                        time.sleep(12.0)
                        continue
                    return data
                except json.JSONDecodeError as err:
                    logger.error(f"JSON decode failed on attempt {attempt}: {err}")
            elif response.status_code in (429, 500, 502, 503, 504):
                logger.warning(f"HTTP {response.status_code} received. Retrying in {delay:.1f}s...")
                time.sleep(delay)
                delay *= BACKOFF_FACTOR
            else:
                response.raise_for_status()
        except requests.exceptions.RequestException as exc:
            logger.warning(f"Network error on attempt {attempt}/{max_retries}: {exc}")
            if attempt == max_retries:
                raise
            time.sleep(delay)
            delay *= BACKOFF_FACTOR
    raise RuntimeError(f"Failed to fetch data from {url} after {max_retries} attempts.")

def fetch_transcript(ticker: str, quarter: str, cache_dir: Path = Path("data/raw/transcripts")) -> Dict[str, Any]:
    """Fetches quarterly earnings transcript from cache or Alpha Vantage EARNINGS_CALL_TRANSCRIPT."""
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_file = cache_dir / f"{ticker}_{quarter}.json"
    if cache_file.exists():
        logger.info(f"Loading cached transcript for {ticker} {quarter}")
        with open(cache_file, "r", encoding="utf-8") as f:
            return json.load(f)

    api_key = get_alpha_vantage_key()
    if not api_key:
        logger.warning(f"ALPHA_VANTAGE_API_KEY not configured. Falling back to demonstration dataset for {ticker} {quarter}.")
        return {"ticker": ticker, "quarter": quarter, "status": "DEMO_FALLBACK", "transcript": []}

    url = "https://www.alphavantage.co/query"
    params = {
        "function": "EARNINGS_CALL_TRANSCRIPT",
        "symbol": ticker,
        "quarter": quarter,
        "apikey": api_key
    }
    logger.info(f"Requesting Alpha Vantage transcript for {ticker} {quarter}")
    data = fetch_with_retry(url, params=params)
    
    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    return data

def fetch_market_data(ticker: str, start_date: str, end_date: str) -> Any:
    """Fetches market price history using yfinance with defensive fallback."""
    try:
        import yfinance as yf
        logger.info(f"Downloading historical market data for {ticker} [{start_date} to {end_date}]")
        df = yf.download(ticker, start=start_date, end=end_date, progress=False)
        if df.empty:
            logger.warning(f"Empty market data returned for {ticker}.")
        return df
    except Exception as exc:
        logger.error(f"yfinance download failed for {ticker}: {exc}")
        return None

def fetch_earnings(ticker: str) -> Dict[str, Any]:
    """Fetches historical EPS and Revenue estimates vs reported values."""
    api_key = get_alpha_vantage_key()
    if not api_key:
        logger.info(f"Using cached or demo earnings record for {ticker}")
        return {"symbol": ticker, "quarterlyEarnings": []}
    url = "https://www.alphavantage.co/query"
    params = {"function": "EARNINGS", "symbol": ticker, "apikey": api_key}
    return fetch_with_retry(url, params=params)

def fetch_sec_data(ticker: str) -> Dict[str, Any]:
    """Retrieves official SEC EDGAR company submission metadata."""
    headers = {"User-Agent": "QuantitativeResearchLab research@firm.com"}
    url = f"https://data.sec.gov/submissions/CIK{ticker.zfill(10)}.json"
    try:
        res = requests.get(url, headers=headers, timeout=DEFAULT_TIMEOUT)
        if res.status_code == 200:
            return res.json()
    except Exception as exc:
        logger.warning(f"SEC EDGAR lookup skipped for {ticker}: {exc}")
    return {}
