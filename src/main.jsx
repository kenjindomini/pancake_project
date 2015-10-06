import React from 'react';

import {
  // httpClient,
    falcorModel
} from './client-data';

import { Table } from './fixedTable.jsx';
import sortBy from 'lodash/collection/sortBy';
import toArry from 'lodash/lang/toArray';

let App = React.createClass({
  getInitialState () {
    return {
      sortColumn: 'name',
      sortDirection: 'az',
      sorted: [],
      pocTest: ""
    };
  },
  componentDidMount () {
    // httpClient({
    //   path: '/api/users.json'
    // }).then((res) => {
    //   this.setState({
    //     sorted: sortBy(res.entity, this.state.sortColumn)
    //   });
    // });
    /*
    //POC Test for users.length.
    console.log("getting total number of users.");
    falcorModel.get('users.length').then((data) => {
      console.log(data);
      var numberOfUsers = data.json.users.length - 1;
      console.log("Loading unsorted user list.");
      if(numberOfUsers == undefined) {numberOfUsers = 19;}
      falcorModel.get('users[0..'+numberOfUsers+']["name","email","is_enabled","company","office","uid"]').then((d) => {
        console.log(d);
        this.setState({
          sorted: sortBy(d.json.users, this.state.sortColumn), pocTest: "Testing users.length"
        });
        console.log(d.json.users);
      });
    });
     */
    /*
     //POC Test for usersAscendingSort.
     console.log("loading sorted (Ascending) user info.");
     falcorModel.get('usersAscendingSort[0..15]["name","email","is_enabled","company","office","uid"]').then((data) => {
     console.log(data);
     this.setState({
     sorted: toArry(data.json.usersAscendingSort), pocTest: "Testing usersAscendingSort"
     });
     });
     */
    /*
    //POC Test for usersDescendingSort
     console.log("loading sorted(Descending) user info.");
     falcorModel.get('usersDescendingSort[0..15]["name","email","is_enabled","company","office","uid"]').then((data) => {
     this.setState({
     sorted: toArry(data.json.usersDescendingSort), sortDirection: 'za', pocTest: "Testing usersDescendingSort"
     });
     console.log(data);
     });
     */
    /*
    //POC Test for offices. This one does not display due to the way the table is dynamically created.
    console.log("loading office info.");
    falcorModel.get('offices["Maynard", "NYC"]["address"]').then((data) => {
      this.setState({
        sorted: toArry(data.json.offices), pocTest: "Testing offices"
      });
      console.log(data.json.offices)
    });
    */
    //*
    //POC Test for usersByName.set, This one does not display anything except the console.
    console.log("seting user info via usersByName.");
    var setUsersByName = {
      json: {
        usersByName: {
          "Delores Patterson": {
            "is_enabled": true,
            "name": "Delores Patterson",
            "company": "ESSENSIA",
            "email": "delorespatterson@essensia.com",
            "phone": "(942) 591-2934",
            "office": "Portland"
          }
        }
      }
    };
    falcorModel.set(setUsersByName).then((data) => {
      console.log(data);
    });
  //*/
  },
  handleColumnToggle (newColumn) {
    let newDirection = (this.state.sortDirection === 'az' && this.state.sortColumn === newColumn) ? 'za' : 'az';
    // TODO consider special casing the `is_enabled` sort
    let sorted;
    if (newDirection === 'az') {
      sorted = sortBy(this.state.sorted, newColumn);
    } else {
      sorted = sortBy(this.state.sorted, newColumn).reverse();
    }
    this.setState({
      sortColumn: newColumn,
      sortDirection: newDirection,
      sorted: sorted
    });
  },
  render () {
    return (
        <div>
          <h1>Welcome to the Jungle</h1>

          <p>{this.state.pocTest}</p>

          <p>There are { this.state.sorted.length } users in the system.</p>
          <Table
              onColumnToggle={ this.handleColumnToggle }
              column={ this.state.sortColumn }
              direction={ this.state.sortDirection }
              rows={ this.state.sorted }/>
        </div>
    );
  }
});

React.render(<App/>, document.body);
