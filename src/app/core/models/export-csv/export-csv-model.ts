export class ExportCsvOptions {
  public fieldSeparator: string = ';';
  public quoteStrings: string = '"';
  public decimalSeparator: string = '.';
  public showLabels: boolean = true;
  public showTitle: boolean = true;
  public title: string = '';
  public useTextFile: boolean = true;
  public useBom: boolean = true;
  public useKeysAsHeaders: boolean = false;
  public headers: string[] = [];
}