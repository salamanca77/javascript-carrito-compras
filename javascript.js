const $carts = document.getElementById('carts')
const $items = document.getElementById('items')
const $footer = document.getElementById('footer')

const $templateCarrito = document.getElementById('template-carrito').content
const $templateFooter = document.getElementById('template-footer').content
const $template = document.getElementById('template-card').content
const $fragment = document.createDocumentFragment()

let carrito = {}

const fetchData = async ()=>{
    try {
        const respuesta = await fetch('api.json')
        const json = await respuesta.json()
        render(json)
    } catch (error) {
        console.log(error)    
    }
}

$items.addEventListener('click',e =>{
    btnAccion(e)
})

document.addEventListener('DOMContentLoaded', ()=>{
    fetchData()
})


const render = (productos) =>{
    productos.forEach((producto) => {
        $template.querySelector('h5').textContent = producto.title
        $template.querySelector('p').textContent = producto.precio
        $template.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        $template.querySelector('img').setAttribute('alt', producto.title)
        $template.querySelector('button').dataset.id = producto.id
        const clone = $template.cloneNode(true)
        $fragment.appendChild(clone)
    });
    $carts.appendChild($fragment)
}

$carts.addEventListener('click',e =>{
    addCarrito(e)
})

const addCarrito = (e)=>{

    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }    
}

const setCarrito = (objeto)=>{
    const producto = {
        id:objeto.querySelector('.btn-dark').dataset.id,
        title:objeto.querySelector('h5').textContent,
        precio:objeto.querySelector('p').textContent,
        cantidad:1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad +1
    }

    carrito[producto.id] = {...producto}
    registroCarrito()
}

const registroCarrito = ()=>{
    $items.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        $templateCarrito.querySelector('th').textContent = producto.id
        $templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        $templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        $templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        $templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        $templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        $clone = $templateCarrito.cloneNode(true)
        $fragment.appendChild($clone)
    })     

    $items.appendChild($fragment)
    // console.log(carrito)
    pintarCarrito()
}

const pintarCarrito = ()=>{
    $footer.innerHTML = ''    
    if(Object.keys(carrito).length === 0){
        $footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacio</th> 
        `
        return
    }

    const cantidadTotal = Object.values(carrito).reduce((acumulador, {cantidad})=> acumulador + cantidad , 0)
    const precioTotal =  Object.values(carrito).reduce((acumulador, {cantidad, precio})=> acumulador + precio * cantidad ,0)
    $templateFooter.querySelectorAll('td')[0].textContent = cantidadTotal
    $templateFooter.querySelector('span').textContent = precioTotal

    const clone = $templateFooter.cloneNode(true)
    $fragment.appendChild(clone)
    $footer.appendChild($fragment)
    
    const vaciarCarrito = document.querySelector('#vaciar-carrito')
    vaciarCarrito.addEventListener('click',()=>{
        carrito = {}
        registroCarrito()        
    })
} 

const btnAccion = (e)=>{
    if(e.target.classList.contains('btn-info')){
        const articulo = carrito[e.target.dataset.id]
        articulo.cantidad = carrito[e.target.dataset.id].cantidad + 1 
        carrito[e.target.dataset.id] = {...articulo}
        registroCarrito()        
    }

    if(e.target.classList.contains('btn-danger')){

        const articulo = carrito[e.target.dataset.id]
        articulo.cantidad = carrito[e.target.dataset.id].cantidad - 1 
        if(articulo.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        registroCarrito()         
    }

    e.stopPropagation()
}













