import React, {Component} from "react";

class Landing extends Component {
 
  render() {
    return (
      <div className="container">
        <div className="box">
          <div className="content">
            <h2 className="heading">Stock Prices</h2>
            <p>Welcome to Stock Prices!<br />
               To start exploring stock prices, click on Stock tab at the top of the page.</p>
            <ul>
              <li>You can search stocks by symbol/industry.</li>
              <li>You can sort stocks in an ascending/descending order by clicking the column name.</li>
              <li>You can click on stocks to view the latest 100 days of activity.</li>
              <li>You can specify a date from which you want to see the record up to the latest date.</li>
              <li>This application shows a line chart of closing prices in each stock page.</li>
            </ul>
          </div>
          <div className="content">
            <img src="report_analysis.svg" alt="Web application" />
          </div>
        </div>
      </div>
    )
  }
}

export default Landing;
