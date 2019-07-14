# ReqQueue

[![Build Status](https://travis-ci.org/soncodi/reqqueue.svg?branch=master)](https://travis-ci.org/soncodi/reqqueue)
[![Coverage Status](https://coveralls.io/repos/github/soncodi/reqqueue/badge.svg?branch=coverage)](https://coveralls.io/github/soncodi/reqqueue?branch=coverage)
[![Dependency Status](https://david-dm.org/soncodi/reqqueue/status.svg)](https://david-dm.org/soncodi/reqqueue)
[![npm version](https://badge.fury.io/js/%40soncodi%2Freqqueue.svg)](https://badge.fury.io/js/%40soncodi%2Freqqueue)

**Sequential request queue for Node.js and browsers**

- Requests are executed in the order in which they were queued
- Execution of requests is sequential (not interleaved)
- Supports requests with both sync and async results

### Installation

```sh
npm install @soncodi/reqqueue --save
```

### Usage (TypeScript)

```typescript
import { ReqQueue } from '@soncodi/reqqueue';

const q = new ReqQueue(false);

const request = async () => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

  return Math.random();
};

const [a, b, c] = await Promise.all([
  q.add(request);
  q.add(request);
  q.add(request);
]);
```

### Methods

#### `add<T>(fn: (...args: any[]) => T|Promise<T>): Promise<T>`
Adds a request to the request queue to be executed.
