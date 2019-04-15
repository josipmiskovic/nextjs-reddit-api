import React, { Component } from 'react'


export interface IPicker {
    value: string;
    onChange: (nextSubreddit: string) => void;
    options: string[];
    
}
export default class Picker extends Component<IPicker> {
  render() {
    const { value, onChange, options } = this.props

    return (
      <span>
        <h1>Latest posts from {value}</h1>
        <select onChange={e => onChange(e.target.value)} value={value}>
          {options.map(option => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </span>
    )
  }
}