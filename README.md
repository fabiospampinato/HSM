# HSM

![Issues](https://img.shields.io/github/issues/fabiospampinato/hsm.svg)
[![NPM version](https://img.shields.io/npm/v/@fabiospampinato/hsm.svg)](https://www.npmjs.com/package/@fabiospampinato/hsm)

Hierarchical State Machine implementation, with support for guards and enter/exit events.

It extends [FSM](https://github.com/fabiospampinato/FSM), read its documentation before reading this.

## Install

```shell
$ npm install --save @fabiospampinato/hsm
```

## Usage

```js
import HSM from '@fabiospampinato/hsm';

// The `states` object is similar to FSM's.
// The only difference being that an optional `states` key can be used to nest states.

const states = {
  alive: {
    states: {
      standing: {
        transitions: {
          walk: 'walking'
        }
      },
      waking: {
        transitions: {
          stop: 'standing',
          speedUp: 'running'
        }
      },
      running: {
        transitions: {
          slowDown: 'walking'
        }
      }
    }
  },
  dead {}
};

// The `model` object doesn't differ from the one FSM uses.

const Model = new class {
  walk () {
    console.log ( 'Starting to walk...' );
  }
  walkingEnter () {
    console.log ( 'Now I\'m walking' );
  }
  walkingExit () {
    console.log ( 'Now I\'n not walking anymore' );
  }
};

const machine = new HSM ( Model, states, 'standing' );

machine.transition ( 'walk' );

machine.is ( 'walking' ); // true
machine.is ( 'alive' ); // true
machine.is ( 'alive', true ); // false
```

## API

The API is the same that [FSM](https://github.com/fabiospampinato/FSM) provides, except for the following differences:

### `new HSM ( model, states, initial? )`

Here the `initial` state can be implicit, in that case the root state will be setted as the initial one.

If there are multiple states at the root level an error will be thrown.

### `.is ( state: string, exactly?: boolean ): boolean`

By default it will return true also for parent states, if you only want it to match the current state pass `true` as the `exactly` argument.

## Related

- [FSM](https://github.com/fabiospampinato/FSM) - Finite State Machine implementation, with support for guards and enter/exit events.

## License

MIT © Fabio Spampinato
