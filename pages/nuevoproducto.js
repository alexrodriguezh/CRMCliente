import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'


const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input){
            id
            nombre
            existencia
            precio
        }
    }
` 

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos{
        obtenerProductos{
            id
            nombre
            precio
            existencia
        }
    }
`
const nuevoProducto = () => {

    const router = useRouter()

    //Mensaje de alerta
    const [mensaje, guardarMensaje] = useState(null)

    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
    update(cache, { data : {nuevoProducto} }){
        // oBtenemos el objeto de cache que deseamos actualizar
        const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS })

        // Reescribimos el cache, este nunca se debe modificar
        cache.writeQuery({
            query: OBTENER_PRODUCTOS,
            data: {
                obtenerProductos : [...obtenerProductos, nuevoProducto]
            }
        })
        }
    })

const formik = useFormik({
    initialValues: {
        nombre: '',
        existencia: '',
        precio: '',
    },
    validationSchema: Yup.object({
        nombre: Yup.string()
                .required('El nombre del producto es obligatorio'),
        existencia: Yup.number()
                .required('La existencia del producto es obligatorio')
                .positive('No se aceptan números negativos')
                .integer('La existencia deben ser números enteros'),
        precio: Yup.number()
                .positive('No se aceptan números negativos')
                .required('El precio del producto es obligatorio')
    }),
    onSubmit: async valores => {

        const { nombre, existencia, precio } = valores
    
        try {
            const { data } = await nuevoProducto({
                variables:{
                    input: {
                        nombre, 
                        existencia, 
                        precio
                    }
                }
            })

            // Mostrar una alerta
            Swal.fire(
                'Creado',
                'Se creó el producto correctamente',
                'success'
            )
            // console.log(data.nuevoCliente)
            router.push('/productos') // redireccionar hacia productos
        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error: ', ''))

            setTimeout(() => {
                guardarMensaje(null)
            }, 2000)
        }
    }
})

const mostrarMensaje = () => {
    return(
        <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
            <p>{mensaje}</p>
        </div>
    )
}

    return(
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Pruducto</h1>

            { mensaje && mostrarMensaje() }

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre Producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nombre}
                                />
                        </div>

                        { formik.touched.nombre && formik.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{ formik.errors.nombre }</p>
                                </div>
                            ) : null }

                        <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                    Cantidad Disponible
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="existencia"
                                    type="number"
                                    placeholder="Cantidad Disponible"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.existencia}
                                />
                        </div>

                        { formik.touched.existencia && formik.errors.existencia ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{ formik.errors.existencia }</p>
                                </div>
                            ) : null }

                        <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                    Precio
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="precio"
                                    type="number"
                                    placeholder="Precio Cliente"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.precio}
                                />
                        </div>

                        { formik.touched.precio && formik.errors.precio ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{ formik.errors.precio }</p>
                                </div>
                            ) : null }

                        <input 
                            type="submit"
                            className="bg-green-600 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-green-700"
                            value="Registrar Producto"
                        />
                    </form>
                </div>
            </div>
        </Layout>
        
    )
}

export default nuevoProducto