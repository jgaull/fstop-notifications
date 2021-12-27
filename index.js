
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String
});

const Book = mongoose.model('Book', bookSchema);

const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
    _id: ID
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }

  type Mutation {
    createBook(title: String, author: String): Book,
    deleteBook(id: ID): Book
  }
`;

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: async () => await Book.find({})
    },
    Mutation: {
        createBook: async (nothing, params) => {
            const book = new Book(params)
            console.log(`creating a new book: ${JSON.stringify(book)}`)
            const record = await book.save()
            return record.toObject()
        },
        deleteBook: async (nothing, params) => {
            return Book.findByIdAndDelete(params.id)
        }
    }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

async function main() {

    await mongoose.connect('mongodb://localhost:27017/test');

    // The `listen` method launches a web server.
    const { url } = await server.listen()
    console.log(`🚀  Server ready at ${url}`)
}

main().catch(err => console.log(`error initializing the server: ${err.stack}`))
