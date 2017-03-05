/* IMPORT */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var fsm_1 = require("@fabiospampinato/fsm");
/* HSM */
var HSM = (function (_super) {
    __extends(HSM, _super);
    /* CONSTRUCTOR */
    function HSM(model, states, initial) {
        var _this = this;
        var roots = _.keys(states);
        if (roots.length !== 1)
            throw new Error('Invalid states root');
        _this = _super.call(this, model, HSM._getStates(HSM._enhanceStates(states)), initial || roots[0]) || this;
        return _this;
    }
    /* UTILITIES */
    HSM._enhanceStates = function (siblings, parent) {
        for (var name_1 in siblings) {
            if (!siblings.hasOwnProperty(name_1))
                continue;
            var state = siblings[name_1];
            state.name = name_1;
            if (parent) {
                state.parent = parent;
            }
            if (!state.hasOwnProperty('states'))
                continue;
            HSM._enhanceStates(state.states, state);
        }
        return siblings;
    };
    HSM._getStates = function (siblings, flattened) {
        if (flattened === void 0) { flattened = {}; }
        for (var name_2 in siblings) {
            if (!siblings.hasOwnProperty(name_2))
                continue;
            var state = siblings[name_2];
            flattened[name_2] = state;
            if (!state.hasOwnProperty('states'))
                continue;
            HSM._getStates(state.states, flattened);
        }
        return flattened;
    };
    HSM.prototype._getParents = function (state) {
        var parents = [];
        while (true) {
            if (!this.states[state].parent)
                break;
            state = this.states[state].parent.name;
            parents.push(state);
        }
        return parents;
    };
    HSM.prototype._getTransitionState = function (state, transition) {
        return _super.prototype._getTransitionState.call(this, state, transition) || this._getParentTransitionState(state, transition);
    };
    HSM.prototype._getParentTransitionState = function (state, transition) {
        return this.states[state].parent ? this._getTransitionState(this.states[state].parent.name, transition) : undefined;
    };
    HSM.prototype._getTransitionGuard = function (state, transition) {
        return _super.prototype._getTransitionGuard.call(this, state, transition) || this._getParentTransitionGuard(state, transition);
    };
    HSM.prototype._getParentTransitionGuard = function (state, transition) {
        return this.states[state].parent ? this._getTransitionGuard(this.states[state].parent.name, transition) : undefined;
    };
    HSM.prototype._getExistsEnters = function (prevState, nextState) {
        var exits = [prevState].concat(this._getParents(prevState)).reverse(), enters = [nextState].concat(this._getParents(nextState)).reverse();
        var sliceIndex = 0;
        for (var i = 0, l = exits.length; i < l; i++) {
            if (exits[i] !== enters[i])
                break;
            sliceIndex++;
        }
        return [exits.slice(sliceIndex).reverse(), enters.slice(sliceIndex)];
    };
    HSM.prototype.is = function (state, exactly) {
        if (exactly)
            return _super.prototype.is.call(this, state);
        return _super.prototype.is.call(this, state) || _.includes(this._getParents(this.state), state);
    };
    return HSM;
}(fsm_1.default));
/* EXPORT */
exports.default = HSM;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsWUFBWTs7Ozs7Ozs7Ozs7OztBQUVaLDBCQUE0QjtBQUM1Qiw0Q0FBdUM7QUFJdkMsU0FBUztBQUVUO0lBQWtCLHVCQUFHO0lBTW5CLGlCQUFpQjtJQUVqQixhQUFjLEtBQVksRUFBRSxNQUFpQixFQUFFLE9BQWU7UUFBOUQsaUJBUUM7UUFOQyxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFHLE1BQU0sQ0FBRSxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFFLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBRSxDQUFDO1lBQUMsTUFBTSxJQUFJLEtBQUssQ0FBRyxxQkFBcUIsQ0FBRSxDQUFDO1FBRXBFLFFBQUEsa0JBQVEsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBRyxNQUFNLENBQUUsQ0FBRSxFQUFFLE9BQU8sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUUsU0FBQzs7SUFFekYsQ0FBQztJQUVELGVBQWU7SUFFUixrQkFBYyxHQUFyQixVQUF3QixRQUFtQixFQUFFLE1BQWtCO1FBRTdELEdBQUcsQ0FBQyxDQUFFLElBQUksTUFBSSxJQUFJLFFBQVMsQ0FBQyxDQUFDLENBQUM7WUFFNUIsRUFBRSxDQUFDLENBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFHLE1BQUksQ0FBRyxDQUFDO2dCQUFDLFFBQVEsQ0FBQztZQUVsRCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBSSxDQUFDLENBQUM7WUFFN0IsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFJLENBQUM7WUFFbEIsRUFBRSxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsQ0FBQztnQkFFYixLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUV4QixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFHLFFBQVEsQ0FBRyxDQUFDO2dCQUFDLFFBQVEsQ0FBQztZQUVuRCxHQUFHLENBQUMsY0FBYyxDQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFFLENBQUM7UUFFN0MsQ0FBQztRQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFFbEIsQ0FBQztJQUVNLGNBQVUsR0FBakIsVUFBb0IsUUFBbUIsRUFBRSxTQUF5QjtRQUF6QiwwQkFBQSxFQUFBLGNBQXlCO1FBRWhFLEdBQUcsQ0FBQyxDQUFFLElBQUksTUFBSSxJQUFJLFFBQVMsQ0FBQyxDQUFDLENBQUM7WUFFNUIsRUFBRSxDQUFDLENBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFHLE1BQUksQ0FBRyxDQUFDO2dCQUFDLFFBQVEsQ0FBQztZQUVsRCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBSSxDQUFDLENBQUM7WUFFN0IsU0FBUyxDQUFDLE1BQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUV4QixFQUFFLENBQUMsQ0FBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUcsUUFBUSxDQUFHLENBQUM7Z0JBQUMsUUFBUSxDQUFDO1lBRW5ELEdBQUcsQ0FBQyxVQUFVLENBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUUsQ0FBQztRQUU3QyxDQUFDO1FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUVuQixDQUFDO0lBRUQseUJBQVcsR0FBWCxVQUFjLEtBQVk7UUFFeEIsSUFBTSxPQUFPLEdBQVcsRUFBRSxDQUFDO1FBRTNCLE9BQVEsSUFBSSxFQUFHLENBQUM7WUFFZCxFQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTyxDQUFDO2dCQUFDLEtBQUssQ0FBQztZQUV4QyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBRXZDLE9BQU8sQ0FBQyxJQUFJLENBQUcsS0FBSyxDQUFFLENBQUM7UUFFekIsQ0FBQztRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFFakIsQ0FBQztJQUVELGlDQUFtQixHQUFuQixVQUFzQixLQUFZLEVBQUUsVUFBc0I7UUFFeEQsTUFBTSxDQUFDLGlCQUFNLG1CQUFtQixZQUFHLEtBQUssRUFBRSxVQUFVLENBQUUsSUFBSSxJQUFJLENBQUMseUJBQXlCLENBQUcsS0FBSyxFQUFFLFVBQVUsQ0FBRSxDQUFDO0lBRWpILENBQUM7SUFFRCx1Q0FBeUIsR0FBekIsVUFBNEIsS0FBWSxFQUFFLFVBQXNCO1FBRTlELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBRSxHQUFHLFNBQVMsQ0FBQztJQUV6SCxDQUFDO0lBRUQsaUNBQW1CLEdBQW5CLFVBQXNCLEtBQVksRUFBRSxVQUFzQjtRQUV4RCxNQUFNLENBQUMsaUJBQU0sbUJBQW1CLFlBQUcsS0FBSyxFQUFFLFVBQVUsQ0FBRSxJQUFJLElBQUksQ0FBQyx5QkFBeUIsQ0FBRyxLQUFLLEVBQUUsVUFBVSxDQUFFLENBQUM7SUFFakgsQ0FBQztJQUVELHVDQUF5QixHQUF6QixVQUE0QixLQUFZLEVBQUUsVUFBc0I7UUFFOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFFLEdBQUcsU0FBUyxDQUFDO0lBRXpILENBQUM7SUFFRCw4QkFBZ0IsR0FBaEIsVUFBbUIsU0FBZ0IsRUFBRSxTQUFnQjtRQUVuRCxJQUFNLEtBQUssR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBRyxJQUFJLENBQUMsV0FBVyxDQUFHLFNBQVMsQ0FBRSxDQUFFLENBQUMsT0FBTyxFQUFHLEVBQ3hFLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBRyxJQUFJLENBQUMsV0FBVyxDQUFHLFNBQVMsQ0FBRSxDQUFFLENBQUMsT0FBTyxFQUFHLENBQUM7UUFFaEYsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRW5CLEdBQUcsQ0FBQyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFHLENBQUM7WUFFL0MsRUFBRSxDQUFDLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUUsQ0FBQztnQkFBQyxLQUFLLENBQUM7WUFFcEMsVUFBVSxFQUFFLENBQUM7UUFFZixDQUFDO1FBRUQsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBRyxVQUFVLENBQUUsQ0FBQyxPQUFPLEVBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFHLFVBQVUsQ0FBRSxDQUFDLENBQUM7SUFFOUUsQ0FBQztJQU1ELGdCQUFFLEdBQUYsVUFBSyxLQUFZLEVBQUUsT0FBaUI7UUFFbEMsRUFBRSxDQUFDLENBQUUsT0FBUSxDQUFDO1lBQUMsTUFBTSxDQUFDLGlCQUFNLEVBQUUsWUFBRyxLQUFLLENBQUUsQ0FBQztRQUV6QyxNQUFNLENBQUMsaUJBQU0sRUFBRSxZQUFHLEtBQUssQ0FBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBRyxJQUFJLENBQUMsS0FBSyxDQUFFLEVBQUUsS0FBSyxDQUFFLENBQUM7SUFFckYsQ0FBQztJQUVILFVBQUM7QUFBRCxDQUFDLEFBM0lELENBQWtCLGFBQUcsR0EySXBCO0FBRUQsWUFBWTtBQUVaLGtCQUFlLEdBQUcsQ0FBQyJ9