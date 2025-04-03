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

const mountComponent = (vnode, container) => {
  const subtree = vnode.tag.render();
  renderer(subtree, container);
};

function renderer(vnode, container) {
  if (typeof vnode.tag === "string") {
    mountElement(vnode, container);
  } else if (typeof vnode.tag === "object") {
    mountComponent(vnode, container);
  }
}

renderer(vnode, document.body);
