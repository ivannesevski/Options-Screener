import React from 'react';
import SearchBar from './SearchBar';
import OptionTable from './OptionTable';
import * as api from '../api';

class App extends React.Component {
    state = {
        table: false,
        ticker: '',
        tableData: {}
    }

    fetchOptionData = (event, ticker) => {
        event.preventDefault();

        api.fetchOptionData(ticker).then((data) => {
            if (data.length != 0) {
                this.setState({
                    tableData: data, 
                    table: true, 
                    ticker: ticker,
                });
            }
        })
    }
    
    currentContent() {
        if (!this.state.table) {
            return (
                <SearchBar onSearch={this.fetchOptionData} size={1} />
            );
        } else {
            return (
                <div className="container-fluid">
                    <div className="row header">
                        <SearchBar onSearch={this.fetchOptionData} size={0}/>
                    </div>
                    <div className="row">
                        <OptionTable 
                        key={this.state.ticker}
                        optionData={this.state.tableData.optionData.optionQuotes}
                        ticker={this.state.ticker}
                        symbolDesc={this.state.tableData.symbolDesc}
                        symbolLastPrice={this.state.tableData.symbolLastPrice}
                        symbolPrevClosePrice={this.state.tableData.symbolPrevClosePrice} />
                    </div>
                </div>
            );
        }
    }

    render() {
        return this.currentContent();
    }
}

export default App;