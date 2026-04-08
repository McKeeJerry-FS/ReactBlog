import PropTypes from 'prop-types'

export function PostFilter({ field, value, onChange }) {
  return (
    <div className='mb-3'>
      <label
        htmlFor={`filter-${field}`}
        className='form-label text-capitalize fw-semibold'
      >
        {field}
      </label>
      <input
        id={`filter-${field}`}
        type='text'
        name={`filter-${field}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='form-control'
        placeholder={`Filter by ${field}...`}
      />
    </div>
  )
}
PostFilter.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
