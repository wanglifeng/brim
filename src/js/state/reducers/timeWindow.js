/* @flow */

import {createSelector} from "reselect"
import {isEqual} from "lodash"

import type {State} from "../types"
import {spanOfLast} from "../../lib/TimeWindow"
import brim, {type $Span} from "../../brim"
import createReducer from "./createReducer"

const initialState = {
  inner: null,
  outer: spanOfLast(30, "minutes"),
  nextOuter: null
}

export type TimeWindow = {
  inner: ?$Span,
  outer: $Span,
  nextOuter: ?$Span
}

export default createReducer(initialState, {
  TIME_WINDOWS_CLEAR: () => ({
    ...initialState
  }),
  TIME_WINDOW_RESTORE: (state, {value}) => {
    return {
      ...state,
      ...value
    }
  },
  OUTER_TIME_WINDOW_SET: (state, {timeWindow}) => ({
    ...state,
    outer: timeWindow
  }),
  INNER_TIME_WINDOW_SET: (state, {timeWindow}) => ({
    ...state,
    inner: timeWindow
  }),
  OUTER_FROM_TIME_SET: (state, {date}) => ({
    ...state,
    outer: [date, state.outer[1]]
  }),
  OUTER_TO_TIME_SET: (state, {date}) => ({
    ...state,
    outer: [state.outer[0], date]
  }),
  NEXT_OUTER_TIME_WINDOW_SET: (state, {timeWindow}) => ({
    ...state,
    nextOuter: isEqual(timeWindow, state.outer) ? null : timeWindow
  }),
  SEARCH_BAR_SUBMIT: ({nextOuter, outer}) => {
    return {
      nextOuter: null,
      outer: nextOuter || outer,
      inner: null
    }
  }
})

function getRawOuterTimeWindow(state: State) {
  return state.timeWindow.outer
}

export function getRawNextOuterTimeWindow(state: State) {
  return state.timeWindow.nextOuter
}

export function getRawInnerTimeWindow(state: State) {
  return state.timeWindow.inner
}

//$FlowFixMe
export const getOuterTimeWindow = createSelector(
  getRawOuterTimeWindow,
  (tw) => {
    let [from, to] = tw
    return [brim.time(from).toDate(), brim.time(to).toDate()]
  }
)

//$FlowFixMe
export const getNextOuterTimeWindow = createSelector(
  getRawNextOuterTimeWindow,
  (tw) => {
    if (!tw) return null
    let [from, to] = tw
    return [brim.time(from).toDate(), brim.time(to).toDate()]
  }
)

//$FlowFixMe
export const getInnerTimeWindow = createSelector(
  getRawInnerTimeWindow,
  (tw) => {
    if (!tw) return null
    let [from, to] = tw
    return [brim.time(from).toDate(), brim.time(to).toDate()]
  }
)

export const getTimeWindow = getOuterTimeWindow
