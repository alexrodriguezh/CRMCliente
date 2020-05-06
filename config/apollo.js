import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'node-fetch'
import { setContext } from 'apollo-link-context'

// Aqui le decimos a donde se conecte
const httpLink = createHttpLink({
    
    // uri: 'http://localhost:4000/',
    uri: 'https://dry-beach-97396.herokuapp.com/',
    fetch
})

// Le agregamos un header nuevo
const authLink = setContext((_, { headers }) => {

    //Leer el storage almancenado
    const token = localStorage.getItem('token')

    return{
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

// Y por último lo conectamos a Apollo client
const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat( httpLink )
})

export default client