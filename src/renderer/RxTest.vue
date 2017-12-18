<template>
  <div>
    <h4>Single Value</h4>
    <div>{{single$}}</div>

    <h4>Array</h4>
    <ul>
      <li v-for="item of arr0$">{{item}}</li>
    </ul>
    <ul>
      <li v-for="item of arr1$">{{item}}</li>
    </ul>

    <h4>Interval</h4>
    <div>{{interval$}}</div>

    <h4>High-order</h4>
    <div>{{high$}}</div>
  </div>
</template>

<script>
import { Observable } from 'rxjs/Observable'

import 'rxjs/add/observable/of'

import 'rxjs/add/observable/from'
import 'rxjs/add/operator/toArray'

import 'rxjs/add/observable/interval'

import 'rxjs/add/observable/range'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeAll'

const single$ = Observable.of(Math.PI)
const arr0$ = Observable.of([1, 1, 2, 3, 5, 8, 13])
const arr1$ = Observable.from([1, 1, 2, 3, 5, 8, 13]).toArray()
const interval$ = Observable.interval(1000)

const high$ = Observable.range(1, 5)
  .map(item => Observable.interval(item * 1000))
  .mergeAll()

export default {
  name: 'rx-simple',

  subscriptions: {
    single$,
    arr0$,
    arr1$,
    interval$,
    high$
  }
}
</script>