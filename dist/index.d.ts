import FSM from '@fabiospampinato/fsm';
import { guard, model, state, states, transition } from '@fabiospampinato/fsm/dist/types';
import { statesObj } from './types';
declare class HSM extends FSM {
    states: any;
    constructor(model: model, states: statesObj, initial?: state);
    static _enhanceStates(siblings: statesObj, parent?: statesObj): statesObj;
    static _getStates(siblings: statesObj, flattened?: statesObj): statesObj;
    _getParents(state: state): states;
    _getTransitionState(state: state, transition: transition): state | undefined;
    _getParentTransitionState(state: state, transition: transition): state | undefined;
    _getTransitionGuard(state: state, transition: transition): guard | undefined;
    _getParentTransitionGuard(state: state, transition: transition): guard | undefined;
    _getExistsEnters(prevState: state, nextState: state): [states, states];
    is(state: state): boolean;
    is(state: state, exactly: boolean): boolean;
}
export default HSM;
