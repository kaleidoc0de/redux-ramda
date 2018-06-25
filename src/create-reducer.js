import {
  adjust, always, append, apply, compose, cond, converge, curry, curryN, drop,
  F, has, head, identity, ifElse, is, insert, length, lte, map, of, over, pair,
  prop, propEq, reduce, T, unless, __,
} from "ramda"

const passThroughSpec = [T, always(identity)]
const ensureCondFunction = unless(
  is(Function),
  propEq("type")
)

const fnReducer = curry((payload, memo, fn) =>
  fn(payload)(memo)
)

const insertLens = insert(1, __, [over, prop])

const ensureIsArray = unless(is(Array), of)

const createMetaHandler = compose(
  curryN(2),
  apply(compose),
  insertLens
)

const createMetaReducer = curry((fn, [lensType, lensTarget], action, state) => {
  const payload = action.payload
  const meta = action.meta
  const fns = ensureIsArray(fn)
  return ifElse(
    is(Object),
    has(lensTarget),
    F
  )(meta)
    ? createMetaHandler(lensType)(lensTarget)(meta)(reduce(fnReducer(payload), __, fns))(state)
    : state
})

const adjustForMetaReducer = converge(pair, [
  head,
  compose(
    apply(createMetaReducer),
    drop(1)
  ),
])

const createPayloadReducer = curry((fn, action, state) => {
  const payload = action.payload
  const fns = ensureIsArray(fn)
  return reduce(fnReducer(payload), state, fns)
})

const ensureCondSpec = compose(
  adjust(ensureCondFunction, 0),
  ifElse(
    compose(lte(3), length),
    adjustForMetaReducer,
    adjust(createPayloadReducer, 1)
  )
)

const createReducerSpec = compose(
  cond,
  append(passThroughSpec),
  map(ensureCondSpec)
)

const createReducer = curry(
  (initialState, spec) => (state, action = {}) => createReducerSpec(spec)(action)(state || initialState)
)

export default createReducer
