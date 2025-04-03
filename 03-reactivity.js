// Object with render function that return a node
const MyComponent = {
  render() {
    return {
      tag: "button",
      props: {
        onClick: () => alert("hello"),
      },
      children: "Click me",
    };
  },
};

const vnode = {
  tag: MyComponent,
};

/**
 * PROXY
 */

const bucket = new WeakMap();
let activeEffect;

const data = { text: "hello world" };

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    trigger(target, key);
  },
});

function track(target, key) {
  if (!activeEffect) return;

  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;

  const effects = depsMap.get(key);
  effects && effects.forEach((fn) => fn());
}

function effect(fn) {
  activeEffect = fn;
  fn();
}

effect(() => {
  document.body.innerText = obj.text;
});

setTimeout(() => {
  obj.text = "hello framework";
}, 1000);

/**
 * END PROXY
 */
const mountElement = (vnode, container) => {
  const el = document.createElement(vnode.tag);

  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.substr(2).toLocaleLowerCase(), vnode.props[key]);
    }
    if (typeof vnode.children === "string") {
      el.appendChild(document.createTextNode(vnode.children));
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => renderer(child, el));
    }

    container.appendChild(el);
  }
};

// Just call the render function and render it
const mountComponent = (vnode, container) => {
  const subtree = vnode.tag.render();
  renderer(subtree, container);
};

// Simplify this for multiple use case
function renderer(vnode, container) {
  if (typeof vnode.children === "string") {
    mountElement(vnode, container);
  } else if (typeof vnode.tag === "object") {
    mountComponent(vnode, container);
  }
}

renderer(vnode, document.body);
