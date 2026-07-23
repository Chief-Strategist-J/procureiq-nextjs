import { NextResponse } from 'next/server';
import { CryptoService } from '@/features/crypto';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'details';
  const symbol = searchParams.get('symbol') || 'BTCUSDT';
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const interval = searchParams.get('interval') || '1d';

  try {
    let data;
    switch (action) {
      case 'symbols':
        data = await CryptoService.getSymbols();
        break;
      case 'price':
        data = await CryptoService.getPrice(symbol);
        break;
      case 'avgPrice':
        data = await CryptoService.getAvgPrice(symbol);
        break;
      case 'bookTicker':
        data = await CryptoService.getBookTicker(symbol);
        break;
      case 'orderbook':
        data = await CryptoService.getOrderbook(symbol, limit);
        break;
      case 'trades':
        data = await CryptoService.getTrades(symbol, limit);
        break;
      case 'movers':
        data = await CryptoService.getMovers();
        break;
      case 'klines':
        data = await CryptoService.getKlines(symbol, interval, limit);
        break;
      case 'details':
      default:
        data = await CryptoService.getDetails(symbol);
        break;
    }
    return NextResponse.json({ status: 'success', data });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch crypto data' },
      { status: 500 }
    );
  }
}
