import * as React from 'react'
import { Admin, IResource } from '../lib/Admin'
import './style.css'

const users: IResource = {
    name: 'User',
    url: '/user',
    descriptiveField: 'name',
    fields: [
        { name: 'id', type: 'text', filterable: false },
        { name: 'name', type: 'text', filterable: true },
    ],
}

const posts: IResource = {
    name: 'Post',
    url: '/post',
    descriptiveField: 'title',
    fields: [
        { name: 'id', type: 'text', filterable: false },
        {
            name: 'userId',
            type: 'reference',
            references: users,
            filterable: true,
        },
        { name: 'title', type: 'text', filterable: true },
        { name: 'body', type: 'longText' },
    ],
}

const resources = [users, posts]

class App extends React.Component {
    render() {
        return <Admin resources={resources} />
    }
}

export { App }
