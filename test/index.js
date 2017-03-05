
/* IMPORT */

import * as _ from 'lodash';
import {describe} from 'ava-spec';
import FSM from '@fabiospampinato/fsm';
import HSM from '../dist';
import {Model, states, initialState} from './mocks';

/* TESTS */

describe ( 'HSM', it => {

  it.beforeEach ( t => {

    t.context.M = new Model ();
    t.context.H = new HSM ( t.context.M, _.cloneDeep ( states ), initialState );

  });

  describe ( 'constructor', it => {

    it ( 'It\'s an instance of FSM', t => {

      t.true ( t.context.H instanceof FSM );

    });

    it ( 'Sets the initial state to the root, if none is provided', t => {

      const H = new HSM ( new Model (), _.cloneDeep ( states ) );

      t.is ( H.get (), _.keys ( states )[0] );

    });

    it ( 'Throws an error for multi-roots states objects', t => {

      t.throws ( () => new HSM ( new Model (), { root1: {}, root2: {} } ), /Invalid states root/ );

    });

    it ( 'Throws an error if there are no roots', t => {

      t.throws ( () => new HSM ( new Model (), {} ), /Invalid states root/ );

    });

  });

  describe ( '_getParents', it => {

    it ( 'Gets an of all the parents of a state', t => {

      const tests = [
        ['root', []],
        ['one', ['root']],
        ['a1', ['one', 'root']]
      ];

      tests.forEach ( test => t.deepEqual ( t.context.H._getParents ( test[0] ), test[1] ) );

    });

  });

  describe ( '_getTransitionState', it => {

    it ( 'Can bubble through the hierarchy', t => {

      t.is ( t.context.H._getTransitionState ( 'a1', 'toOne' ), states.root.transitions.toOne.state );

    });

  });

  describe ( '_getTransitionGuard', it => {

    it ( 'Can bubble through the hierarchy', t => {

      t.is ( t.context.H._getTransitionGuard ( 'a1', 'toOne' ), states.root.transitions.toOne.guard );

    });

  });

  describe ( '_getExistsEnters', it => {

    it ( 'Returns an array of states to exit and one of states to enter', t => {

      t.deepEqual ( t.context.H._getExistsEnters ( 'a1', 'a1' ), [[], []] );
      t.deepEqual ( t.context.H._getExistsEnters ( 'a1', 'b1' ), [['a1'], ['b1']] );
      t.deepEqual ( t.context.H._getExistsEnters ( 'a1', 'root' ), [['a1', 'one'], []] );
      t.deepEqual ( t.context.H._getExistsEnters ( 'root', 'a1' ), [[], ['one', 'a1']] );
      t.deepEqual ( t.context.H._getExistsEnters ( 'a1', 'a2' ), [['a1', 'one'], ['two', 'a2']] );

    });

  });

  describe ( 'is', it => {

    it ( 'Returns true also for parent states', t => {

      t.true ( t.context.H.is ( initialState ) );
      t.true ( t.context.H.is ( 'one' ) );
      t.true ( t.context.H.is ( 'root' ) );

      t.false ( t.context.H.is ( 'two' ) );

    });

    it ( 'Can be limited to check only the current state', t => {

      t.true ( t.context.H.is ( initialState, true ) );
      t.false ( t.context.H.is ( 'one', true ) );
      t.false ( t.context.H.is ( 'root', true ) );

    });

  });

  describe ( 'transition', it => {

    it ( 'Bubbles through the hierarchy', t => {

      t.context.H.transition ( 'toTwo' );

      t.is ( t.context.H.get (), 'two' );

    });

    it ( 'Bubbles the guard through the hierarchy', t => {

      t.context.H.transition ( 'toOne' );

      t.is ( t.context.H.get (), 'one' );

      t.context.H.set ( 'a1' );

      t.throws ( () => t.context.H.transition ( 'toOne2' ), /Invalid transition/ );

    });

    it ( 'Calls exits and enters functions on parent states', t => {

      t.context.H.transition ( 'toA2' );

      t.deepEqual ( t.context.H.model.getTemp (), [0, 1, 2, 3, 4] );

      t.is ( t.context.H.get (), 'a2' );

    });

  });

});
