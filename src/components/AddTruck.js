import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

export default function AddTruck() {
  //manage state for the form inputs
  const [formState, setFormSate] = useState({
    name: "",
    imageOfTruck: "",
    cuisineType: "",
    currentLocation: "",
    operatorId: "",
  });
  //managing error state
  const [errors, setErrors] = useState({
    name: "",
    imageOfTruck: "",
    cuisineType: "",
    currentLocation: "",
    operatorId: "",
  });

  //submit state checks whether the form can be submited
  const [buttonDisabled, setButtonDisabled] = useState(true);

  //inline validation on one key/value pair at a time
  const validateChange = (event) => {
    //.reach is in the yup library
    //returns a promise
    yup
      .reach(formSchema, event.target.name)
      .validate(event.target.value)
      .then((valid) => {
        //value from valid comes from .validate
        //if the input is passing formSchema
        setErrors({ ...errors, [event.target.name]: "" });
      })
      .catch((error) => {
        //if the input is breakign formSchema
        //capture the error message
        setErrors({ ...errors, [event.target.name]: error.errors[0] });
      });

    //need to call this function the onChange function = inputChnage
  };

  //onChange function
  const inputChange = (event) => {
    //allows us to pass around synthertic events
    event.persist();
    console.log(event.target.name);
    console.log(event.target.value);

    const newFormState = {
      ...formState,
      [event.target.name]: event.target.value,
    };

    //event is being passed in to the validateChange function i created
    validateChange(event);

    setFormSate(newFormState);
  };

  //form schema set of rules
  //object is coming from yup library
  //shape function takes in an object {}
  const formSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    imageOfTruck: yup.string().required("URL Link required"),
    cuisineType: yup.string().required("Cuisine type is required"),
    currentLocation: yup.string().required("Location is required"),
    operatorId: yup.string().required("ID is required"),
  });

  useEffect(() => {
    //isValid comes from the yup library
    //checking formSchema against formState
    //comparing the keys and the values
    //returns a promise
    formSchema.isValid(formState).then((valid) => {
      //we can check the process has been completed
      setButtonDisabled(!valid);
    });
  }, [formState]);
  //do something every time formState changes

  //onSubmit function
  const formSubmit = (event) => {
    event.preventDefault();
    //post takes url and what we want to post to the api
    axios
      .post("https://reqres.in/api/users", formState)
      .then((response) => {
        console.log(response.data);
        setFormSate({
          name: "",
          imageOfTruck: "",
          cuisineType: "",
          currentLocation: "",
          operatorId: "",
        });
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  return (
    <div>
      <h1>Add truck page</h1>
      <form onSubmit={formSubmit}>
        <label htmlFor="name">
          Name
          <input
            id="name"
            type="text"
            name="name"
            value={formState.name}
            placeholder="Trucks Name"
            onChange={inputChange}
          />
          {errors.name.length > 0 ? <p>{errors.name}</p> : null}
        </label>
        <label htmlFor="imageOfTruck">
          Picture of Truck
          <input
            id="imageOfTruck"
            type="text"
            name="imageOfTruck"
            value={formState.imageOfTruck}
            placeholder="Add URL Link of your picture"
            onChange={inputChange}
          />
          {errors.imageOfTruck.length > 0 ? <p>{errors.imageOfTruck}</p> : null}
        </label>
        <label htmlFor="cuisineType">
          Cuisine Type
          <input
            id="cuisineType"
            type="text"
            name="cuisineType"
            value={formState.cuisineType}
            placeholder="Type of Cuisine"
            onChange={inputChange}
          />
          {errors.cuisineType.length > 0 ? <p>{errors.cuisineType}</p> : null}
        </label>
        <label htmlFor="currentLocation">
          Truck's Location
          <input
            id="currentLocation"
            type="text"
            name="currentLocation"
            value={formState.currentLocation}
            placeholder="Location"
            onChange={inputChange}
          />
          {errors.currentLocation.length > 0 ? (
            <p>{errors.currentLocation}</p>
          ) : null}
        </label>
        <label htmlFor="operatorId">
          Operator ID
          <input
            id="operatorId"
            type="text"
            name="operatorId"
            value={formState.operatorId}
            placeholder="Your ID number"
            onChange={inputChange}
          />
          {errors.operatorId.length > 0 ? <p>{errors.operatorId}</p> : null}
        </label>
        <button type="submit" disabled={buttonDisabled}>
          Add Truck
        </button>
      </form>
    </div>
  );
}
