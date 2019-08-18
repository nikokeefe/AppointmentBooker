import React, { Component } from 'react';
import { without, findIndex } from 'lodash';

import '../css/App.css';

import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';

class App extends Component {

  constructor() {
    super();
    this.state = {
      lastIndex: 0,
      myApts: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: ''
    }

    // 'this' binding
    this.deleteApt = this.deleteApt.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateApt = this.updateApt.bind(this);
  }

  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay
    });
  }

  addAppointment(apt) {
    let tempApts = this.state.myApts;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);

    this.setState({
      myApts: tempApts
    })
  }

  updateApt(name, value, id) {
    let tempApts = this.state.myApts;
    let aptIndex = findIndex(this.state.myApts, {
      aptId: id
    });
    tempApts[aptIndex][name] = value;
    this.setState({
      myApts: tempApts
    })
  }

  deleteApt(apt) {
    let tempApts = this.state.myApts;
    tempApts = without(tempApts, apt);

    this.setState({
      myApts: tempApts,
      lastIndex: this.state.lastIndex + 1
    })
  }

  searchApts(query) {
    this.setState({
      queryText: query
    })
  }

  changeOrder(order, dir) {
    this.setState({
      orderBy: order,
      orderDir: dir
    });
  }

  componentDidMount() {
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({ lastIndex: this.state.lastIndex + 1 });
          return item;
        })
        this.setState({
          myApts: apts
        });
      });
  }

  render() {

    let order;
    let filteredApts = this.state.myApts;
    if (this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1;
    }

    filteredApts = filteredApts.sort((a, b) => {
      if (a[this.state.orderBy].toLowerCase() < 
          b[this.state.orderBy].toLowerCase()
      ) {
        return -1 * order;
      } else {
        return 1 * order;
      }
    }).filter(eachItem => {
      return(
        eachItem['petName']
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName']
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes']
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase())
      )
    });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments 
                  formDisplayProp={this.state.formDisplay}
                  toggleFormProp={this.toggleForm}
                  addAptProp={this.addAppointment}
                />
                <SearchAppointments 
                  orderByProp={this.state.orderBy}
                  orderDirProp={this.state.orderDir}
                  changeOrderProp={this.changeOrder}
                  searchAptsProp={this.searchApts}
                />
                <ListAppointments 
                  aptsProp={filteredApts} 
                  deleteAptProp={this.deleteApt}
                  updateAptProp={this.updateApt}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default App;
