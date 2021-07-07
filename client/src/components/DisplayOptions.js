import React from 'react';

function DisplayOptions(props) {
  const departmentOptions = props.departments.map((d, i) => (
    <option key={i} value={d}>
      {d}
    </option>
  ));
  const locationOptions = props.locations.map((l, i) => (
    <option key={i} value={l}>
      {l}
    </option>
  ));

  return (
    <fieldset className="display-options">
      <div className="filters">
        <span>
          <small>Filter by:</small>
        </span>
        <select name="department" onChange={props.handleFilter} value={props.filterByDepartment}>
          <option value="">Department</option>
          {departmentOptions}
        </select>
        <select name="location" onChange={props.handleFilter} value={props.filterByLocation}>
          <option value="">Location</option>
          {locationOptions}
        </select>
      </div>
      <div className="search">
        <input
          type="search"
          placeholder="Search"
          name="searchTerm"
          onChange={props.handleSearch}
          value={props.searchTerm}
        />
      </div>
    </fieldset>
  );
}

export default DisplayOptions;