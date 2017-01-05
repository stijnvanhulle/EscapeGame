import mapValues from 'lodash/mapValues';

export function arrToRegex(v) {
  return typeof v === 'string' ? v : v.join('|');
}

function filterActions(actionsById, actionsFilter) {
  if (!actionsFilter) return actionsById;
  return mapValues(actionsById, (action, id) => (
  { ...action, action: actionsFilter(action.action, id) }
  ));
}

function filterStates(computedStates, statesFilter) {
  if (!statesFilter) return computedStates;
  return computedStates.map((state, idx) => (
  { ...state, state: statesFilter(state.state, idx) }
  ));
}

export function isFiltered(action, filters) {
  if (!filters || !action) return false;

  const { whitelist, blacklist } = filters;
  const { type } = action.action || action;
  return (
    whitelist && !type.match(whitelist) ||
    blacklist && type.match(blacklist)
  );
}

export function filterStagedActions(state, filters) {
  if (!filters) return state;

  const filteredStagedActionIds = [];
  const filteredComputedStates = [];

  state.stagedActionIds.forEach((id, idx) => {
    if (!isFiltered(state.actionsById[id], filters)) {
      filteredStagedActionIds.push(id);
      filteredComputedStates.push(state.computedStates[idx]);
    }
  });

  return { ...state,
    stagedActionIds: filteredStagedActionIds,
    computedStates: filteredComputedStates
  };
}

export function filterState(state, type, localFilter, statesFilter, actionsFilter, nextActionId) {
  if (type === 'ACTION') return !statesFilter ? state : statesFilter(state, nextActionId - 1);
  else if (type !== 'STATE') return state;

  if (localFilter) {
    const filteredStagedActionIds = [];
    const filteredComputedStates = [];
    const filteredActionsById = actionsFilter && {};
    const { actionsById } = state;
    const { computedStates } = state;

    state.stagedActionIds.forEach((id, idx) => {
      if (!isFiltered(actionsById[id], localFilter)) {
        filteredStagedActionIds.push(id);
        filteredComputedStates.push(
          statesFilter ?
          { ...computedStates[idx], state: statesFilter(computedStates[idx].state, idx) } :
            computedStates[idx]
        );
        if (actionsFilter) {
          filteredActionsById[id] = {
            ...actionsById[id], action: actionsFilter(actionsById[id].action, id)
          };
        }
      }
    });

    return {
      ...state,
      actionsById: filteredActionsById || actionsById,
      stagedActionIds: filteredStagedActionIds,
      computedStates: filteredComputedStates
    };
  }

  if (!statesFilter && !actionsFilter) return state;
  return {
    ...state,
    actionsById: filterActions(state.actionsById, actionsFilter),
    computedStates: filterStates(state.computedStates, statesFilter)
  };
}
