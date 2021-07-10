import React from 'react';
import Loader from 'react-loader-spinner';
import DisplayOptions from './DisplayOptions';
import EmployeeCard from './EmployeeCard';
import * as EmployeesService from '../services/EmployeesService';
import ResultsCount from './ResultsCount';
import ClearFilter from './ClearFilter';
import './EmployeeDirectory.css';

class EmployeeDirectory extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      employees: [],
      departments: [],
      locations: [],
      filterByDepartment: '',
      filterByLocation: '',
      searchTerm: '',
      sortBy: ''
    };
    this.clearAllFilters = this.clearAllFilters.bind(this);
    this.handleClearFilter = this.handleClearFilter.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  async componentDidMount() {
    this.setState({
      isLoading: false,
      employees: await EmployeesService.getEmployees(),
      departments: EmployeesService.getDepartments(),
      locations: EmployeesService.getLocations()
    });
  }

  async clearAllFilters() {
    this.setState({
      filterByDepartment: '',
      filterByLocation: '',
      searchTerm: '',
      employees: await EmployeesService.getEmployees()
    });
  }

  handleClearFilter() {
    this.clearAllFilters();
  }

  handleFilter(event) {
    const {name, value} = event.target;
    if (value === '') return this.clearAllFilters();
    if (name === 'department') {
      this.setState({
        filterByDepartment: value,
        employees: EmployeesService.filterByDepartment(value)
      });
    }
    if (name === 'location') {
      this.setState({
        filterByLocation: value,
        employees: EmployeesService.filterByLocation(value)
      });
    }
  }

  handleSearch(event) {
    const term = event.target.value;
    this.setState({
      searchTerm: term,
      employees: EmployeesService.search(term)
    });
  }

  handleSort(event) {
    let {value} = event.target;
    if (value === '') value = 'sortByLastName';
    this.setState(prevState => {
      return {
        sortBy: value,
        employees: prevState.employees.sort(EmployeesService[value])
      };
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className="loading">
          <h2>Loading...</h2>
          <Loader type="ThreeDots" color="orange" width={175} height={125} />
        </div>
      );
    }

    const employeeCards = this.state.employees.map(employee => {
      return (
        <EmployeeCard
          key={employee.login.uuid}
          pictureUrl={employee.picture.medium}
          firstName={employee.name.first}
          lastName={employee.name.last}
          email={employee.email}
          phone={employee.phone}
          location={`${employee.location.city}, ${employee.location.state}`}
          title={employee.title}
          department={employee.department}
          searchTerm={this.state.searchTerm}
        />
      );
    });

    const filters = {
      filterByDepartment: this.state.filterByDepartment,
      filterByLocation: this.state.filterByLocation,
      searchTerm: this.state.searchTerm
    };

    return (
      <div className="employee-directory">
        <DisplayOptions
          departments={this.state.departments}
          locations={this.state.locations}
          handleFilter={this.handleFilter}
          filterByDepartment={this.state.filterByDepartment}
          filterByLocation={this.state.filterByLocation}
          handleSearch={this.handleSearch}
          searchTerm={this.state.searchTerm}
          sortBy={this.state.sortBy}
          handleSort={this.handleSort}
        />
        <div className="filter-status">
          <ResultsCount
            total={EmployeesService.totalEmployees}
            showing={this.state.employees.length}
          />
          <ClearFilter
            filters={filters}
            handleClearFilter={this.handleFilter}
          />
        </div>
        {this.state.searchTerm && this.state.employees.length === 0 ? (
          <h3>No matches found...</h3>
        ) : (
          employeeCards
        )}
      </div>
    );
  }
}

export default EmployeeDirectory;
