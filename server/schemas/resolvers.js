// here is the resolver functions 
const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');
const { authMiddleware } = require('../utils/auth');  
// here are the query resolvers
const resolvers = {
    Query: {
        // the me query returns the user that is logged in
        me: async (_, __, context) => {
          if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
              .select('-__v -password')
              .populate('savedBooks');
    
            return userData;
          }
    
          throw new AuthenticationError('Not logged in');
        },
    // the searchGoogleBooks query returns an array of books based on the search input
        searchGoogleBooks: async (_, { searchInput }) => {
          try {
            // usinmg the fetch api to make a request to the google books api
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);
            const data = await response.json();
    
            const searchResults = data.items.map((item) => ({
              authors: item.volumeInfo.authors || ['No author to display'],
              description: item.volumeInfo.description,
              bookId: item.id,
              image: item.volumeInfo.imageLinks?.thumbnail || '',
              link: item.volumeInfo.infoLink,
              title: item.volumeInfo.title,
            }));
    
            return searchResults;
          } catch (error) {
            console.error(error);
            // error handling
            throw new Error('Failed to search Google Books');
          }
        },
      },
      // here are the mutation resolvers
  Mutation: {
    // the login mutation returns a token and the user that is logged in
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    // the add user mutation creates a new user and returns a token and the user that is logged in
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // the save book mutation sves books to the users saved books array
    saveBook: async (_, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        ).populate('savedBooks');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    // the remove book mutation removes books from the users saved books array
    removeBook: async (_, { bookId }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          ).populate('savedBooks');
      
          return updatedUser;
        }
      
        throw new AuthenticationError('You need to be logged in!');
      },
  },
};
// export the resolvers
module.exports = resolvers;
