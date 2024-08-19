# Memoization

Here are some examples of Memoization in use.

These three hooks have slightly different uses which is good to be clear on.

- *useEffect* is for side effects and runs after renders.
- *useMemo* memoizes values to optimize expensive calculations.
- *useCallback* memoizes functions to prevent unnecessary re-renders.

## useEffect

The useEffect hook invokes side effects from within functional components.

It runs after every render (by default), and can optionally clean up for itself before it runs again.

This hook takes the place of class lifecycle functions like componentDidMount.

Used to to synchronize with external systems, often in the form of API calls.

Overuse of this effect is a bit of a problem amongst developers.  I wrote an article title [You don't need effects to transform data](https://timothycurchod.com/writings/you-dont-need-effects) which goes into this effect which covers when NOT to use it.  This article also covers custom hooks which are a great pattern for 

The useLayoutEffect hook is not considered memoization, but worth a mention here.  It runs *before* the browser updates the screen and avoids flashing of old data.

## useMemo

This hook memoizes the result of a function.

It only recomputes the memoized value when one of the dependencies has changed.

This is useful for optimizing expensive calculations.

```js
import { useMemo } from 'react';

const MyComponent = ({ items }) => {
  const expensiveCalculation = (items) => {
    // Perform some expensive calculation
    return items.reduce((acc, item) => acc + item.value, 0);
  };

  const totalValue = useMemo(() => expensiveCalculation(items), [items]);

  return <div>Total Value: {totalValue}</div>;
};
```

## Array functions

### Reduce

```js
items.reduce((accumulator, item) => accumulator + item.value, 0);
```
