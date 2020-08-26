import React from 'react';
import PropTypes from 'prop-types';

class SearchBar extends React.Component {
    state = {
        ticker: '',
        size: this.props.size
    };

    componentDidMount() {
        if (this.state.size == 0) {
            $('#search-div').attr("class", "top");
            $('#search-icon').attr({
                'width': '28px',
                'height': '28px'
            });
            $('#search-input').attr("class", "small-search" );
        }
    }

    tickerChange = (event) => {
        this.setState({ticker: event.target.value});
    }

    onSearch = (event) => {
        $('#search-input').val('');
        this.props.onSearch(event, this.state.ticker); 
    }
    
    render() {
        return (
            <div id='search-div' className="center">
                <form className="h-100" onSubmit={this.onSearch} spellCheck="false">
                    <div className="h-100 row no-gutters">
                        <div id="input-div" className="col-sm no-gutters">
                            <input id="search-input" className="large-search" type="text" name="ticker" onChange={this.tickerChange} autoComplete="off" required autoFocus></input>
                        </div>
                        <div id="btn-div" title="Search for a stock" className="col-sm-auto no-gutters">
                            <button type="submit">
                                <svg id="search-icon" width="60px" height="60px" viewBox="0 0 16 16" className="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                                    <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </form> 
            </div>
        );
    }
}

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired
}

export default SearchBar;