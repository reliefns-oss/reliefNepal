'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

const MAJOR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
];

const CURRENCY_LABELS = {
  USD: 'US Dollar',
  CAD: 'Canadian Dollar',
  SGD: 'Singapore Dollar',
  INR: 'Indian Rupee',
  EUR: 'Euro',
};

export default function ForexSection({ compact = false, currencies = null }) {
  const [rates, setRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayCurrencies = currencies || MAJOR_CURRENCIES.map(c => c.code);

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/NPR');
      if (!response.ok) throw new Error('Failed to fetch rates');
      const data = await response.json();

      const filteredRates = {};
      displayCurrencies.forEach(code => {
        if (data.rates[code]) {
          filteredRates[code] = data.rates[code];
        }
      });

      setRates(filteredRates);
      setLastUpdated(data.date);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatRate = (rate) => {
    if (rate >= 1) return rate.toFixed(4);
    if (rate >= 0.01) return rate.toFixed(4);
    return rate.toFixed(6);
  };

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        <p className="text-sm">Unable to load rates</p>
        <button onClick={fetchRates} className="mt-1 text-xs underline hover:text-forest-900">Retry</button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="rn-hero-forex-compact" aria-label="Foreign exchange rates">
        <h3>Exchange Rates</h3>
        {loading ? (
          <div className="space-y-2">
            {displayCurrencies.slice(0, 5).map((code) => (
              <div key={code} className="h-8 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <table role="table">
            <thead>
              <tr>
                <th>Currency</th>
                <th className="currency-rate">1 NPR =</th>
                <th className="currency-inverse">1 Unit = NPR</th>
              </tr>
            </thead>
            <tbody>
              {displayCurrencies.map((code) => {
                const rate = rates[code];
                if (!rate) return null;
                const inverseRate = (1 / rate).toFixed(2);
                const label = CURRENCY_LABELS[code] || code;
                return (
                  <tr key={code}>
                    <td className="currency-code">{code}</td>
                    <td className="currency-rate">{formatRate(rate)}</td>
                    <td className="currency-inverse">{inverseRate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && lastUpdated && (
          <p className="mt-3 text-xs text-white/40 text-center">
            Updated {new Date(lastUpdated).toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>
    );
  }

  // Full page version
  return (
    <section className="py-12 bg-white border-y border-slate-200" aria-labelledby="forex-heading">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 id="forex-heading" className="text-2xl font-bold text-forest-900">
              Foreign Exchange Rates
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              1 NPR = Units of foreign currency | Source: Nepal Rastra Bank via exchangerate-api.com
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-slate-500 hidden sm:inline">
                Updated: {new Date(lastUpdated).toLocaleDateString('en-NP', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
            <button
              onClick={fetchRates}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-forest-700 hover:text-forest-900 font-medium"
              aria-label="Refresh forex rates"
            >
              <RefreshCw size={16} className={`${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" role="status" aria-live="polite">
            {MAJOR_CURRENCIES.slice(0, 15).map(({ code, name, symbol }) => (
              <div key={code} className="bg-slate-50 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-8 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="bg-forest-50 border-b border-forest-100">
                  <th className="text-left py-3 px-4 font-semibold text-forest-900">Currency</th>
                  <th className="text-right py-3 px-4 font-semibold text-forest-900">Rate (per 1 NPR)</th>
                  <th className="text-right py-3 px-4 font-semibold text-forest-900">1 Unit = NPR</th>
                </tr>
              </thead>
              <tbody>
                {MAJOR_CURRENCIES.map(({ code, name, symbol }) => {
                  const rate = rates[code];
                  if (!rate) return null;
                  const inverseRate = (1 / rate).toFixed(2);
                  return (
                    <tr key={code} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 font-bold text-xs">
                            {code.slice(0, 2)}
                          </span>
                          <div>
                            <p className="font-medium text-slate-900">{name}</p>
                            <p className="text-xs text-slate-500">{code} {symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        {formatRate(rate)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        {inverseRate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-xs text-slate-500 text-center">
          Rates are indicative and sourced from{' '}
          <a href="https://www.exchangerate-api.com/" target="_blank" rel="noopener noreferrer" className="text-forest-700 underline hover:text-forest-900">
            exchangerate-api.com
          </a>
          {' '}(based on NRB published rates). For official transactions, please check with your bank or{' '}
          <a href="https://www.nrb.org.np/forex/" target="_blank" rel="noopener noreferrer" className="text-forest-700 underline hover:text-forest-900">
            Nepal Rastra Bank
          </a>
          {' '}official website.
        </p>
      </div>
    </section>
  );
}