// Reactivity
// Track the global effect
let activeEffect;
// Tracks dependencies based on target and key
const targetMap = new WeakMap();

// Easier to understand Dependency as object -> More efficient in plain set
class Dep {
  subscribers = new Set();
  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }
  notify() {
    this.subscribers.forEach((effect) => {
      effect();
    });
  }
}

function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

const reactiveHandlers = {
  get(target, key, receiver) {
    const dep = getDep(target, key);
    dep.depend();
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const dep = getDep(target, key);
    const result = Reflect.set(target, key, value, receiver);
    dep.notify();
    return result;
  },
};

function reactive(raw) {
  return new Proxy(raw, reactiveHandlers);
}

function ref(value) {
  return new Proxy({ value }, reactiveHandlers);
}

const App = {
  data: ref(0),
  render() {
    return h(
      "button",
      {
        onClick: () => {
          this.data.value++;
        },
      },
      String(this.data.value)
    );
  },
};

function mountApp(component, container) {
  let isMounted = false;
  let prevVdom;
  watchEffect(() => {
    if (!isMounted) {
      prevVdom = component.render();
      mount(prevVdom, container);
      isMounted = true;
    } else {
      const newVdom = component.render();
      patch(prevVdom, newVdom);
      prevVdom = newVdom;
    }
  });
}

mountApp(App, document.getElementById("app"));
