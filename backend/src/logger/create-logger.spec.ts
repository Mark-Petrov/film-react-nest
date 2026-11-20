import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';
import { createLogger } from './create-logger';

describe('createLogger', () => {
  it('selects a logger by name', () => {
    expect(createLogger('json')).toBeInstanceOf(JsonLogger);
    expect(createLogger('tskv')).toBeInstanceOf(TskvLogger);
    expect(createLogger('dev')).toBeInstanceOf(DevLogger);
    expect(createLogger(undefined)).toBeInstanceOf(DevLogger);
  });
});
