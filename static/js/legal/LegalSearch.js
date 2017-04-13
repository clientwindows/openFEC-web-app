const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const URI = require('urijs');
const Filters = require('./Filters');
const SearchResults = require('./SearchResults');
const Pagination = require('./Pagination');

class LegalSearch extends React.Component {
  constructor(props) {
    super(props);
    const initState = URI.parseQuery(window.location.search);
    initState.q = initState.search;
    initState.type = initState.search_type;
    initState.advisory_opinions = [];
    initState.from_hit = initState.from_hit ? parseInt(initState.from_hit, 10) : 0;
    this.state = initState;

    this.getResults = this.getResults.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.instantQuery = this.instantQuery.bind(this);
    this.getResults();
  }

  setQuery(e, callback) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const newState = {[e.target.name]: value, lastFilter: e.target.name};

    if(e.target.name !== 'from_hit') {
      newState.from_hit = 0;
    }

    this.setState(newState, () => {
      if(callback) {
        callback();
      }
    });
  }

  instantQuery(e) {
    this.setQuery(e, this.getResults);
  }

  getResults(e) {
    if(e) {
      e.preventDefault();
    }
    let queryPath = URI(window.API_LOCATION)
                .path([window.API_VERSION, 'legal', 'search'].join('/'))
                .addQuery('api_key', window.API_KEY)
                .addQuery('type', 'advisory_opinions');

    const queryState = Object.assign({}, this.state);
    queryState.search = queryState.q;
    Object.keys(queryState).forEach((queryParam) => {
      if(['advisory_opinions', 'resultCount', 'lastResultCount', 'lastFilter'].indexOf(queryParam) === -1
          && queryState[queryParam]) {
        queryPath = queryPath.addQuery(queryParam, queryState[queryParam]);
      }
    })
    const lastResultCount = this.state.resultCount;
    $.getJSON(queryPath.toString(), (results) => {
                  this.setState({ advisory_opinions: results.advisory_opinions,
                  resultCount: results.total_advisory_opinions,
                  lastResultCount }, () => {
                    window.history.pushState(URI.parseQuery(queryPath.query()),
                      null, queryPath.search().toString());
                  });
                });
  }

  render() {
    return <section className="main__content--full data-container__wrapper">
      <div id="filters" className="filters is-open">
        <button className="filters__header js-filter-toggle" type="button">
          <span className="filters__title">Edit filters</span>
        </button>
        <div className="filters__content">
          <Filters query={this.state} setQuery={this.setQuery}
                getResults={this.getResults} instantQuery={this.instantQuery} />
        </div>
      </div>
      <div id="results-{{ result_type }}" className="content__section data-container__body">
        <div className="results-info results-info--simple">
          <div className="results-info__left">
            <h2 className="results-info__title">Searching Advisory Opinions</h2>
          </div>
        </div>
        <SearchResults advisory_opinions={this.state.advisory_opinions} q={this.state.q} />
        <Pagination from_hit={this.state.from_hit} advisory_opinions={this.state.advisory_opinions}
          resultCount={this.state.resultCount} handleChange={this.instantQuery} />
      </div>
    </section>
}
}

ReactDOM.render(
  <LegalSearch />,
  document.getElementById('root'));
