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
      pocTest: '',
      note: '',
      userCount: 0,
      rowsPerPage: 30,
      pageCount: 0,
      currentPage: 1
    };
  },
  componentDidMount () {
    // POC Test for usersByName.set, This one does not display anything except the console.
    // changed Aimee to enabled and changed her office to portland, aida was changed to enabled.
    console.log('seting user info via usersByName.');
    var setUsersByName = {
      json: {
        usersByName: {
          'Aimee Farmer': {
            is_enabled: true,
            name: 'Aimee Farmer',
            company: 'TELLIFLY',
            email: 'aimeefarmer@tellifly.com',
            phone: '(823) 547-2743',
            office: 'Portland'
          },
          'Aida Vega': {
            is_enabled: true,
            name: 'Aida Vega',
            company: 'DIGINETIC',
            email: 'aidavega@diginetic.com',
            phone: '(875) 559-2174',
            office: 'NYC'
          }
        }
      }
    };
    falcorModel.set(setUsersByName).then((data) => {
      console.log(data);
      // POC Test for usersAscendingSort.
      this.getUserCount().then(() => {
        if (this.state.userCount >= this.state.rowsPerPage) {
          this.getUsersAscending(0, this.state.rowsPerPage - 1);
          this.state.pageCount = Math.ceil(this.state.userCount / this.state.rowsPerPage);
        } else {
          this.getUsersAscending(0, this.state.userCount);
        }
      });
    });
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

          <p>Select POC test:
            &nbsp;&nbsp;<input
                type='button'
                name='Users-Ascending Sort'
                value='Get Users(ASC)'
                onClick={this.getUsersAscending}/>
            &nbsp;&nbsp;<input
                type='button'
                name='Users-Descending Sort'
                value='Get Users(DESC)'
                onClick={this.getUsersDescending}/>
            &nbsp;&nbsp;<input
                type='button'
                name='Users-Unsorted'
                value='All users'
                onClick={this.getUsers}/>
            &nbsp;&nbsp;<input
                type='button'
                name='OfficesByName'
                value='Get Offices'
                onClick={this.getOffices}/>
            &nbsp;&nbsp;<input
                type='button'
                name='Total Users'
                value='Get Total users'
                onClick={this.getUserCount}/>
          </p>

          <p>{this.state.pocTest}</p>

          <p>{this.state.note}</p>

          <p>Showing users { this.getCurrentUserRange() } of { this.state.userCount } users in the system.</p>
          <Table
              onColumnToggle={ this.handleColumnToggle }
              column={ this.state.sortColumn }
              direction={ this.state.sortDirection }
              rows={ this.state.sorted }/>
          <a class='right' name='previous' onClick={this.getSortedUsers}>Previous</a>
          { this.generatePageLinks() }
          &nbsp;&nbsp;
          <a class='right' name='next' onClick={this.getSortedUsers}>Next</a>
        </div>
    );
  },
  generatePageLinks () {
    var links = [];
    var lastPage = math.ceil(this.state.userCount / this.state.rowsPerPage);
    for (var i = 1; i <= lastPage; i++) {
      links.push(<a class='right' name={i} onClick={this.getSortedUsers}>{i}</a>,'&nbsp;&nbsp;');
    }
  },
  getCurrentUserRange () {
    var first = (this.state.rowsPerPage * this.state.currentPage) - (this.state.rowsPerPage - 1);
    var last = this.state.rowsPerPage * this.state.currentPage;
    var rangeString = first + '-' + last;
    return rangeString;
  },
  getSortedUsers () {
    var target = event.target;
    switch (target.name) {
      case 'next':
      {
        this.state.currentPage += 1;
        break;
      }
      case 'previous':
      {
        this.state.currentPage -= 1;
        break;
      }
      default:
      {
        this.state.currentPage = target.name;
        break;
      }
    }
    if (this.state.currentPage < 1 || this.state.currentPage > this.state.pageCount) {
      this.state.currentPage = 1;
    }
    var from = (this.state.rowsPerPage * this.state.currentPage) - this.state.rowsPerPage;
    var to = this.state.rowsPerPage * this.state.currentPage;
    to = to <= this.state.userCount ? to : this.state.userCount;
    if (this.state.sortDirection === 'az') {
      this.getUsersAscending(from, to);
    } else {
      this.getUsersDescending(from, to);
    }
  },
  getUsersAscending (from = 2, to = 15) {
    // POC test for usersAscendingSort
    console.log('loading sorted (Ascending) user info.');
    falcorModel.get('usersAscendingSort[' + from + '..' + to + ']["name","email","is_enabled","company","office","uid"]').then((data) => {
      console.log(data);
      this.setState({
        sorted: toArry(data.json.usersAscendingSort), pocTest: 'Testing usersAscendingSort'
      });
    });
  },
  getUsersDescending (from = 0, to = 15) {
    // POC test for usersDescendingSort
    console.log('loading sorted(Descending) user info.');
    falcorModel.get('usersDescendingSort[' + from + '..' + to + ']["name","email","is_enabled","company","office","uid"]').then((data) => {
      this.setState({
        sorted: toArry(data.json.usersDescendingSort), sortDirection: 'za', pocTest: 'Testing usersDescendingSort'
      });
      console.log(data);
    });
  },
  getUsers () {
    // POC test for unsorted users call and users.length.
    console.log('getting total number of users.');
    falcorModel.get('users.length').then((data) => {
      console.log(data);
      var numberOfUsers = data.json.users.length - 1;
      console.log('Loading unsorted user list.');
      if (numberOfUsers === undefined) {
        numberOfUsers = 19;
      }
      falcorModel.get('users[0..' + numberOfUsers + ']["name","email","is_enabled","company","office","uid"]').then((d) => {
        console.log(d);
        this.setState({
          sorted: sortBy(d.json.users, this.state.sortColumn), pocTest: 'Testing users.length'
        });
        console.log(d.json.users);
      });
    });
  },
  getUserCount () {
    var p = new Promise((resolve) => {
      // POC test users.length
      console.log('getting total number of users.');
      falcorModel.get('users.length').then((data) => {
        console.log(data);
        this.state.userCount = data.json.users.length;
        resolve();
      });
    });
    return p;
  },
  getOffices () {
    // POC Test for offices. This one does not display due to the way the table is dynamically created.
    console.log('loading office info.');
    falcorModel.get('offices["Maynard", "NYC"]["address"]').then((data) => {
      this.setState({
        sorted: toArry(data.json.offices), pocTest: 'Testing offices', note: JSON.stringify(data.json.offices, null, 2)
      });
      console.log(data.json.offices);
    });
  }
});

React.render(<App/>, document.body);
