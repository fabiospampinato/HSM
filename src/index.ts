
/* IMPORT */

import * as _ from 'lodash';
import FSM from '@fabiospampinato/fsm';
import {guard, model, state, states, transition} from '@fabiospampinato/fsm/dist/types';
import {statesObj} from './types';

/* HSM */

class HSM extends FSM {

  /* VARIABLES */

  states;

  /* CONSTRUCTOR */

  constructor ( model: model, states: statesObj, initial?: state ) {

    const roots = _.keys ( states );

    if ( roots.length !== 1 ) throw new Error ( 'Invalid states root' );

    super ( model, HSM._getStates ( HSM._enhanceStates ( states ) ), initial || roots[0] );

  }

  /* UTILITIES */

  static _enhanceStates ( siblings: statesObj, parent?: statesObj ): statesObj {

    for ( let name in siblings ) {

      if ( !siblings.hasOwnProperty ( name ) ) continue;

      const state = siblings[name];

      state.name = name;

      if ( parent ) {

        state.parent = parent;

      }

      if ( !state.hasOwnProperty ( 'states' ) ) continue;

      HSM._enhanceStates ( state.states, state );

    }

    return siblings;

  }

  static _getStates ( siblings: statesObj, flattened: statesObj = {} ): statesObj {

    for ( let name in siblings ) {

      if ( !siblings.hasOwnProperty ( name ) ) continue;

      const state = siblings[name];

      flattened[name] = state;

      if ( !state.hasOwnProperty ( 'states' ) ) continue;

      HSM._getStates ( state.states, flattened );

    }

    return flattened;

  }

  _getParents ( state: state ): states {

    const parents: states = [];

    while ( true ) {

      if ( !this.states[state].parent ) break;

      state = this.states[state].parent.name;

      parents.push ( state );

    }

    return parents;

  }

  _getTransitionState ( state: state, transition: transition ): state | undefined {

    return super._getTransitionState ( state, transition ) || this._getParentTransitionState ( state, transition );

  }

  _getParentTransitionState ( state: state, transition: transition ): state | undefined {

    return this.states[state].parent ? this._getTransitionState ( this.states[state].parent.name, transition ) : undefined;

  }

  _getTransitionGuard ( state: state, transition: transition ): guard | undefined {

    return super._getTransitionGuard ( state, transition ) || this._getParentTransitionGuard ( state, transition );

  }

  _getParentTransitionGuard ( state: state, transition: transition ): guard | undefined {

    return this.states[state].parent ? this._getTransitionGuard ( this.states[state].parent.name, transition ) : undefined;

  }

  _getExistsEnters ( prevState: state, nextState: state ): [states, states] {

    const exits = [prevState].concat ( this._getParents ( prevState ) ).reverse (),
          enters = [nextState].concat ( this._getParents ( nextState ) ).reverse ();

    let sliceIndex = 0;

    for ( let i = 0, l = exits.length; i < l; i++ ) {

      if ( exits[i] !== enters[i] ) break;

      sliceIndex++;

    }

    return [exits.slice ( sliceIndex ).reverse (), enters.slice ( sliceIndex )];

  }

  /* IS */

  is ( state: state ): boolean;
  is ( state: state, exactly: boolean ): boolean;
  is ( state: state, exactly?: boolean ): boolean {

    if ( exactly ) return super.is ( state );

    return super.is ( state ) || _.includes ( this._getParents ( this.state ), state );

  }

}

/* EXPORT */

export default HSM;
