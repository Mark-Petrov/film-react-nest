import { Injectable, LoggerService } from '@nestjs/common';

function escapeValue(value: unknown): string {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\t/g, '\\t')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(
    level: string,
    message: unknown,
    optionalParams: unknown[] = [],
  ) {
    const fields = [
      ['level', level],
      ['message', message],
      ...optionalParams.map(
        (value, index) => [`param${index}`, value] as const,
      ),
    ];

    return (
      fields.map(([key, value]) => `${key}=${escapeValue(value)}`).join('\t') +
      '\n'
    );
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatMessage('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    process.stderr.write(this.formatMessage('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    process.stderr.write(this.formatMessage('warn', message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatMessage('debug', message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(
      this.formatMessage('verbose', message, optionalParams),
    );
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    process.stderr.write(this.formatMessage('fatal', message, optionalParams));
  }
}
