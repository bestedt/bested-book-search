import { gql } from '@apollo/client';
// here is the query for the me query
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
// the search query
export const SEARCH_GOOGLE_BOOKS = gql`
  query searchGoogleBooks($searchInput: String!) {
    searchGoogleBooks(searchInput: $searchInput) {
      authors
      description
      bookId
      image
      link
      title
    }
  }
`;