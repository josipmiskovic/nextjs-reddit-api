import React, { Component } from 'react'

export interface PostProps {
    data: PostData;
}
export interface PostData { 
    title: string;
    url: string;
}

export default class Post extends Component<PostProps> {
  render() {
    const { data } = this.props

    return (
      <div>
        <a href={ data.url }>
            <h3>{data.title}</h3>
        </a>
      </div>
    )   
  }
}