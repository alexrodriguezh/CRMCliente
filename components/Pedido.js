import React, { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import Swal from 'sweetalert2'
import Router from 'next/router'

const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput){
        actualizarPedido(id: $id, input: $input){
            estado
        }
    }
`

const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!){
        eliminarPedido(id: $id)
    }
` 
const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor{
        obtenerPedidosVendedor{
            id
        }
    }
`
const Pedido = ({pedido}) => {

const { id, total, cliente: { nombre, apellido, telefono, email }, estado, cliente } = pedido

const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO)

const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
    update(cache){
        const { obtenerPedidosVendedor } = cache.readQuery({ query: OBTENER_PEDIDOS })
        cache.writeQuery({
            query: OBTENER_PEDIDOS,
            data: {
                obtenerPedidosVendedor : obtenerPedidosVendedor.filter(i => i.id !== id )
            }
        })
    }
})

const [estadoPedido, setEstadoPedido] = useState(estado)
const [clase, setClase] = useState('')

useEffect(() => {
    if(estadoPedido){
        setEstadoPedido(estadoPedido)
    }
    clasePedido()
}, [estadoPedido])

// Función que modifica el color del pedido de acuerdo a su estado
const clasePedido = () => {
    if(estadoPedido === 'PENDIENTE'){
        setClase('border-yellow-500')
    } else if(estadoPedido === 'COMPLETADO'){
        setClase('border-green-500')
    }else{
        setClase('border-red-500')
    }
}

const cambiarEstadoPedido = async nuevoEstado => {
    try {
        const { data } = await actualizarPedido({
            variables: {
                id,
                input: {
                    estado: nuevoEstado,
                    cliente: cliente.id
                }
            }
        })

        setEstadoPedido(data.actualizarPedido.estado)

    } catch (error) {
        console.log(error)
    }
}

const confirmarEliminarPedido = () => {
    Swal.fire({
        title: '¿Deseas eliminar a este pedido?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar',
        cancelButtonText: 'No, Cancelar'
    }).then( async (result) => {
        if (result.value) {

            try {
                // Eliminar por ID
                const { data } = await eliminarPedido({
                    variables: {
                        id
                    }
                });
                console.log(data);

                //Mostrar una alerta
                Swal.fire(
                    'Eliminado!',
                    data.eliminarProducto,
                    'success'
                )
            } catch (error) {
                console.log(error);
            }
        }
    })
}

    return(
        <div className={` ${clase} border-l-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className="font-bold text-gray-800">Cliente: {nombre} {apellido}</p>

                {email && (
                    <p className="flex items-center my-2">
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                        {email}
                    </p>
                )}

                {telefono && (
                    <p className="flex items-center my-2">
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        {telefono}
                    </p>
                )}
                <h2 className="text-gray-800 font-bold mt-10">Estado Pedido:</h2>
                <select
                    className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-thight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase texts-xs font-bold"
                    value={estadoPedido}
                    onChange={ e => cambiarEstadoPedido( e.target.value )}
                >
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CANCELADO">CANCELADO</option>
                </select>
            </div>
            <div>
                <h2 className="">Resumen del Pedido</h2>
                {pedido.pedido.map( i => (
                    <div key={i.id} className="mt-4">
                        <p className="text-sm text-gray-600">Producto: {i.nombre}</p>
                        <p className="text-sm text-gray-600">Cantidad: {i.cantidad}</p>
                    </div>
                ))}
                <p className="text-gray-800 mt-3 font-bold">Total a pagar: 
                    <span className="font-light">$ {total} </span>
                </p>
                <button
                    className="uppercase texts-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight"
                    onClick={() => confirmarEliminarPedido()}
                >
                    Eliminar Pedido
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </div>
        </div>
    )
}

export default Pedido