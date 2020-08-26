import React from 'react';
import PropTypes from 'prop-types';

class OptionTable extends React.Component {
    numContracts = 0;

    componentDidMount() {
        $('#info').html(`<b>${this.numContracts}</b> open contracts found`);
        let priceChange = (this.props.symbolLastPrice - this.props.symbolPrevClosePrice).toFixed(2);
        let priceChangePercent = ((priceChange / this.props.symbolPrevClosePrice) * 100).toFixed(2);
        $('#price-change').html(` ${priceChange} (${priceChangePercent}%)`);
        let color = 'red';
        if (priceChange > 0) {
            color = 'green';
        }
        $('#price-change').css('color', color);
        let optionTable = $(this.refs.main).DataTable({
            scrollY: '50vh',
            scrollCollapse: true,
            paging: false,
            searching: false,
            info: false,
            colReorder: true
        });
    }

    componentWillUnmount() {
        $(this.refs.main).DataTable().destroy(true);
    }

    shouldComponentUpdate() {
        return false;
    }

    extractFromSymbol(symbol, underlying) {
        let symbolData = {};
        let typeIndex = symbol.lastIndexOf('C');                             
        
        if ((typeIndex != -1) && (typeIndex > underlying.length)) {
            symbolData.type = 'Call';
        } else {
            typeIndex = symbol.lastIndexOf('P');
            symbolData.type = 'Put';
        }

        let fullExpiry = symbol.substring(underlying.length, typeIndex);
        let year = fullExpiry.substring(fullExpiry.length - 2);
        let month = fullExpiry.substring(fullExpiry.length - 5, fullExpiry.length - 2);
        let day = fullExpiry.substring(0, fullExpiry.length - 5);

        symbolData.expiry = `${month}. ${day}, 20${year}`;
        symbolData.strike = symbol.substring(typeIndex + 1);

        return symbolData;
    }

    render() {
        return (
            <div id="table-div" className="container-fluid">
                <div className="row">
                    <div id="symbol-desc" className="col-sm-auto"><b>{this.props.symbolDesc} ({this.props.ticker.toUpperCase()})</b></div>
                    <div className="col-sm"></div>
                </div>
                <div className="row">
                    <div id="share-price" className="col-sm-auto">
                        <span>{this.props.symbolLastPrice}</span> 
                        <span id="price-change"></span> 
                    </div>
                    <div className="col-sm"></div>
                </div>
                <table id="option-table" className="table table-dark table-hover text-center" ref="main">
                    <thead>
                        <tr>
                            <th scope="col" title="Expiry date of the contract">Expiry</th>
                            <th scope="col" title="Strike price of the contract">Strike</th>
                            <th scope="col" title="Type of the contract">Type</th>
                            <th scope="col" title="Number of contracts currently open">Open</th>
                            <th scope="col" title="Number of contracts traded today">Volume</th>
                            <th scope="col" title="Risk level of the contract">Implied Volatility</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.optionData.flatMap((option) => {
                            if (option.openInterest != 0) {
                                const symbolData = this.extractFromSymbol(option.symbol, option.underlying);
                                this.numContracts += 1;
                                return (
                                    <tr key={option.symbolId}>
                                        <td>{symbolData.expiry}</td>
                                        <td>{symbolData.strike}</td>
                                        <td>{symbolData.type}</td>
                                        <td>{option.openInterest}</td>
                                        <td>{option.volume}</td>
                                        <td>{`${option.volatility.toFixed(2)}%`}</td>
                                    </tr>
                                );
                            } else {
                                return [];
                            }                          
                        })}
                    </tbody>
                </table>
                <div className="row">
                    <div id="info" className="col-sm-4"></div>
                    <div className="col-sm"></div>
                </div>
            </div>
        );
    }
}

OptionTable.propTypes = {
    optionData: PropTypes.array.isRequired,
    ticker: PropTypes.string.isRequired,
    symbolDesc: PropTypes.string.isRequired,
    symbolLastPrice: PropTypes.number.isRequired,
    symbolPrevClosePrice: PropTypes.number.isRequired,
}


export default OptionTable;