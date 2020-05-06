import Layout from '../components/Layout'
import Pedido from '../components/Pedido'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor{
        obtenerPedidosVendedor{
            id
            pedido{
                id
                cantidad
                nombre
            }
            cliente {
                id
                nombre
                apellido
                email
                telefono
            }
            vendedor
            total
            estado
        }
    }
`

const Pedidos = () => {

    const { data, loading, error } = useQuery(OBTENER_PEDIDOS)

    if(loading) return 'Cargando...'

    const { obtenerPedidosVendedor } = data

    return (
        <div>
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
            <Link href="/nuevopedido">
                <a className="bg-green-700 py-2 px-5 mt-5 inline-block rounded text-white text-sm hover:bg-green-800 mb-3 uppercase font-bold">Nuevo Pedido</a>
            </Link>

            { obtenerPedidosVendedor.length === 0 ? (
                <p className="mt-5 text-center text-2xl">No hay pedidos aún</p>
            ) : (
                obtenerPedidosVendedor.map( i => (
                    <Pedido 
                        key={i.id}
                        pedido={i}
                    />
                ))
            )}
        </Layout>
        </div>
    )
}

export default Pedidos