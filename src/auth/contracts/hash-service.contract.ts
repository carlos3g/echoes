abstract class HashServiceContract {
  public abstract compare(value: string, hash: string): boolean;
  public abstract hash(value: string): string;
}

export { HashServiceContract };
