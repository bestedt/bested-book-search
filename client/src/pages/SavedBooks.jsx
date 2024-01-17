// importing the necessary dependencies in cluding query and mutation
import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
// creating the SavedBooks component
const SavedBooks = () => {
  const { loading, error, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};
// creating the handleDeleteBook function to remove a book from the database
  const handleDeleteBook = async (bookId) => {
    if (!Auth.loggedIn()) {
      console.error('Not logged in. User data:', userData);
      return;
    }
// here is the mutation to remove a book
    const token = Auth.getToken();
    if (!token) {
      console.error('Token is not present.');
      return;
    }
// here is the try/catch block
    try {
      const { data } = await removeBook({
        variables: { bookId: bookId },
      });

      console.log('Remove Book Mutation Data:', data);
// here is the removeBookId function
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
// below is the structure of the SavedBooks component which was oart of the starter code
  return (
    <>
      <Container fluid className="text-light bg-dark p-5">
        <h1>Viewing saved books!</h1>
      </Container>
      <Container>
        {error && (
          <div className="alert alert-danger">
            Error loading saved books. Please try again.
          </div>
        )}

        <h2 className='pt-5'>
          {userData.savedBooks && userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks &&
            userData.savedBooks.map((book) => (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
};
// exporting the SavedBooks component
export default SavedBooks;

