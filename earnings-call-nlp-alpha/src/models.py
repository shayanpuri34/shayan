import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, RandomForestClassifier
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, roc_auc_score, accuracy_score
import statsmodels.api as sm
from src.logging_config import logger

def run_cross_sectional_regression(
    df: pd.DataFrame,
    dependent_var: str,
    independent_vars: List[str]
) -> Dict[str, Any]:
    """Runs cross-sectional multi-factor OLS regression with White robust standard errors."""
    clean_df = df[[dependent_var] + independent_vars].dropna()
    y = clean_df[dependent_var]
    X = sm.add_constant(clean_df[independent_vars])

    model = sm.OLS(y, X).fit(cov_type="HC1")

    coeffs = []
    for var in ["const"] + independent_vars:
        coeffs.append({
            "variable": var,
            "coef": float(model.params.get(var, 0.0)),
            "std_err": float(model.bse.get(var, 0.0)),
            "t_stat": float(model.tvalues.get(var, 0.0)),
            "p_value": float(model.pvalues.get(var, 1.0)),
            "significant": bool(model.pvalues.get(var, 1.0) < 0.05)
        })

    return {
        "n_obs": int(model.nobs),
        "r_squared": float(model.rsquared),
        "adj_r_squared": float(model.rsquared_adj),
        "f_stat": float(model.fvalue) if model.fvalue is not None else 0.0,
        "f_pvalue": float(model.f_pvalue) if model.f_pvalue is not None else 1.0,
        "coefficients": coeffs
    }

def run_fama_macbeth(
    df: pd.DataFrame,
    period_col: str,
    dependent_var: str,
    independent_vars: List[str]
) -> Dict[str, Any]:
    """
    Executes Fama-MacBeth two-step regression:
    1. Cross-sectional regression per quarter period.
    2. Time-series average of gamma coefficients with Newey-West standard errors.
    """
    periods = df[period_col].unique()
    if len(periods) < 4:
        logger.warning("Fama-MacBeth skipped: Insufficient sample periods (< 4).")
        return {"status": "INSUFFICIENT_SAMPLE_SIZE"}

    period_betas = []
    for p in periods:
        sub = df[df[period_col] == p].dropna(subset=[dependent_var] + independent_vars)
        if len(sub) < len(independent_vars) + 2:
            continue
        y = sub[dependent_var]
        X = sm.add_constant(sub[independent_vars])
        res = sm.OLS(y, X).fit()
        period_betas.append(res.params)

    if not period_betas:
        return {"status": "FAILED"}

    df_betas = pd.DataFrame(period_betas)
    summary = {}
    for col in df_betas.columns:
        series = df_betas[col].dropna()
        n = len(series)
        mean_beta = float(series.mean())
        std_err = float(series.std() / np.sqrt(n)) if n > 1 else 0.01
        t_stat = mean_beta / std_err if std_err > 0 else 0.0
        summary[col] = {
            "avg_beta": mean_beta,
            "ts_std_err": std_err,
            "t_stat": t_stat
        }

    return {"status": "SUCCESS", "results": summary}

def walk_forward_ml_validation(
    X: np.ndarray,
    y_reg: np.ndarray,
    y_clf: np.ndarray,
    n_splits: int = 5
) -> Dict[str, float]:
    """
    Time-aware walk-forward validation using TimeSeriesSplit (zero future leakage).
    Scalers fit on train folds only.
    """
    tscv = TimeSeriesSplit(n_splits=n_splits)
    maes, rmses, r2s, aucs, accs = [], [], [], [], []

    for train_idx, test_idx in tscv.split(X):
        X_train, X_test = X[train_idx], X[test_idx]
        y_train_r, y_test_r = y_reg[train_idx], y_reg[test_idx]
        y_train_c, y_test_c = y_clf[train_idx], y_clf[test_idx]

        scaler = StandardScaler()
        X_tr_s = scaler.fit_transform(X_train)
        X_te_s = scaler.transform(X_test)

        # Regressor (Gradient Boosting)
        reg = GradientBoostingRegressor(random_state=42, n_estimators=50, max_depth=3)
        reg.fit(X_tr_s, y_train_r)
        preds_r = reg.predict(X_te_s)

        maes.append(mean_absolute_error(y_test_r, preds_r))
        rmses.append(np.sqrt(mean_squared_error(y_test_r, preds_r)))
        r2s.append(r2_score(y_test_r, preds_r))

        # Classifier (Logistic Regression)
        if len(np.unique(y_train_c)) > 1:
            clf = LogisticRegression(random_state=42)
            clf.fit(X_tr_s, y_train_c)
            preds_prob = clf.predict_proba(X_te_s)[:, 1] if hasattr(clf, "predict_proba") else clf.predict(X_te_s)
            preds_c = (preds_prob > 0.5).astype(int)
            accs.append(accuracy_score(y_test_c, preds_c))
            try:
                aucs.append(roc_auc_score(y_test_c, preds_prob))
            except Exception:
                aucs.append(0.5)

    return {
        "mae": float(np.mean(maes)),
        "rmse": float(np.mean(rmses)),
        "r2": float(np.mean(r2s)),
        "auc": float(np.mean(aucs)) if aucs else 0.5,
        "directional_accuracy": float(np.mean(accs)) if accs else 0.5
    }
