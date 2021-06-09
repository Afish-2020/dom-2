window.$ = window.jQuery = function (selectorOrArrayTemplate) {
    let elements
    if (typeof selectorOrArrayTemplate === 'string') {
        if (selectorOrArrayTemplate[0] === '<') {
            // 创建 div
            elements = createElement(selectorOrArrayTemplate)
        } else {
            // 查找 div
            elements = document.querySelectorAll(selectorOrArrayTemplate)
        }
    } else if (selectorOrArrayTemplate instanceof Array) {
        elements = selectorOrArrayTemplate
    }

    function createElement(string) {
        const container = document.createElement('template')
        container.innerHTML = string.trim()
        return container.content.firstChild
    }
    // api 可以操作elements
    const api = Object.create(jQuery.prototype)
    Object.assign(api, {
        elements: elements,
        oldApi: selectorOrArrayTemplate.oldApi,
    })
    return api
}

jQuery.prototype = {
    jquery: true,
    constructor: jQuery,
    get(index) {
        return this.elements[index]
    },
    appendTo(node) {
        if (node instanceof Element) {   //如果node是一个元素（标签）
            this.each(el => node.appendChild(el)) // 遍历 elements，对每个 el 进行 node.appendChild 操作
        } else if (node.jquery === true) {   //如果node是jQuery对象
            this.each(el => node.get(0).appendChild(el))  // 遍历 elements，对每个 el 进行 node.get(0).appendChild(el))  操作
            console.log(node.get(0))
        }
    },
    append(children) {
        if (children instanceof Element) {   //children是一个元素（标签）
            this.get(0).appendChild(children)
            console.log('1')
        } else if (children instanceof HTMLCollection) {    //HTMLCollection 是 HTML 元素的集合
            for (let i = 0; i < children.length; i++) {
                this.get(0).appendChild(children[i])
                console.log('2')
            }
        } else if (children.jquery === true) {     //如果children是jQuery对象
            children.each(node => this.get(0).appendChild(node))
            console.log('3')
        }
    },
    addClass(className) {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].classList.add(className)
        }
        return this
    },
    find(selector) {
        let array = []
        for (let i = 0; i < this.elements.length; i++) {
            let elements2 = Array.from(this.elements[i].querySelectorAll(selector))
            array = array.concat(elements2)
        }
        array.oldApi = this
        return jQuery(array)
    },
    end() {
        return this.oldApi
    },
    each(fn) {
        let array = []
        for (let i = 0; i < this.elements.length; i++) {
            fn.call(null, this.elements[i], i)
        }
        return jQuery(array)
    },
    parent() {
        let array = []
        this.each(node => {
            if (array.indexOf(node.parentNode) === -1) {
                array.push(node.parentNode)
            }
        })
        return jQuery(array)
    },
    print() {
        console.log(this.elements)
    },
    children() {
        let array = []
        this.each(node => {
            array.push(...node.children)
        })
        return jQuery(array)
    },
    on(eventType, selector, fn) {
        this.each(node => node.addEventListener(eventType, (e) => {
            const t = e.target
            if (t.matches(selector)) {
                fn(e)
            }
        }))
        return this
    }
}