import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { connect } from 'react-redux';
import { addMenuItem, updateMenuItem } from '../store/actions';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FloatingLabel,
} from 'react-bootstrap';

function MenuItem(props) {
  const { currentTruck, addMenuItem, menuItemToEdit, updateMenuItem } = props;
  const { push } = useHistory();
  const initialStateObj = { itemName: '', itemDescription: '', itemPrice: '' };
  const [input, setInput] = useState(
    menuItemToEdit ? menuItemToEdit : initialStateObj
  );
  const [errorState, setErrorState] = useState({});
  const [btnState, setBtnState] = useState(true);

  const onSubmitFunc = e => {
    console.log(props);
    e.preventDefault();
    const newMenuItem = {
      itemName: input.itemName.trim(),
      itemDescription: input.itemDescription.trim(),
      itemPrice: input.itemPrice,
    };
    menuItemToEdit
      ? updateMenuItem(currentTruck.id, menuItemToEdit.id, newMenuItem, push)
      : addMenuItem(currentTruck.id, newMenuItem, push);
    setInput(initialStateObj);
  };

  const onChange = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
    validate(e);
  };

  const formSchema = yup.object().shape({
    itemName: yup.string().required('Name required.'),
    itemDescription: yup.string().required('Description required.'),
    itemPrice: yup.number('Price required').required('Price required.'),
  });

  const validate = e => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(ifValid => {
        setErrorState({ ...errorState, [e.target.name]: '' });
      })
      .catch(ifErr => {
        setErrorState({ ...errorState, [e.target.name]: ifErr.errors[0] });
      });
  };

  useEffect(() => {
    formSchema.isValid(input).then(valid => {
      setBtnState(!valid);
    });
  }, [input]);

  return (
    <Container fluid='md'>
      <Form onSubmit={onSubmitFunc}>
        <Row className='d-flex justify-content-center'>
          <Col md={6}>
            <Form.Group>
              <FloatingLabel label='Item Name' className='my-2'>
                <Form.Control
                  type='text'
                  name='itemName'
                  id='itemName'
                  value={input.itemName}
                  onChange={onChange}
                  placeholder='Enter Item Name'
                  isInvalid={errorState.itemName}
                />
              </FloatingLabel>
              <Form.Control.Feedback type='invlaid' className='text-danger m-0'>
                {errorState.itemName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className='d-flex justify-content-center'>
          <Col md={6}>
            <Form.Group>
              <FloatingLabel label='Item Description' className='my-2'>
                <Form.Control
                  type='text'
                  name='itemDescription'
                  id='itemDescription'
                  value={input.itemDescription}
                  onChange={onChange}
                  placeholder='Enter Item Name'
                  isInvalid={errorState.itemDescription}
                />
              </FloatingLabel>
              <Form.Control.Feedback type='invlaid' className='text-danger m-0'>
                {errorState.itemDescription}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className='d-flex justify-content-center'>
          <Col md={6}>
            <Form.Group>
              <FloatingLabel label='Item Price' className='my-2'>
                <Form.Control
                  type='number'
                  name='itemPrice'
                  id='itemPrice'
                  value={input.itemPrice}
                  onChange={onChange}
                  placeholder='Item Price'
                  isInvalid={errorState.itemPrice}
                />
              </FloatingLabel>
              <Form.Control.Feedback type='invlaid' className='text-danger m-0'>
                {errorState.itemPrice}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className='d-flex justify-content-center'>
          <Col md={6}>
            <Button
              variant='primary'
              type='submit'
              size='lg'
              disabled={btnState}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    currentTruck: state.currentTruck,
    menuItemToEdit: state.menuItemToEdit,
  };
};

export default connect(mapStateToProps, { addMenuItem, updateMenuItem })(
  MenuItem
);
