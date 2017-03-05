
/* MOCKS */

class Model {
  constructor () {
    this.initTemp ();
  }
  a1Exit () {
    this.temp.push ( 0 );
  }
  oneExit () {
    this.temp.push ( 1 );
  }
  toA2 () {
    this.temp.push ( 2 );
  }
  twoEnter () {
    this.temp.push ( 3 );
  }
  a2Enter () {
    this.temp.push ( 4 );
  }
  initTemp () {
    this.temp = [];
  }
  getTemp () {
    return this.temp;
  }
  true () {
    return true;
  }
  false () {
    return false;
  }
};

const states = {
  root: {
    transitions: {
      toOne: {
        state: 'one',
        guard: 'true|!false'
      },
      toOne2: {
        state: 'one',
        guard: 'false'
      },
      toTwo: 'two'
    },
    states: {
      one: {
        states: {
          a1: {
            transitions: {
              toA2: 'a2'
            }
          },
          b1: {}
        }
      },
      two: {
        states: {
          a2: {}
        }
      }
    }
  }
};

const initialState = 'a1';

/* EXPORT */

module.exports = {Model, states, initialState};
