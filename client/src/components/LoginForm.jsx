// here is where we will create the login form component, fisrt we will import the react hooks and the apollo client
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';

import { LOGIN_USER } from '../utils/mutations'; // Update the import path accordingly
import Auth from '../utils/auth';
// then we will create the login form component
const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
// here is where the mutation will be used from our mutations file
  const [loginUser] = useMutation(LOGIN_USER);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };
// here is where we will handle the form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();
  // here is where we will validate the form
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  // here is where we will use the mutation to login the user
    try {
      const { data } = await loginUser({
        variables: { ...userFormData },
      });
  // here is where we will handle the response from the mutation
      console.log('Data received from loginUser mutation:', data);
  
      const loginUserData = data && data.login;
  // here is where we will handle the case where the server response is missing or does not contain loginUser
      if (loginUserData) {
        const { token, user } = loginUserData;
        console.log('Token and user:', token, user);
  
        Auth.login(token);
      } else {
        // another way to handle this would be to throw an error
        console.error('loginUser mutation response does not contain loginUser:', data);
        setShowAlert(true);
      }
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
  // here is where we will reset the form
    setUserFormData({
      email: '',
      password: '',
    });
  };
// here is the structure of the login form that was part of the starter code
  return (
    <>

      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};
// export the login form component
export default LoginForm;
