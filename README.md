# redux-action-log

[![Circle CI](https://circleci.com/gh/AgentME/redux-action-log.svg?style=shield)](https://circleci.com/gh/AgentME/redux-action-log)
[![npm version](https://badge.fury.io/js/redux-action-log.svg)](https://badge.fury.io/js/redux-action-log)

This project is a redux store enhancer which allows you to record the redux
action history and access it. It can be configured to have a maximum number of
actions to keep in the history. Early actions will be removed from the history,
and the redux state of the beginning of the history will be recorded.

Note that history culling and `store.replaceReducer()` do not work well
together: redux-action-log does not record the state after each action. It only
records the state at the start. When actions are removed from the beginning of
the log, the reducer is run again on the initial state and the action to be
removed to calculate the new initial state. This means that redux-action-log
does not have to keep many states in memory at once, but it does require that
the reducer is deterministic in order to be accurate.

## Usage

```js
import {createStore} from 'redux';
import {createActionLog} from 'redux-action-log';

import myReducer from './reducer';

const actionLog = createActionLog({maxActions: 100});
const store = createStore(myReducer, undefined, actionLog.enhancer);

// ...

const log = actionLog.getLog();
// {
//   initialState: undefined,
//   skipped: 0,
//   actions: [
//     {type: 'ADD', payload: 3},
//     {type: 'ADD', payload: 5}
//   ]
// }
```

If you are using other store enhancers such as applyMiddleware, then you'll
need to compose actionLog's enhancer. Make sure to place it last to let it see
actions generated by previous enhancers:

```js
import {compose, createStore, applyMiddleware} from 'redux';
import {createActionLog} from 'redux-action-log';

import myReducer from './reducer';
import someMiddleware from './someMiddleware';

const actionLog = createActionLog({maxActions: 100});

let enhancer = applyMiddleware(someMiddleware);
enhancer = compose(enhancer, actionLog.enhancer);

const store = createStore(myReducer, undefined, enhancer);
```

## API

This module exports the `createActionLog(options)` function. The `maxActions`
property may be set to null to mean no limit or to a number to set a limit.

The function returns an object with the following properties:
* `enhancer`: Pass this to createStore once.
* `getLog()`: Returns the object `{initialState, skipped, actions}`.
* `setMaxActions(n)`: Change the maxActions option. This will cull the action
 log if necessary.
* `clear`: Completely cull the current log. It's equivalent to setting
 maxActions to 0 and then back to the previous value.

## Types

[Flow Type](https://flowtype.org/) declarations for this module are included!
If you are using Flow, they won't require any configuration to use.
