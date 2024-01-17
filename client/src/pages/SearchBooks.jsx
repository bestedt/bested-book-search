// importing the necessary dependencies in cluding query and mutation and components
import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';

import Auth from '../utils/auth';
import { SEARCH_GOOGLE_BOOKS } from '../utils/queries';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { SAVE_BOOK } from '../utils/mutations';
// the searchBooks component is created to search for books thatnthe user can save
const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [searchGoogleBooks, { loading, data }] = useLazyQuery(SEARCH_GOOGLE_BOOKS);
// the useEffect Hook is used to save the bookIds to localStorage on component unmount
  useEffect(() => {
    if (data) {
      const bookData = data.searchGoogleBooks.map((book) => ({
        bookId: book.bookId,
        authors: book.authors || ['No authors to display'],
        title: book.title,
        description: book.description,
        image: book.image || '',
      }));

      setSearchedBooks(bookData);
    }
  }, [data]);
// here is the saveBook mutation currenty it is not working, getting an error saying im not logged in
  const [saveBook] = useMutation(SAVE_BOOK, {
    context: {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    },
  });
// here is the handleFormSubmit function to search for books
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      // using a try/catch instead of promises to handle errors
      searchGoogleBooks({
        variables: { searchInput: searchInput },
      });

      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };
// my handleSaveBook function is not working, getting an error saying im not logged in when i am 
  const handleSaveBook = async (bookId) => {
    if (Auth.loggedIn()) {
      const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

      try {
        const { data } = await saveBook({
          variables: { bookData: bookToSave },
          context: {
            headers: {
              Authorization: `Bearer ${Auth.getToken()}`,
            },
          },
        });
// here is the saveBookId function to save the bookId to localStorage
        const savedBookId = data.saveBook.savedBooks[0].bookId;
        setSavedBookIds([...savedBookIds, savedBookId]);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("User is not logged in. Cannot save the book.");
      
    }
  };
// rendering the books
  const renderBooks = () => {
    return (
      <Container>
        <h2 className='mt-5 mb-4'>Results</h2>
        {searchedBooks.map((book) => (
          <BookItem key={book.bookId} book={book} handleSaveBook={handleSaveBook} />
        ))}
      </Container>
    );
  };
// the structure of the SearchBooks component from the starter code
  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border='dark'>
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBook(book.bookId)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};
// exporting the SearchBooks component
export default SearchBooks;
