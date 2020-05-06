import React, { useReducer } from 'react'
import PedidoContext from './PedidoContext'
import PedidoReducer from './PedidoReducer'

import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTOS,
    ACTUALIZAR_TOTAL
} from '../../types'

const PedidoState = ({children}) => {

    //State del Pedido
    const initialState = {
        cliente: {},
        productos: [],
        total: 0
    }

    const [ state, dispatch ] = useReducer(PedidoReducer, initialState);

    // Modifica el Cliente
    const agregarCliente = cliente => {
        // console.log(cliente)

        dispatch({
            // Ese type es la acción que se va a ejecutar - PedidoReducer
            type: SELECCIONAR_CLIENTE,
            payload: cliente
        })
    }

    // Modifica los productos
    const agregarProducto = productosSeleccionados => {

        let nuevoState
        if(state.productos.length > 0) {
            // Tomar del segundo arreglo, una copia para asignarlo al primero
            nuevoState = productosSeleccionados.map( i => {
                const nuevoObjeto = state.productos.find( productoState => productoState.id === i.id )
                return {...i, ...nuevoObjeto}
            })
        }else{
            nuevoState = productosSeleccionados
        }

        dispatch({
            // Ese type es la acción que se va a ejecutar - PedidoReducer
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState
        })
    }

    // Modifica las cantidades de los productos
    const cantidadProductos = nuevoProducto => {
        dispatch({
            type: CANTIDAD_PRODUCTOS,
            payload: nuevoProducto
        })
    }

    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL
        })
    }

    return (
        <PedidoContext.Provider
            value = {{
                cliente: state.cliente,
                productos: state.productos,
                total: state.total,
                agregarCliente,
                agregarProducto,
                cantidadProductos,
                actualizarTotal
            }}
        > {children}
        </PedidoContext.Provider>
    )
}

export default PedidoState