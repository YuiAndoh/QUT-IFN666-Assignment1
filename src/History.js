import React, {Component} from "react";
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Line } from 'react-chartjs-2';
import { Button } from "reactstrap";

class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: "Date", field: "timestamp", sortable: true, cellRendererFramework:
            function(param) {
              let paramDate = new Date(param.value).toLocaleDateString();
              return (
                <div>{paramDate}</div>
              );
            }
        },
        { headerName: "Open", field: "open", sortable: true },
        { headerName: "High", field: "high", sortable: true },
        { headerName: "Low", field: "low", sortable: true },
        { headerName: "Close", field: "close", sortable: true },
        { headerName: "Volumes", field: "volumes", sortable: true },],
      rowData: [],
      originalData: [],
      loading: true,
      stockName: "",
      stockID: "",
      searchDate: "",
      data: { labels: [""],
              datasets: [
                {
                  label: 'Closing Price',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'rgba(75,192,192,1)',
                  pointBackgroundColor: 'rgba(75,192,192,1)',
                  pointBorderWidth: 1,
                  pointHoverRadius: 6,
                  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 3,
                  pointHitRadius: 10,
                  data: [0]
                }
      ]}
    } 

    // Bind methods defined below to this component instance
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateChartData = this.updateChartData.bind(this);
  }

  // Get a user input for the record starting date
  handleChangeDate(event) {
    this.setState({searchDate: event.target.value});
  }

  // Perform search locally
  handleSubmit(event) {
    let queryDate = this.state.searchDate;
    let rowdataValue = this.state.originalData;
    let arr = [];
    let queryDateObj = new Date(queryDate);

    // Only considering the use in eastern Australia (UTC+10)
    queryDateObj.setHours(queryDateObj.getHours() - 10);

    // When there is a user input - show records from the specified date
    if (queryDate !== "") { 
      rowdataValue.forEach (function(dailyStock) {
        let dailyStockDate = new Date(dailyStock.timestamp);
        if (dailyStockDate >= queryDateObj) {
          arr.push(dailyStock);
        }
      })
    }

    // When there is no user input - clear the filtering and show all records in the database
    if (queryDate === "") {
      rowdataValue.forEach (function(dailyStock) {
        arr.push(dailyStock);
      })
    }

    // set arr (filtering result) to rowData - this is to overwrite rowData only when the user performs the search and to maintain the original value elsewhere
    this.setState({rowData: arr}, () => {this.updateChartData()});
    event.preventDefault();
  }

  // Update the chart based on the user input and visualize the data in a user-friendly way
  updateChartData () {
    let rd = this.state.rowData;
    let dataValues = this.state.data;
    let dateArr = [];
    let closeArr = [];
    
    rd.forEach (function(item) {
      let itemTimestampDate = new Date(item.timestamp);
      dateArr.push(itemTimestampDate.toLocaleDateString());
      closeArr.push(item.close);
    })

    dateArr.reverse();
    closeArr.reverse();
    dataValues.labels = dateArr;
    dataValues.datasets[0].data = closeArr;
    this.setState({data: dataValues});
  }


  componentDidMount() {
    this.setState({stockID: this.props.match.params.stock});

    // axios.get(`http://131.181.190.87:3001/history?symbol=`+ this.props.match.params.stock)  // The original endpoint provided by the unit
    axios.get(`http://localhost:3001/history?symbol=`+ this.props.match.params.stock)
      .then(res => {
        let rowdataVal = res.data;
        this.setState({rowData: rowdataVal}, () => {this.updateChartData()});
        this.setState({originalData: rowdataVal});
        this.setState({stockName: rowdataVal[0].name});
        this.setState({loading: false});
      });
  }


  render() {
    // When still in loading process
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
          <label htmlFor="date" className="label">Search date from:</label>

          <div className="form" style={ {display: "inline"} }>
            <input type="date" id="date" value={this.state.searchDate} onChange={this.handleChangeDate} />
          </div>

          <div className="button" style={ {display: "inline"} }>
            <Button color="info" size="sm" onClick={this.handleSubmit}>Submit</Button>
          </div>
        </div>

        <h2 className="heading">{this.state.stockName}</h2>

        <div className="ag-theme-alpine" style={ {height: '300px', width: '1220px'} }>
          <AgGridReact
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}
              pagination={true}
              paginationPageSize="30">
          </AgGridReact>
        </div>

        <div className="chart" style={ { width: '1220px'} }>
          <Line data={this.state.data} />
        </div>
      </div>
    );
  }
}

export default History;