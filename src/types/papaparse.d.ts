declare module 'papaparse' {
  export interface ParseConfig {
    delimiter?: string;
    newline?: string;
    quoteChar?: string;
    escapeChar?: string;
    header?: boolean;
    dynamicTyping?: boolean;
    preview?: number;
    encoding?: string;
    worker?: boolean;
    comments?: boolean | string;
    step?: (results: any, parser: any) => void;
    complete?: (results: ParseResult<any>) => void;
    error?: (error: any, file: any) => void;
    download?: boolean;
    skipEmptyLines?: boolean | 'greedy';
    chunk?: (results: ParseResult<any>, parser: any) => void;
    fastMode?: boolean;
    beforeFirstChunk?: (chunk: string) => string | void;
    transform?: (value: string, field: string | number) => any;
    transformHeader?: (header: string, index?: number) => string;
  }

  export interface ParseResult<T> {
    data: T[];
    errors: Array<{
      type: string;
      code: string;
      message: string;
      row: number;
    }>;
    meta: {
      delimiter: string;
      linebreak: string;
      aborted: boolean;
      fields?: string[];
      truncated: boolean;
    };
  }

  export function parse<T = any>(file: File | string, config?: ParseConfig): ParseResult<T>;
  export function unparse(data: any[] | any, config?: any): string;

  const Papa: {
    parse: typeof parse;
    unparse: typeof unparse;
  };

  export default Papa;
}
