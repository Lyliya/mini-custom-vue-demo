const vnode = {
  tag: "button",
  props: {
    onClick: () => alert("hello"),
  },
  children: "Click me",
};

function renderer(vnode, container) {
  const el = document.createElement(vnode.tag);

  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.substr(2).toLocaleLowerCase(), vnode.props[key]);
    } else {
      el.setAttribute(key, vnode.props[key]);
    }
  }

  if (typeof vnode.children === "string") {
    el.appendChild(document.createTextNode(vnode.children));
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach((child) => renderer(child, el));
  }

  container.appendChild(el);
}

renderer(vnode, document.body);
