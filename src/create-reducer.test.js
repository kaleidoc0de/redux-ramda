import {createReducer} from "."

import {
  add, always, append, assoc, compose, lensIndex, propEq,
} from "ramda"

describe("redux-ramda", () => {
  test("empty spec", () => {
    const reducer = createReducer(null, [])
    const state = {a: Math.random()}
    const action = {type: "TEST"}
    const nextState = reducer(state, action)
    expect(state).toBe(nextState)
    expect(state).toEqual(nextState)
  })

  test("initial state and empty spec", () => {
    const state = {a: Math.random()}
    const reducer = createReducer(state, [])
    const action = {type: "TEST"}
    const nextState = reducer(null, action)
    expect(state).toBe(nextState)
    expect(state).toEqual(nextState)
  })

  test("string predicate", () => {
    const state = {a: 0}
    const type = "TEST"
    const reducer = createReducer(state, [
      [type, assoc("a")],
    ])
    const action = {type, payload: 1}
    const nextState = reducer(null, action)
    expect(nextState.a).toBe(1)
  })

  test("function predicate", () => {
    const state = {a: 0}
    const type = "TEST"
    const reducer = createReducer(state, [
      [propEq("type", type), assoc("a")],
    ])
    const action = {type, payload: 1}
    const nextState = reducer(null, action)
    expect(nextState.a).toBe(1)
  })

  test("multiple reducers", () => {
    const state = {a: 0}
    const type = "TEST"
    const reducer = createReducer(state, [
      [type, [assoc("a"), compose(assoc("b"), always(2))]],
    ])
    const action = {type, payload: 1}
    const nextState = reducer(null, action)
    expect(nextState.a).toBe(1)
    expect(nextState.b).toBe(2)
  })

  test("multiple predicates", () => {
    let state = {}
    const reducer = createReducer(null, [
      ["A", assoc("a")],
      ["B", assoc("b")],
      ["C", assoc("c")],
    ])

    state = reducer(state, {type: "A", payload: 1})
    expect(state.a).toBe(1)
    state = reducer(state, {type: "B", payload: 2})
    expect(state.b).toBe(2)
    state = reducer(state, {type: "C", payload: 3})
    expect(state.c).toBe(3)
    expect(state).toEqual({a: 1, b: 2, c: 3})
  })

  test("meta sensitive reducer", () => {
    let state = [0]
    const reducer = createReducer(null, [
      ["ADD_COUNTER", compose(append, always(0))],
      ["INCREMENT_COUNTER", compose(add, always(1)), [lensIndex, "index"]],
    ])

    state = reducer(state, {type: "ADD_COUNTER"})
    expect(state).toEqual([0, 0])
    state = reducer(state, {type: "INCREMENT_COUNTER", meta: {index: 1}})
    expect(state).toEqual([0, 1])
  })

  test("missing meta", () => {
    let state = [0, 0]
    const reducer = createReducer(null, [
      ["INCREMENT_COUNTER", compose(add, always(1)), [lensIndex, "index"]],
    ])

    state = reducer(state, {type: "INCREMENT_COUNTER"})
    expect(state).toEqual([0, 0])
  })
})
