'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.createActionLog = createActionLog;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createActionLog(options) {
  var _options$snapshotInte = options.snapshotInterval;
  var snapshotInterval = _options$snapshotInte === undefined ? 20 : _options$snapshotInte;
  var _options$limit = options.limit;
  var limit = _options$limit === undefined ? 200 : _options$limit;


  var store = void 0;
  var chunks = [];
  var skipped = 0;

  function countActionsInChunks() {
    return (chunks.length - 1) * (snapshotInterval || 0) + chunks[chunks.length - 1].actions.length;
  }

  function cull() {
    if (limit == null || snapshotInterval == null) return;
    var extraActionsCount = countActionsInChunks() - limit;
    var firstNecessaryChunk = Math.floor(extraActionsCount / snapshotInterval);
    if (firstNecessaryChunk > 0) {
      chunks.splice(0, firstNecessaryChunk);
      skipped += firstNecessaryChunk * snapshotInterval;
    }
  }

  var enhancer = function enhancer(createStore) {
    return function (reducer, initialState, enhancer) {
      if (store) throw new Error('redux-action-log enhancer can not be re-used');
      store = createStore(reducer, initialState, enhancer);
      var _store = store;
      var _dispatch = _store.dispatch;

      chunks.push({
        state: initialState,
        actions: []
      });
      return (0, _extends3.default)({}, store, {
        dispatch: function dispatch(action) {
          var lastChunk = chunks[chunks.length - 1];
          var actionEntry = { action: action, timestamp: Date.now() };
          if (lastChunk.actions.length === snapshotInterval) {
            chunks.push({
              state: store.getState(),
              actions: [actionEntry]
            });
          } else {
            lastChunk.actions.push(actionEntry);
          }
          cull();
          return _dispatch(action);
        }
      });
    };
  };

  return {
    enhancer: enhancer,
    setLimit: function setLimit(n) {
      limit = n;
      cull();
    },
    getLog: function getLog() {
      var _ref;

      return {
        initialState: chunks[0].state,
        skipped: skipped,
        actions: (_ref = []).concat.apply(_ref, (0, _toConsumableArray3.default)(chunks.map(function (c) {
          return c.actions;
        })))
      };
    },
    clear: function clear() {
      skipped += countActionsInChunks();
      chunks = [{
        state: store.getState(),
        actions: []
      }];
    }
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjcmVhdGVBY3Rpb25Mb2ciLCJvcHRpb25zIiwic25hcHNob3RJbnRlcnZhbCIsImxpbWl0Iiwic3RvcmUiLCJjaHVua3MiLCJza2lwcGVkIiwiY291bnRBY3Rpb25zSW5DaHVua3MiLCJsZW5ndGgiLCJhY3Rpb25zIiwiY3VsbCIsImV4dHJhQWN0aW9uc0NvdW50IiwiZmlyc3ROZWNlc3NhcnlDaHVuayIsIk1hdGgiLCJmbG9vciIsInNwbGljZSIsImVuaGFuY2VyIiwiY3JlYXRlU3RvcmUiLCJyZWR1Y2VyIiwiaW5pdGlhbFN0YXRlIiwiRXJyb3IiLCJkaXNwYXRjaCIsInB1c2giLCJzdGF0ZSIsImFjdGlvbiIsImxhc3RDaHVuayIsImFjdGlvbkVudHJ5IiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsImdldFN0YXRlIiwic2V0TGltaXQiLCJuIiwiZ2V0TG9nIiwiY29uY2F0IiwibWFwIiwiYyIsImNsZWFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztRQXVCZ0JBLGUsR0FBQUEsZTs7OztBQUFULFNBQVNBLGVBQVQsQ0FBeUJDLE9BQXpCLEVBQW9EO0FBQUEsOEJBQzNCQSxPQUQyQixDQUNsREMsZ0JBRGtEO0FBQUEsTUFDbERBLGdCQURrRCx5Q0FDakMsRUFEaUM7QUFBQSx1QkFFdkNELE9BRnVDLENBRXBERSxLQUZvRDtBQUFBLE1BRXBEQSxLQUZvRCxrQ0FFOUMsR0FGOEM7OztBQUl6RCxNQUFJQyxjQUFKO0FBQ0EsTUFBSUMsU0FBa0IsRUFBdEI7QUFDQSxNQUFJQyxVQUFVLENBQWQ7O0FBRUEsV0FBU0Msb0JBQVQsR0FBZ0M7QUFDOUIsV0FBTyxDQUFDRixPQUFPRyxNQUFQLEdBQWMsQ0FBZixLQUFtQk4sb0JBQWtCLENBQXJDLElBQ0xHLE9BQU9BLE9BQU9HLE1BQVAsR0FBYyxDQUFyQixFQUF3QkMsT0FBeEIsQ0FBZ0NELE1BRGxDO0FBRUQ7O0FBRUQsV0FBU0UsSUFBVCxHQUFnQjtBQUNkLFFBQUlQLFNBQVMsSUFBVCxJQUFpQkQsb0JBQW9CLElBQXpDLEVBQStDO0FBQy9DLFFBQU1TLG9CQUFvQkoseUJBQXlCSixLQUFuRDtBQUNBLFFBQU1TLHNCQUFzQkMsS0FBS0MsS0FBTCxDQUFXSCxvQkFBa0JULGdCQUE3QixDQUE1QjtBQUNBLFFBQUlVLHNCQUFzQixDQUExQixFQUE2QjtBQUMzQlAsYUFBT1UsTUFBUCxDQUFjLENBQWQsRUFBaUJILG1CQUFqQjtBQUNBTixpQkFBV00sc0JBQW9CVixnQkFBL0I7QUFDRDtBQUNGOztBQUVELE1BQU1jLFdBQVcsU0FBWEEsUUFBVyxDQUFTQyxXQUFULEVBQWdDO0FBQy9DLFdBQU8sVUFBU0MsT0FBVCxFQUE0QkMsWUFBNUIsRUFBK0NILFFBQS9DLEVBQW1FO0FBQ3hFLFVBQUlaLEtBQUosRUFBVyxNQUFNLElBQUlnQixLQUFKLENBQVUsOENBQVYsQ0FBTjtBQUNYaEIsY0FBUWEsWUFBWUMsT0FBWixFQUFxQkMsWUFBckIsRUFBbUNILFFBQW5DLENBQVI7QUFGd0UsbUJBR3JEWixLQUhxRDtBQUFBLFVBR2pFaUIsU0FIaUUsVUFHakVBLFFBSGlFOztBQUl4RWhCLGFBQU9pQixJQUFQLENBQVk7QUFDVkMsZUFBT0osWUFERztBQUVWVixpQkFBUztBQUZDLE9BQVo7QUFJQSx3Q0FDS0wsS0FETDtBQUVFaUIsZ0JBRkYsb0JBRVdHLE1BRlgsRUFFbUI7QUFDZixjQUFNQyxZQUFZcEIsT0FBT0EsT0FBT0csTUFBUCxHQUFjLENBQXJCLENBQWxCO0FBQ0EsY0FBTWtCLGNBQWMsRUFBQ0YsY0FBRCxFQUFTRyxXQUFXQyxLQUFLQyxHQUFMLEVBQXBCLEVBQXBCO0FBQ0EsY0FBSUosVUFBVWhCLE9BQVYsQ0FBa0JELE1BQWxCLEtBQTZCTixnQkFBakMsRUFBbUQ7QUFDakRHLG1CQUFPaUIsSUFBUCxDQUFZO0FBQ1ZDLHFCQUFPbkIsTUFBTTBCLFFBQU4sRUFERztBQUVWckIsdUJBQVMsQ0FBQ2lCLFdBQUQ7QUFGQyxhQUFaO0FBSUQsV0FMRCxNQUtPO0FBQ0xELHNCQUFVaEIsT0FBVixDQUFrQmEsSUFBbEIsQ0FBdUJJLFdBQXZCO0FBQ0Q7QUFDRGhCO0FBQ0EsaUJBQU9XLFVBQVNHLE1BQVQsQ0FBUDtBQUNEO0FBZkg7QUFpQkQsS0F6QkQ7QUEwQkQsR0EzQkQ7O0FBNkJBLFNBQU87QUFDTFIsc0JBREs7QUFFTGUsWUFGSyxvQkFFSUMsQ0FGSixFQUVnQjtBQUNuQjdCLGNBQVE2QixDQUFSO0FBQ0F0QjtBQUNELEtBTEk7QUFNTHVCLFVBTkssb0JBTVM7QUFBQTs7QUFDWixhQUFPO0FBQ0xkLHNCQUFjZCxPQUFPLENBQVAsRUFBVWtCLEtBRG5CO0FBRUxqQix3QkFGSztBQUdMRyxpQkFBUyxZQUFHeUIsTUFBSCw4Q0FBYTdCLE9BQU84QixHQUFQLENBQVc7QUFBQSxpQkFBS0MsRUFBRTNCLE9BQVA7QUFBQSxTQUFYLENBQWI7QUFISixPQUFQO0FBS0QsS0FaSTtBQWFMNEIsU0FiSyxtQkFhRztBQUNOL0IsaUJBQVdDLHNCQUFYO0FBQ0FGLGVBQVMsQ0FBQztBQUNSa0IsZUFBT25CLE1BQU0wQixRQUFOLEVBREM7QUFFUnJCLGlCQUFTO0FBRkQsT0FBRCxDQUFUO0FBSUQ7QUFuQkksR0FBUDtBQXFCRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmV4cG9ydCB0eXBlIFJlY29yZExvZ09wdGlvbnMgPSB7XG4gIGxpbWl0PzogP251bWJlcjtcbiAgc25hcHNob3RJbnRlcnZhbD86ID9udW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBMb2cgPSB7XG4gIGluaXRpYWxTdGF0ZTogYW55O1xuICBza2lwcGVkOiBudW1iZXI7XG4gIGFjdGlvbnM6IEFycmF5PEFjdGlvbkVudHJ5Pjtcbn07XG5cbmV4cG9ydCB0eXBlIEFjdGlvbkVudHJ5ID0ge1xuICBhY3Rpb246IGFueTtcbiAgdGltZXN0YW1wOiBudW1iZXI7XG59O1xuXG50eXBlIENodW5rID0ge1xuICBzdGF0ZTogYW55O1xuICBhY3Rpb25zOiBBcnJheTxBY3Rpb25FbnRyeT47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWN0aW9uTG9nKG9wdGlvbnM6IFJlY29yZExvZ09wdGlvbnMpIHtcbiAgY29uc3Qge3NuYXBzaG90SW50ZXJ2YWw9MjB9ID0gb3B0aW9ucztcbiAgbGV0IHtsaW1pdD0yMDB9ID0gb3B0aW9ucztcblxuICBsZXQgc3RvcmU7XG4gIGxldCBjaHVua3M6IENodW5rW10gPSBbXTtcbiAgbGV0IHNraXBwZWQgPSAwO1xuXG4gIGZ1bmN0aW9uIGNvdW50QWN0aW9uc0luQ2h1bmtzKCkge1xuICAgIHJldHVybiAoY2h1bmtzLmxlbmd0aC0xKSooc25hcHNob3RJbnRlcnZhbHx8MCkgK1xuICAgICAgY2h1bmtzW2NodW5rcy5sZW5ndGgtMV0uYWN0aW9ucy5sZW5ndGg7XG4gIH1cblxuICBmdW5jdGlvbiBjdWxsKCkge1xuICAgIGlmIChsaW1pdCA9PSBudWxsIHx8IHNuYXBzaG90SW50ZXJ2YWwgPT0gbnVsbCkgcmV0dXJuO1xuICAgIGNvbnN0IGV4dHJhQWN0aW9uc0NvdW50ID0gY291bnRBY3Rpb25zSW5DaHVua3MoKSAtIGxpbWl0O1xuICAgIGNvbnN0IGZpcnN0TmVjZXNzYXJ5Q2h1bmsgPSBNYXRoLmZsb29yKGV4dHJhQWN0aW9uc0NvdW50L3NuYXBzaG90SW50ZXJ2YWwpO1xuICAgIGlmIChmaXJzdE5lY2Vzc2FyeUNodW5rID4gMCkge1xuICAgICAgY2h1bmtzLnNwbGljZSgwLCBmaXJzdE5lY2Vzc2FyeUNodW5rKTtcbiAgICAgIHNraXBwZWQgKz0gZmlyc3ROZWNlc3NhcnlDaHVuaypzbmFwc2hvdEludGVydmFsO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGVuaGFuY2VyID0gZnVuY3Rpb24oY3JlYXRlU3RvcmU6IEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHJlZHVjZXI6IEZ1bmN0aW9uLCBpbml0aWFsU3RhdGU6IGFueSwgZW5oYW5jZXI6IEZ1bmN0aW9uKSB7XG4gICAgICBpZiAoc3RvcmUpIHRocm93IG5ldyBFcnJvcigncmVkdXgtYWN0aW9uLWxvZyBlbmhhbmNlciBjYW4gbm90IGJlIHJlLXVzZWQnKTtcbiAgICAgIHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgaW5pdGlhbFN0YXRlLCBlbmhhbmNlcik7XG4gICAgICBjb25zdCB7ZGlzcGF0Y2h9ID0gc3RvcmU7XG4gICAgICBjaHVua3MucHVzaCh7XG4gICAgICAgIHN0YXRlOiBpbml0aWFsU3RhdGUsXG4gICAgICAgIGFjdGlvbnM6IFtdXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0b3JlLFxuICAgICAgICBkaXNwYXRjaChhY3Rpb24pIHtcbiAgICAgICAgICBjb25zdCBsYXN0Q2h1bmsgPSBjaHVua3NbY2h1bmtzLmxlbmd0aC0xXTtcbiAgICAgICAgICBjb25zdCBhY3Rpb25FbnRyeSA9IHthY3Rpb24sIHRpbWVzdGFtcDogRGF0ZS5ub3coKX07XG4gICAgICAgICAgaWYgKGxhc3RDaHVuay5hY3Rpb25zLmxlbmd0aCA9PT0gc25hcHNob3RJbnRlcnZhbCkge1xuICAgICAgICAgICAgY2h1bmtzLnB1c2goe1xuICAgICAgICAgICAgICBzdGF0ZTogc3RvcmUuZ2V0U3RhdGUoKSxcbiAgICAgICAgICAgICAgYWN0aW9uczogW2FjdGlvbkVudHJ5XVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxhc3RDaHVuay5hY3Rpb25zLnB1c2goYWN0aW9uRW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdWxsKCk7XG4gICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGVuaGFuY2VyLFxuICAgIHNldExpbWl0KG46ID9udW1iZXIpIHtcbiAgICAgIGxpbWl0ID0gbjtcbiAgICAgIGN1bGwoKTtcbiAgICB9LFxuICAgIGdldExvZygpOiBMb2cge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdGlhbFN0YXRlOiBjaHVua3NbMF0uc3RhdGUsXG4gICAgICAgIHNraXBwZWQsXG4gICAgICAgIGFjdGlvbnM6IFtdLmNvbmNhdCguLi5jaHVua3MubWFwKGMgPT4gYy5hY3Rpb25zKSlcbiAgICAgIH07XG4gICAgfSxcbiAgICBjbGVhcigpIHtcbiAgICAgIHNraXBwZWQgKz0gY291bnRBY3Rpb25zSW5DaHVua3MoKTtcbiAgICAgIGNodW5rcyA9IFt7XG4gICAgICAgIHN0YXRlOiBzdG9yZS5nZXRTdGF0ZSgpLFxuICAgICAgICBhY3Rpb25zOiBbXVxuICAgICAgfV07XG4gICAgfVxuICB9O1xufVxuIl19