export interface TelemetrySpan {
  traceId: string;
  spanId: string;
  traceParent: string;
  correlationId: string;
}

export class TelemetryService {
  public static createSpan(spanName: string): TelemetrySpan {
    const traceId = this.generateHex(32);
    const spanId = this.generateHex(16);
    const correlationId = `corr-${Date.now()}-${this.generateHex(7)}`;
    const traceParent = `00-${traceId}-${spanId}-01`;

    return {
      traceId,
      spanId,
      traceParent,
      correlationId,
    };
  }

  private static generateHex(length: number): string {
    const chars = '0123456789abcdef';
    let hex = '';
    for (let i = 0; i < length; i++) {
      hex += chars[Math.floor(Math.random() * 16)];
    }
    return hex;
  }
}
