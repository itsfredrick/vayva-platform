
// Structured Logger wrapper
// Ensures consistent JSON format with correlation IDs

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
    merchantId?: string;
    correlationId?: string;
    userId?: string;
    [key: string]: any;
}

export class Logger {
    static log(level: LogLevel, message: string, context: LogContext = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...context
        };
        // In production, stream to Datadog/CloudWatch
        console.log(JSON.stringify(entry));
    }

    static info(message: string, context?: LogContext) {
        this.log('info', message, context);
    }

    static warn(message: string, context?: LogContext) {
        this.log('warn', message, context);
    }

    static error(message: string, error?: any, context?: LogContext) {
        this.log('error', message, { ...context, error: error?.message, stack: error?.stack });
    }
}
