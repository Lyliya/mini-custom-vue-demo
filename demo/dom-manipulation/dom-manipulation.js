// Helper function to simplify the writing of a VDOM
function h(tag, props, children) {
  return {
    tag,
    props,
    children,
  };
}

// Function to mount a vnode to a container
function mount(vnode, container) {
  const el = document.createElement(vnode.tag);
  vnode.el = el;

  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.substr(2).toLocaleLowerCase(), vnode.props[key]);
    } else {
      el.setAttribute(key, vnode.props[key]);
    }
  }

  if (typeof vnode.children === "string") {
    el.appendChild(document.createTextNode(vnode.children));
  } else {
    vnode.children?.forEach((child) => mount(child, el));
  }

  container.appendChild(el);
}

// Compare 2 vdom, and update the display
function patch(n1, n2) {
  if (n1.tag === n2.tag) {
    // Same tags

    const el = n1.el;
    n2.el = n1.el; // Carry over new dom node to future snapshot

    const oldProps = n1.props || {};
    const newProps = n2.props || {};

    for (const key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];

      if (newValue !== oldValue) {
        if (/^on/.test(key)) {
          el.removeEventListener(key.substr(2).toLocaleLowerCase(), oldValue);
          el.addEventListener(key.substr(2).toLocaleLowerCase(), newValue);
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }

    for (const key in oldProps) {
      if (!(key in newProps)) {
        el.removeAttribute(key);
      }
    }

    // children
    const oldChildren = n1.children;
    const newChildren = n2.children;
    if (typeof newChildren === "string") {
      el.textContent = newChildren;
    } else {
      if (typeof oldChildren === "string") {
        el.innerHTML = ""; // Clear
        newChildren.forEach((child) => mount(child, el));
      } else {
        // Both old and new childre are arrays
        const commonLength = Math.min(oldChildren.length, newChildren.length);

        for (let i = 0; i < commonLength; i++) {
          patch(oldChildren[i], newChildren[i]);
        }

        if (newChildren.length > oldChildren.length) {
          // Add new nodes to the container
          newChildren
            .slice(oldChildren.length)
            .forEach((child) => mount(child, el));
        } else if (newChildren.length < oldChildren.length) {
          oldChildren
            .length(newChildren.length)
            .forEach((child) => el.removeChild(child.el));
        }
      }
    }
  } else {
    // Replacement
    const root = document.getElementById("app");
    root.innerHTML = "";
    mount(n2, root);
  }
}
