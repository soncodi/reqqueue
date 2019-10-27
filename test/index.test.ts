import { TestFixture, Test, TestCase, Expect } from 'alsatian';
import { ReqQueue } from '../src';

const delayRet = async <T>(ms: number, ret: T) => {
  await new Promise(resolve => setTimeout(resolve, ms));

  return ret;
};

@TestFixture()
export class ReqQueueTests {
  @Test()
  @TestCase(false)
  @TestCase(true)
  async queueSimple(tick: boolean) {
    const req = new ReqQueue(tick);

    const res1 = await req.add(() => 1);
    const res2 = await req.add(async () => 'a');

    Expect(res1).toBe(1);
    Expect(res2).toBe('a');
  }

  @Test()
  @TestCase(false)
  @TestCase(true)
  async queueThrow(tick: boolean) {
    const req = new ReqQueue(tick);

    await Expect(async () =>
      req.add(() => { throw new Error(); })
    ).toThrowAsync();
  }

  @Test()
  @TestCase(false)
  @TestCase(true)
  async queueMultiple(tick: boolean) {
    const req = new ReqQueue(tick);

    const res = await Promise.all([
      req.add(() => 1),
      req.add(() => 'a')
    ]);

    Expect(res).toEqual([1, 'a']);
  }

  @Test()
  @TestCase(false)
  @TestCase(true)
  async queueMultipleAsync(tick: boolean) {
    const req = new ReqQueue(tick);

    const res = await Promise.all([
      req.add(async () => 1),
      req.add(async () => 'a')
    ]);

    Expect(res).toEqual([1, 'a']);
  }

  @Test()
  @TestCase(false)
  @TestCase(true)
  async queueInterleaved(tick: boolean) {
    const req = new ReqQueue(tick);

    const res = await Promise.all([
      req.add(async () => delayRet(50, 1)),
      req.add(async () => delayRet(10, 'a')),
      req.add(async () => delayRet(50, 2)),
      req.add(async () => delayRet(10, 'b'))
    ]);

    Expect(res).toEqual([1, 'a', 2, 'b']);
  }
}
