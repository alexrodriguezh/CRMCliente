import Layout from '../components/Layout';
import Producto from '../components/Producto';
import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            precio
            existencia
        }
    }
`;

const Productos = () => {

    // Consultar los productos
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS)
    // console.log(data)
    // console.log(loading)
    // console.log(error)

    if(loading) return 'Cargando...'

    return (
        <div>
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
            <Link href="/nuevoproducto">
            <a className="bg-green-700 py-2 px-5 mt-5 inline-block rounded text-white text-sm hover:bg-green-800 mb-3 uppercase font-bold">Nuevo Producto</a>
            </Link>

            <table className="table-auto shadow-md mt-10 w-full w-lg">
                <thead className="bg-green-600">
                    <tr className="text-white">
                    <th className="w-1/5 py-2">Nombre</th>
                    <th className="w-1/5 py-2">Existencia</th>
                    <th className="w-1/5 py-2">Precio</th>
                    <th className="w-1/5 py-2">Eliminar</th>
                    <th className="w-1/5 py-2">Editar</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {data.obtenerProductos.map( i => (
                        <Producto 
                        key={i.id}
                        producto = {i}
                        />
                    ))}
                </tbody>
            </table>
        </Layout>
        </div>
    )
}

export default Productos