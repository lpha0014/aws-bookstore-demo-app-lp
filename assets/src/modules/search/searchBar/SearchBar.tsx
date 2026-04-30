import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './searchBar.css';

export function SearchBar() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (value) navigate(`/search/${value}`);
  };

  return (
    <form className="searchform mainsearch" onSubmit={onSearch}>
      <div className="row">
        <div className="col-md-8 search-padding">
          <div className="input-group">
            <span className="input-group-text addon-black no-radius">Search</span>
            <input type="text" className="form-control no-radius" value={value} onChange={(e) => setValue(e.target.value)} />
            <button className="btn btn-orange no-radius" type="submit">🔍</button>
          </div>
        </div>
        <div className="col-md-4 title-padding">
          <h3 className="no-margin white">Best<span className="orange">{` deals `}</span>of the day</h3>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
