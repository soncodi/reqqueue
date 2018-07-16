
export type Req<T = any> = (...args: any[]) => T|Promise<T>;

export class ReqQueue {
  private lock = false;
  private readonly reqs: (() => Promise<void>)[] = [];
  private readonly tick: boolean;

  constructor(tick: boolean) {
    this.tick = tick;
  }

  async add<T>(req: Req<T>) {
    return new Promise<T>((resolve, reject) => {
      // wrap request
      this.reqs.push(async () => {
        try {
          return resolve(await req());
        }
        catch (err) {
          return reject(err);
        }
      });

      this.tick ? setTimeout(async () => this.turn(), 0) : this.turn();
    });
  }

  private async turn() {
    if (this.lock) {
      return;
    }

    const wrap = this.reqs.shift();

    if (!wrap) {
      return;
    }

    this.lock = true;

    await wrap();

    this.lock = false;

    this.tick ? setTimeout(async () => this.turn(), 0) : this.turn();
  }
}
