import { Color } from './color';

enum OutputDestination {
  None = <any>'None',
  File = <any>'File',
  Console = <any>'Console',
  FileAndConsole = <any>'FileAndConsole',
}

interface LoggerConfig {
  color?: Color;
  tag?: string;
  level?: string;
  output?: OutputDestination;
}

const defaultLoggerConfig: LoggerConfig = {
  color: Color.Default,
  tag: 'ghmattimysql',
  level: '',
  output: OutputDestination.None,
};

export { LoggerConfig, OutputDestination, defaultLoggerConfig };
