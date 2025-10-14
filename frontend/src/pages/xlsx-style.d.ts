declare module 'xlsx-style' {
  // Cell style interface
  interface CellStyle {
    fill?: {
      fgColor?: { rgb: string };
    };
    font?: {
      name?: string;
      sz?: number;
      bold?: boolean;
      color?: { rgb: string };
    };
    alignment?: {
      horizontal?: 'left' | 'center' | 'right';
      vertical?: 'top' | 'center' | 'bottom';
    };
    border?: Record<string, { style?: string; color?: { rgb: string } }>;
  }

  // Cell type
  interface Cell {
    v?: string | number | boolean;
    t?: string;
    s?: CellStyle;
  }

  // Worksheet type
  interface Worksheet {
    [cell: string]: Cell;
  }

  // Workbook type
  interface Workbook {
    SheetNames: string[];
    Sheets: Record<string, Worksheet>;
  }

  const XLSX: {
    utils: {
      book_new(): Workbook;
      book_append_sheet(
        workbook: Workbook,
        sheet: Worksheet,
        name: string
      ): void;
      aoa_to_sheet(data: (string | number | boolean)[][]): Worksheet;
    };
    writeFile(workbook: Workbook, filename: string): void;
  };

  export = XLSX;
}
