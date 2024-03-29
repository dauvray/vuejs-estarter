// see : https://youmightnotneed.com/lodash/

// Simple implementation of lodash.get
// Handles arrays, objects, and any nested combination of the two.
// Also handles undefined as a valid value - see test case for details.
// Based on: https://gist.github.com/harish2704/d0ee530e6ee75bad6fd30c98e5ad9dab
const deepGet = (obj, query, defaultVal) => {
    query = Array.isArray(query) ? query : query.replace(/(\[(\d)\])/g, '.$2').replace(/^\./, '').split('.');
    if (!(query[0] in obj)) {
      return defaultVal;
    }
    obj = obj[query[0]];
    if (obj && query.length > 1) {
      return deepGet(obj, query.slice(1), defaultVal);
    }
    return obj;
  }

// lodash debounce() like
// Creates a debounced function that delays invoking func until after wait milliseconds
// have elapsed since the last time the debounced function was invoked.
const debounce = (func, delay, { leading } = {}) => {
    let timerId

    return (...args) => {
      if (!timerId && leading) {
        func(...args)
      }
      clearTimeout(timerId)

      timerId = setTimeout(() => func(...args), delay)
    }
  }

const uniqueId = (
    counter =>
    (str = '') =>
      `${str}${++counter}`
  )(0)

const upperFirst = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

// loadash default() like
// Assigns own and inherited enumerable string keyed properties of source objects
// to the destination object for all destination properties that resolve to undefined.
// Source objects are applied from left to right.
// Once a property is set, additional values of the same property are ignored.
const defaults = (...args) => args.reverse().reduce((acc, obj) => ({ ...acc, ...obj }), {})

const cloneDeep = (entity, cache = new WeakMap)  => {
    const referenceTypes = ['Array', 'Object', 'Map', 'Set', 'Date'];
    const entityType = Object.prototype.toString.call(entity);
    if (
      !new RegExp(referenceTypes.join('|')).test(entityType) ||
      entity instanceof WeakMap ||
      entity instanceof WeakSet
    ) return entity;
    if (cache.has(entity)) {
      return cache.get(entity);
    }
    const c = new entity.constructor;

    if (entity instanceof Map) {
      entity.forEach((value, key) => c.set(cloneDeep(key), cloneDeep(value)));
    }
    if (entity instanceof Set) {
      entity.forEach((value) => c.add(cloneDeep(value)));
    }
    if (entity instanceof Date) {
      return new Date(entity);
    }
    cache.set(entity, c);
    return Object.assign(c, ...Object.keys(entity).map((prop) => ({ [prop]: cloneDeep(entity[prop], cache) })));
  }

// Sets the value at path of object.
// If a portion of path doesn’t exist, it’s created. Arrays are created for missing index properties
// while objects are created for all other missing properties.
// Use _.setWith to customize path creation.
//Note: This method mutates object.
const set = (obj, path, value) => {
    // Regex explained: https://regexr.com/58j0k
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

    pathArray.reduce((acc, key, i) => {
      if (acc[key] === undefined) acc[key] = {}
      if (i === pathArray.length - 1) acc[key] = value
      return acc[key]
    }, obj)
  }

  export {
    deepGet,
    debounce,
    uniqueId,
    upperFirst,
    defaults,
    cloneDeep,
    set,
  }
