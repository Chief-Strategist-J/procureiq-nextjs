"use client";

import React, { useEffect, useState } from "react";
import { CryptoService, CryptoDetailsData, CryptoMoversData, CryptoOrderbook, CryptoTradesData, CryptoKlinesData } from "@/features/crypto";
import { Activity, TrendingUp, TrendingDown, RefreshCw, BarChart2 } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CryptoDashboard() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [symbols, setSymbols] = useState<string[]>(["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"]);
  const [details, setDetails] = useState<CryptoDetailsData | null>(null);
  const [movers, setMovers] = useState<CryptoMoversData | null>(null);
  const [orderbook, setOrderbook] = useState<CryptoOrderbook | null>(null);
  const [trades, setTrades] = useState<CryptoTradesData | null>(null);
  const [klines, setKlines] = useState<CryptoKlinesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [syms, det, mov, ob, tr, kl] = await Promise.all([
        CryptoService.getSymbols().catch(() => ["BTCUSDT", "ETHUSDT", "BNBUSDT"]),
        CryptoService.getDetails(symbol),
        CryptoService.getMovers(),
        CryptoService.getOrderbook(symbol, 5),
        CryptoService.getTrades(symbol, 5),
        CryptoService.getKlines(symbol, "1d", 10),
      ]);
      if (syms && syms.length > 0) setSymbols(syms.slice(0, 10));
      setDetails(det);
      setMovers(mov);
      setOrderbook(ob);
      setTrades(tr);
      setKlines(kl);
    } catch (err: any) {
      setError(err.message || "Failed to load crypto data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [symbol]);

  const chartData = klines?.klines.map((k) => ({
    time: new Date(k.openTime).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    price: k.close,
  })) || [];

  const [currency, setCurrency] = useState<string>("USD");

  const CURRENCY_RATES: Record<string, { symbol: string; rate: number }> = {
    USD: { symbol: "$", rate: 1.0 },
    EUR: { symbol: "€", rate: 0.92 },
    GBP: { symbol: "£", rate: 0.78 },
    JPY: { symbol: "¥", rate: 155.0 },
    INR: { symbol: "₹", rate: 83.5 },
  };

  const formatPrice = (val?: number) => {
    if (val === undefined || val === null) return "0";
    const curr = CURRENCY_RATES[currency] || CURRENCY_RATES["USD"];
    const converted = val * curr.rate;
    return `${curr.symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-tight flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-emerald-400" /> Market & Crypto Intelligence
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Real-time market ticker streams, order books, and price movements from Spring Boot backend.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1">
            <span className="text-[11px] text-zinc-500 font-medium uppercase">Display Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-xs text-white outline-none cursor-pointer"
            >
              {Object.keys(CURRENCY_RATES).map((c) => (
                <option key={c} value={c} className="bg-zinc-900 text-white">
                  {c} ({CURRENCY_RATES[c].symbol})
                </option>
              ))}
            </select>
          </div>

          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded-md px-3 py-2 outline-none focus:border-zinc-600"
          >
            {symbols.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={fetchData}
            className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-xs px-3 py-2 rounded-md hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-950/40 border border-red-800/60 text-red-400 text-xs">
          {error}
        </div>
      )}

      {details && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <span className="text-xs text-zinc-500">Asset Symbol</span>
            <div className="text-xl font-medium text-emerald-400 mt-1">{details.symbol}</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <span className="text-xs text-zinc-500">Current Price ({currency})</span>
            <div className="text-xl font-medium mt-1">{formatPrice(details.currentPrice)}</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <span className="text-xs text-zinc-500">24h Change</span>
            <div
              className={`text-xl font-medium mt-1 flex items-center gap-1 ${
                details.change24hPercent >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {details.change24hPercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {details.change24hPercent}%
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <span className="text-xs text-zinc-500">24h High / Low ({currency})</span>
            <div className="text-sm font-medium mt-1">
              {formatPrice(details.high24h)} / {formatPrice(details.low24h)}
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <span className="text-xs text-zinc-500">24h Volume</span>
            <div className="text-sm font-medium mt-1">{details.volume24h?.toLocaleString()}</div>
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4 mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
            Price Movement ({symbol})
          </div>
          <ChartContainer
            config={{
              price: {
                label: "Price",
                color: "#10b981",
              },
            }}
            className="h-48 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} domain={["auto", "auto"]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "12px", color: "#fff" }}
                />
                <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="rounded-lg border border-zinc-800 overflow-hidden bg-zinc-950/40">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Order Book ({symbol})</h2>
            <Activity className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="p-4 space-y-4 text-xs font-mono">
            <div>
              <div className="text-rose-400 font-semibold mb-1">Asks (Sell Orders)</div>
              {orderbook?.asks.map((ask, idx) => (
                <div key={idx} className="flex justify-between py-0.5 text-zinc-400">
                  <span>${ask.price}</span>
                  <span>{ask.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-800/80 pt-2">
              <div className="text-emerald-400 font-semibold mb-1">Bids (Buy Orders)</div>
              {orderbook?.bids.map((bid, idx) => (
                <div key={idx} className="flex justify-between py-0.5 text-zinc-400">
                  <span>${bid.price}</span>
                  <span>{bid.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 overflow-hidden bg-zinc-950/40">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Recent Trades ({symbol})</h2>
            <Activity className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="p-4 text-xs font-mono">
            <div className="grid grid-cols-3 text-zinc-500 border-b border-zinc-800 pb-1 mb-2">
              <span>Price</span>
              <span>Qty</span>
              <span>Time</span>
            </div>
            {trades?.trades.map((t) => (
              <div key={t.tradeId} className="grid grid-cols-3 py-1 text-zinc-300">
                <span className={t.isBuyerMaker ? "text-rose-400" : "text-emerald-400"}>${t.price}</span>
                <span>{t.qty}</span>
                <span className="text-zinc-500">{new Date(t.time).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 overflow-hidden bg-zinc-950/40">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Top Market Gainers</h2>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="p-4 text-xs font-mono space-y-2">
            {movers?.topGainers.slice(0, 6).map((m) => (
              <div key={m.symbol} className="flex justify-between items-center py-1 border-b border-zinc-900">
                <span className="text-zinc-200 font-semibold">{m.symbol}</span>
                <span>${m.lastPrice}</span>
                <span className="text-emerald-400">+{m.priceChangePercent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

