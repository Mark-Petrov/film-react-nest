import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';
import { createLogger } from './create-logger';

describe('createLogger выбирает реализацию по значению LOGGER', () => {
  it('возвращает JsonLogger, TskvLogger или DevLogger', () => {
    expect(createLogger('json')).toBeInstanceOf(JsonLogger);
    expect(createLogger('tskv')).toBeInstanceOf(TskvLogger);
    expect(createLogger('dev')).toBeInstanceOf(DevLogger);
    expect(createLogger(undefined)).toBeInstanceOf(DevLogger);
  });
});
