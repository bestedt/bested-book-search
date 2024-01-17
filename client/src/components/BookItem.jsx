// this component is used to display a single book item
import React from 'react';
import { Card, Button } from 'react-bootstrap';
// here is the component and its query
const BookItem = ({ book, handleSaveBook }) => {
  return (
    <Card>
     
      <Button variant='primary' onClick={() => handleSaveBook(book.bookId)}>
        Save Book
      </Button>
    </Card>
  );
};
// export the component
export default BookItem;
