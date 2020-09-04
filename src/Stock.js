import React, {Component} from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: "Symbol", field: "symbol", width: 120, sortable: true, cellRendererFramework:
            function(param) {
              return(
                <Link to = {"/" + param.value}>{param.value}</Link>
              );
            }
        },
        { headerName: "Name", field: "name", width: 280, sortable: true },
        { headerName: "Industry", field: "industry", sortable: true }],
      rowData: [],
      originalData: [],
      searchSymbol: "",
      searchIndustry: "",
      loading: true
    }
    this.handleChangeSymbol = this.handleChangeSymbol.bind(this);
    this.handleChangeIndustry = this.handleChangeIndustry.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Get a user input for symbols
  handleChangeSymbol(event) {
    this.setState({searchSymbol: event.target.value});
  }

  // Get a user input for industries
  handleChangeIndustry (event) {
    this.setState({searchIndustry: event.target.value});
  }
  
  // Perform search locally
  handleSubmit(event) {
    let querySymbol = this.state.searchSymbol.toUpperCase();
    let queryIndustry = this.state.searchIndustry;
    let rowdataValue = this.state.originalData;

    let arr = []; // Array to store the search result
    let tempArr = []; // For AND search

    // When both the symbol field and the industry field are filled - AND search
    if ((querySymbol !== "") && (queryIndustry !== "")) {
      rowdataValue.forEach (function(stock) {
        if ((stock.symbol).includes(querySymbol)) {
          tempArr.push(stock);
        }
      })       

      tempArr.forEach (function(stock) {
        if ((stock.industry.toLowerCase()).includes(queryIndustry.toLowerCase())) {
          arr.push(stock);
        }
      })
    }

    // When only the symbol field is filled
    if ((querySymbol !== "") && (queryIndustry === "")) {
      rowdataValue.forEach (function(stock) {
        if ((stock.symbol).includes(querySymbol)) {
          arr.push(stock);
        }
      })
    }

    // When only the industry field is filled
    if ((querySymbol === "") && (queryIndustry !== "")) {
      rowdataValue.forEach (function(stock) {
        if ((stock.industry.toLowerCase()).includes(queryIndustry.toLowerCase())) {
          arr.push(stock);
        }
      })     
    }

    // When both fields are empty - show all stocks in the table
    if ((querySymbol === "") && (queryIndustry === "")) {
      rowdataValue.forEach (function(stock) {
          arr.push(stock);
      })
    }

    // set arr (filtering result) to rowData - this is to overwrite rowData only when the user performs the search and to maintain the original value elsewhere
    this.setState({rowData: arr});
    event.preventDefault();
  }


  componentDidMount() {
      // axios.get(`http://131.181.190.87:3001/all`)  // The original endpoint provided by the unit
      axios.get(`http://localhost:3001/all`)
      .then(res => {
        let rowdataVal = res.data;
        this.setState({rowData: rowdataVal});
        this.setState({originalData: rowdataVal});
        this.setState({loading: false});
      });
  }


  render() {
    if (this.state.loading === true) {
      return (
        <div className="container">
          <p>Loading...</p>
        </div>
      );
    }
    
    return (
      <div className="container">
        <div className="searchbar">
          <label htmlFor="symbol" className="label">Symbol:</label>
          <div className="form" style={ {display: "inline"} }>
            <input type="text" id="symbol" value={this.state.searchSymbol} onChange={this.handleChangeSymbol} />
          </div>

          <label htmlFor="industry" className="label">Industry:</label>
          <div className="form" style={ {display: "inline"} }>
            <input type="text" id="industry" value={this.state.searchIndustry} onChange={this.handleChangeIndustry} />
          </div>

          <Button color="info" size="sm" onClick={this.handleSubmit}>Search</Button>
        </div>

        <div className="ag-theme-alpine" style={ {height: '600px', width: '625px'} }>
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            pagination={true}
            paginationPageSize="50">
          </AgGridReact>
        </div>
      </div>
    );
  }
}

export default Stock;
