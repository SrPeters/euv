function h(tag, props, children) {
  return {
    tag,
    props,
    children
  }
}

function mount(vnode, container) {
  const el = (vnode.el = document.createElement(vnode.tag))

  for (const key in vnode.props) {
    el.setAttribute(key, vnode.props[key])
  }

  if (typeof vnode.children === 'string') {
    el.textContent = vnode.children
  }
  else {
    vnode.children.forEach(child => {
      mount(child, el)
    })
  }
  container.appendChild(el)
}

function unmount(vnode) {
  vnode.el.parentNode.removeChild(vnode.el)
}

function patch(n1, n2) {
  const el = (n2.el = n1.el)
  if (n1.tag !== n2.tag) {
    mount(n2, el.parentNode)
    unmount(n1)
    return
  } 
  
  if (typeof n2.children === 'string') {
    el.textContent = n2.children
    return
  }

  if (typeof n1.children === 'string') {
    el.textContent = ''
    n2.children.forEach(child => mount(child, el))
    return
  }

  const c1 = n1.children
  const c2 = n2.children
  const commonLength = Math.min(c1.length, c2.length)

  for (let i = 0; i < commonLength; i++) {
    patch(c1[i], c2[i])
  }

  if (c1.length > c2.length) {
    c1.slice(c2.length).forEach(child => {
      unmount(child)
    })
  } 
  else if (c2.length > c1.length) {
    c2.slice(c1.length).forEach(child => {
      mount(child, el)
    })
  }
}

function render(message) {
  
}

const node1 = h('div', { class: 'container' }, [
  h('div', null, 'X'),
  h('span', null, 'hello '),
  h('span', null, 'world'),
])

const node2 = h('div', { class: 'container' }, [
  h('h1', null, 'Hello Dev 💻'),
  h('p', null, [
    h('span', null, 'Thanks for reading the '),
    h('a', { href: 'https://marc.dev' }, 'marc.dev'),
    h('span', null, ' blog'),
  ]),
  h(
    'img',
    {
      src: 'https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif',
      style: 'width: 350px; border-radius: 0.5rem;',
    },
    [],
  ),
])

mount(node1, document.getElementById('app'))

setTimeout(() => {
  patch(node1, node2)
}, 3000)
