import React from 'react';

import {
  // httpClient,
  falcorModel
} from './client-data';

import { Table } from './fixedTable.jsx';
import sortBy from 'lodash/collection/sortBy';
import toArry from 'lodash/lang/toArray';

//TODO: Add POC tests for three new falcor routes.

let App = React.createClass({
  getInitialState () {
    return {
      sortColumn: 'name',
      sortDirection: 'az',
      sorted: []
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
    console.log("Loading unsorted user list.");
    falcorModel.get('users[0..20]["name","email","is_enabled","company","office","uid"]').then((d) => {
      console.log(d);
      this.setState({
        sorted: sortBy(d.json.users, this.state.sortColumn)
      });
      console.log(d.json.users);
    });
    */
    //*
    console.log("loading sorted (Ascending) user info.");
    falcorModel.get('usersAscendingSort[0..15]["name","email","is_enabled","company","office","uid"]').then((data) => {
      console.log(data);
      this.setState({
        sorted: toArry(data.json.usersAscendingSort)
      });
    });
    //*/
/*
     console.log("loading sorted(Descending) user info.");
     falcorModel.get('usersDescendingSort[0..15]["name","email","is_enabled","company","office","uid"]').then((data) => {
     this.setState({
     sorted: toArry(data.json.usersDescendingSort), sortDirection: 'za'
     });
       console.log(data);
     });
*/
    /*
     console.log("loading office info.");
     falcorModel.get('offices["Maynard", "NYC"]').then((data) => {
     this.setState({
     sorted: toArry(data.json.offices)
     });
     });
     */
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
        <p>Testing presort Descending.</p>
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
