
//==============================================
//     BOOTSTRAP SETUP REACT
//==============================================

<!-- Bootstrap CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">


  <!--font awsom cdn link v.5 -->
  <!-- example : <i className="fas fa-camera"></i> -->
<script src="https://kit.fontawesome.com/df582cf810.js"></script>


<!-- Optional JavaScript -->

    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
 <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
 <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  


//localhost port 4000 is node js server loacalhost

//add proxy under browserlist in react clint pack.json file
//browserlist:{},
"proxy": "http://localhost:4000"

//after setup resstart your clint and server
//then run:  npm start


//==============================================
//     types.js
//==============================================
export const POST_DATA="POST_DATA";

//==============================================
//     crudReducer.js
//==============================================

import _ from "lodash";

import {
  POST_DATA,
  GETALL_DATA,
  GETSINGLE_DATA,
  UPDATE_DATA,
  DELETE_DATA
} from "../actions/type";
const init = {};
export default (state = init, action) => {
  switch (action.type) {
    //post data
    case POST_DATA:
      return { ...state, [action.payload.id]: action.payload };
    //get all data
    case GETALL_DATA:
      return { ...state, ..._.mapKeys(action.payload, "_id") };
    //delete data
    case DELETE_DATA:
      return _.omit(state, action.payload);
    //get single data
    case GETSINGLE_DATA:
      return { ...state, [action.payload.id]: action.payload };
    //update data
    case UPDATE_DATA:
      return { ...state, [action.payload.id]: action.payload };
    //default
    default:
      return state;
  }
};


//==============================================
//     crudAction.js
//==============================================


import axios from "axios";

import {
  POST_DATA,
  GETALL_DATA,
  GETSINGLE_DATA,
  UPDATE_DATA,
  DELETE_DATA
} from "../actions/type";

//post data
export const postData = formValues => async dispatch => {
  const response = await axios.post("/api/player", formValues);
  dispatch({ type: POST_DATA, payload: response.data });
};

//get all data
export const getalldata = () => async dispatch => {
  const response = await axios.get("/api/player");
  dispatch({ type: GETALL_DATA, payload: response.data });
};
//get single data
export const getsingledata = id => async dispatch => {
  const response = await axios.get(`/api/player/${id}`);
  dispatch({ type: GETSINGLE_DATA, payload: response.data });
};

//delete data
export const deletemydata = id => async dispatch => {
  await axios.delete(`/api/player/${id}`);
  dispatch({ type: DELETE_DATA, payload: id });
};
//update data
export const editStream = (id, formValues) => async dispatch => {
  const response = await axios.put(`/api/player/${id}`, formValues);
  dispatch({ type: UPDATE_DATA, payload: response.data });
};




//==============================================
//     REACT HOOK GET ALL DATA
//==============================================

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getalldata } from "../store/actions/crudAction";
const Getdata = props => {
  useEffect(() => {
    props.getalldata();
  }, []);

  console.log(props);
  if (!props.alldata) {
    return (
      <div>
        <h1>LOADING....</h1>
      </div>
    );
  }
  return (
    <div className="container">
      {props.alldata.map(data => (
        <div key={data._id} className="card card-body mb-3">
          <h4>{data.name}</h4>
          <ul className="list-group">
            <li className="list-group-item">{data.price}</li>
            <li className="list-group-item">{data.playertype}</li>
          </ul>
          <button className=" mt-2 btn btn-block btn-danger">DELETE</button>
          <button className="btn btn-block btn-info">UPDATE</button>
          <button className="btn btn-block btn-warning">DETAIL PAGE</button>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = state => {
  return { alldata: Object.values(state.crudReducer) };
};
export default connect(mapStateToProps, { getalldata })(Getdata);


//==============================================
//     REACT HOOK GET SINGLE DATA
//==============================================

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getsingledata } from "../store/actions/crudAction";
const Singledata = props => {
  useEffect(() => {
    props.getsingledata(props.match.params._id);
  }, []);

  console.log(props.singledata);
  if (!props.singledata) {
    return (
      <diiv>
        <h1>Loading...</h1>
      </diiv>
    );
  }

  return (
    <div>
      <h3> HELLO {props.singledata.name}</h3>
      <h3> {props.singledata.price}</h3>
      <h3> {props.singledata.playertype}</h3>
      <h2>Date {props.singledata.date}</h2>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { singledata: state.crudReducer[ownProps.match.params.id] };
};

export default connect(mapStateToProps, { getsingledata })(Singledata);


//==============================================
//     REACT HOOK FORM ONLY
//==============================================

import React, { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    playertype: ""
  });

  const { name, price, playertype } = formData;

  //onchange
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //onsubmit
  const onSubmit = e => {
    e.preventDefault();
  };
  return (
    <div className="container card card-body mt-5">
      <form onSubmit={onSubmit}>
        <div class="form-group">
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            class="form-control"
            placeholder="Name"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            name="price"
            value={price}
            onChange={onChange}
            class="form-control"
            placeholder="price"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            name="playertype"
            value={playertype}
            onChange={onChange}
            class="form-control"
            placeholder="playertype"
          />
        </div>

        <button type="submit" class="btn btn-block btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;

/////////////////////////////////////
//  REACT COMPONENT POST DATA
///////////////////////////////////////

import React, { useState } from "react";
import { connect } from "react-redux";
import { postData } from "../store/actions/crudAction";
const Form = props => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    playertype: ""
  });

  const { name, price, playertype } = formData;

  //onchange
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //onsubmit
  const onSubmit = e => {
    e.preventDefault();
    props.postData({ name, price, playertype });
    setFormData({
      name: "",
      price: "",
      playertype: ""
    });
  };
  return (
    <div className="container card card-body mt-5">
      <form onSubmit={onSubmit}>
        <div class="form-group">
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            class="form-control"
            placeholder="Name"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            name="price"
            value={price}
            onChange={onChange}
            class="form-control"
            placeholder="price"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            name="playertype"
            value={playertype}
            onChange={onChange}
            class="form-control"
            placeholder="playertype"
          />
        </div>

        <button type="submit" class="btn btn-block btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default connect(null, { postData })(Form);




/////////////////////////////////////
//  edit in react hook
///////////////////////////////////////


import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getsingledata, editStream } from "../store/actions/crudAction";

const Edit = props => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    playertype: ""
  });
  const { name, price, playertype } = formData;
  useEffect(() => {
    props.getsingledata(props.match.params._id);
  }, []);

  useEffect(() => {
    if (props.editdata) {
      setFormData({
        name: props.editdata.name,
        price: props.editdata.price,
        playertype: props.editdata.playertype
      });
    }
  }, [props.editdata]);

  //onchange
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //onsubmit
  const onSubmit = e => {
    e.preventDefault();
    props.editStream(props.match.params._id, formData);
    setFormData({
      name: "",
      price: "",
      playertype: ""
    });
  };

  console.log(props);
  if (!props.editdata) {
    return (
      <div>
        <h1>LOADING...</h1>
      </div>
    );
  }
  return (
    <div className="container">
      <h4>
        Ready to updata your data <u>{props.editdata.name}</u>
      </h4>
      <form onSubmit={onSubmit}>
        <div class="form-group">
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            class="form-control"
            placeholder="Name"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            name="price"
            value={price}
            onChange={onChange}
            class="form-control"
            placeholder="price"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            name="playertype"
            value={playertype}
            onChange={onChange}
            class="form-control"
            placeholder="playertype"
          />
        </div>

        <button type="submit" class="btn btn-block btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { editdata: state.crudReducer[ownProps.match.params.id] };
};

export default connect(mapStateToProps, { getsingledata, editStream })(Edit);






//==============================================
//  REACT GET DATA COMPONENT LEVEL CLASSBASE
//==============================================

 import React, { Component } from "react";
import Axios from "axios";
export class ImageDisplay extends Component {
  state = {
    posts: []
  };

  componentDidMount() {
    Axios.get("/api/fileupload")
      .then(res => {
        this.setState({
          posts: res.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    // console.log(this.state);
    return (
      <div >
        <h4>Image display component</h4>

        <div className="container">
          <div className="row">
            {this.state.posts.map(contact => (
              <div key={contact._id} className="col-md-4 mb-5">
                <div className="card card-body">
                  <img src={contact.image_url} alt="" />
                  <h5>{contact.name}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ImageDisplay;


//******************************
// REACT HISTORY.PUSH
//******************************

//history.js

import { createBrowserHistory } from "history";

export default createBrowserHistory();

//App.js
import { Router, Route, Switch } from "react-router-dom";
import history from './history';

  <Router history={history}>
  
  </Router>
  
  //Adddata.js
  import history from '../../history'

  submitHandler = event => {
	  
   history.push('/dashbord')
  }

//***************************
//MAPS IN React
//***************************  
  
// Featch data By Map

  {contacts.map(contact => ( 
            <h4>{contact.name}</h4>
        ))
		}



//////////////////////////////////////////////////
//
//  FILE UPLOAD IN REACT COMPONENT HTML FORM WAY
//
/////////////////////////////////////////////////
import React, { Component } from "react";

export class ImageUpload extends Component {
  render() {
    return (
      <div style={{ border: "2px solid green" }} className="container ">
        <h3>File uplaod html way</h3>
        <form
          action="/api/fileupload"
          method="post"
          encType="multipart/form-data"
        >
          <div className="form-group">
            {" "}
            <input type="file" name="image_url" />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Image name"
              name="name"
              id="name"
            />
          </div>

          <button className="btn btn-info btn-block" type="submit">
            upload file
          </button>
        </form>
      </div>
    );
  }
}

export default ImageUpload;
